import requests
import cv2
import pytesseract
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

from face_recognition import load_image_file, face_encodings, compare_faces
import re
import json

# Load pre-trained models
face_classifier_model = load_model('model/drawing_face_classifier-v1.h5')

# Step 1: Validate URLs and Load Images
def validate_and_load_image(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            image = np.frombuffer(response.content, np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            return image
        else:
            raise Exception("Invalid URL or Unable to Fetch Image")
    except Exception:
        return None

# Step 2: Detect Face
def detect_face(image, padding=20):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)
    
    cropped_faces = []
    i =0
    for x, y, w, h in faces:
        x_pad = max(x - padding, 0)
        y_pad = max(y - padding, 0)
        w_pad = min(x + w + padding, image.shape[1]) - x_pad
        h_pad = min(y + h + padding, image.shape[0]) - y_pad
        face_crop = image[y_pad:y_pad + h_pad, x_pad:x_pad + w_pad]
        cropped_faces.append(face_crop)
            # View cropped face """OPTIONAL ONLY YOU MAY COMMENT THIS OUT"""
        cv2.imshow(f"Face {i+1}", face_crop)
        cv2.waitKey(0)  
        cv2.destroyAllWindows()  

        # Optional: Save the cropped face to a file
        cv2.imwrite(f"cropped_face_{i+1}.jpg", face_crop)

    return cropped_faces

# Step 3: Validate Face Quality
def preprocess_face(face_crop):
    face_crop_rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
    img = cv2.resize(face_crop_rgb, (224, 224))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

def validate_face(faces):
    for face_crop in faces:
        preprocessed_face = preprocess_face(face_crop)
        prediction = face_classifier_model.predict(preprocessed_face)[0][0]
        
        if prediction <= 0.43:  # Threshold for a "real" face ADJUST THIS ACCORDINGLY
            return True, prediction
    return False, 0

# Step 4: Match Reference Image
def match_reference(face_image, ref_image):
    face_enc = face_encodings(face_image)[0]
    ref_enc = face_encodings(ref_image)[0]
    return compare_faces([ref_enc], face_enc)[0]

# Step 5: OCR and Classification
def ocr_and_classify(image):
    ocr_text = pytesseract.image_to_string(image)
    id_type = "Passport" if "passport" in ocr_text.lower() else "Driver's License" if "license" in ocr_text.lower() else "Unknown"
    name = re.search(r"Name:\s*(.*)", ocr_text)
    id_number = re.search(r"ID\s*Number:\s*(\d+)", ocr_text)
    return {
        "name": name.group(1) if name else "Unknown",
        "id-type": id_type,
        "id-number": id_number.group(1) if id_number else "Unknown",
        "texts-in-Id": ocr_text
    }

# Main Workflow
def process_id_card(url1, url2=None):
    id_card_image = validate_and_load_image(url1)
    if id_card_image is None:
        return json.dumps({"error": "Invalid ID Card Image URL"})

    faces = detect_face(id_card_image)
    if len(faces) == 0:
        return json.dumps({"error": "No face detected on the ID card."})

    is_valid_face, confidence = validate_face(faces) 
    if not is_valid_face:
        return json.dumps({"error": "Invalid ID Card Detected: Ensure ID Card Authenticity. By the mean time, here's what you can try:\n 1. Submit a clear ID Card. 2. Make sure the face is clear on the ID card (e.g. not blurry, no glares)"})

    ref_status = "none"
    if url2:
        ref_image = validate_and_load_image(url2)
        if ref_image is None:
            return json.dumps({"error": "Invalid Reference Image URL"})
        ref_status = "matched" if match_reference(id_card_image, ref_image) else "unmatched"

    ocr_result = ocr_and_classify(id_card_image)
    return json.dumps({"reference_image": ref_status, "Face ID Dection Accuracy: ": f"{round((1- confidence)*100,2)}%", **ocr_result })

# Example Usage
url1 = "http://localhost/id_validator/sample_images/demo9.jpg" 
# url2 = "http://localhost/id_validator/sample_images/s1.jpg"
response = process_id_card(url1)
print(json.dumps(response))
