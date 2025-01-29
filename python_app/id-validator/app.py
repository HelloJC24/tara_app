from fastapi import FastAPI, HTTPException, Query
import requests
import cv2
import pytesseract
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from face_recognition import face_encodings, compare_faces
import re

# Initialize FastAPI app
app = FastAPI()

# Load pre-trained face classification model
face_classifier_model = load_model('model/drawing_face_classifier-v1.h5')

# Utility Functions
def fetch_image_from_url(url: str):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        image = np.frombuffer(response.content, np.uint8)
        return cv2.imdecode(image, cv2.IMREAD_COLOR)
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image from URL: {url}. Error: {e}")

def detect_faces(image, padding=20):
    """Detect faces in the given image using Haar cascades."""
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)

    cropped_faces = [
        image[max(y - padding, 0):min(y + h + padding, image.shape[0]),
              max(x - padding, 0):min(x + w + padding, image.shape[1])]
        for x, y, w, h in faces
    ]
    return cropped_faces

def preprocess_face(face_crop):
    """Preprocess face crop for classification."""
    face_crop_rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
    img = cv2.resize(face_crop_rgb, (224, 224))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

def validate_face_quality(faces):
    """Validate face quality using the pre-trained model."""
    for face_crop in faces:
        preprocessed_face = preprocess_face(face_crop)
        prediction = face_classifier_model.predict(preprocessed_face)[0][0]
        print(prediction)
        if prediction <= 0.25:  # Threshold for a "real" face ADJUST THIS ACCORDINGLY
            return True
    return False

def compare_face_with_reference(face_image, ref_image):
    """Match a face against a reference image using face encodings."""
    face_enc = face_encodings(face_image)[0]
    ref_enc = face_encodings(ref_image)[0]
    return compare_faces([ref_enc], face_enc)[0]

def perform_ocr(image):
    """Perform OCR to extract text from the ID image."""
    ocr_text = pytesseract.image_to_string(image)
    id_type = "Passport" if "passport" in ocr_text.lower() else "Driver's License" if "license" in ocr_text.lower() else "Unknown"
    name = re.search(r"Name:\s*(.*)", ocr_text)
    id_number = re.search(r"ID\s*Number:\s*(\d+)", ocr_text)

    return {
        "name": name.group(1).strip() if name else "Unknown",
        "id_type": id_type,
        "id_number": id_number.group(1).strip() if id_number else "Unknown",
        "text_in_id": ocr_text
    }

# API Endpoint
@app.get("/process-id-card")
def process_id_card(
    id_card_url: str = Query(..., description="URL of the ID card image"),
    reference_url: str = Query(None, description="Optional URL of the reference image")
):
    """
    Process an ID card image for face detection, validation, OCR, and optional face matching.
    """
    id_card_image = fetch_image_from_url(id_card_url)
    faces = detect_faces(id_card_image)

    if not faces:
        raise HTTPException(status_code=400, detail="No face detected on the ID card.")
    
    if not validate_face_quality(faces):
        raise HTTPException(status_code=400, detail="Invalid ID Card Detected: Ensure ID Card Authenticity.")

    ref_status = "none"
    if reference_url:
        # logging.info(f"Processing reference image from URL: {reference_url}")
        ref_image = fetch_image_from_url(reference_url)
        if ref_image is None:
            raise HTTPException(status_code=400, detail="Invalid reference image or URL.")

        faces_in_ref = detect_faces(ref_image)
        if not faces_in_ref:
            raise HTTPException(status_code=400, detail="No face detected in the reference image.")

        try:
            ref_face_enc = face_encodings(ref_image)[0]
            id_face_enc = face_encodings(id_card_image)[0]
            match_result = compare_faces([ref_face_enc], id_face_enc)[0]
            ref_status = "matched" if match_result else "unmatched"
        except IndexError:
            raise HTTPException(status_code=400, detail="Failed to encode faces for comparison.")
    else:
        ref_status = "none"

    ocr_result = perform_ocr(id_card_image)
    return {"reference_image": ref_status, **ocr_result}

# Run Example
# Save the code in a file (e.g., `app.py`), then run the FastAPI server using:
# uvicorn app:app --reload
