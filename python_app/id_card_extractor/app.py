from fastapi import FastAPI, HTTPException
import cv2
import pytesseract
from PIL import Image
import numpy as np
import requests
from io import BytesIO

# Create the FastAPI app
app = FastAPI()

def fetch_image_from_url(url):
    """
    Fetches and converts the image from the given URL into OpenCV format.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        image_pillow = Image.open(BytesIO(response.content))
        img = cv2.cvtColor(np.array(image_pillow), cv2.COLOR_RGB2BGR)
        return img
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching image: {e}")

def ocr_core(img):
    """
    Extracts text from an image using pytesseract.
    """
    return pytesseract.image_to_string(img)

def get_grayscale(img):
    """
    Converts the image to grayscale.
    """
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

def remove_noise(img):
    """
    Removes noise using a median filter.
    """
    return cv2.medianBlur(img, 1)

def thresholding(img):
    """
    Applies Otsu's thresholding for binary conversion.
    """
    _, binary_img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return binary_img

@app.get("/extract-text/")
async def extract_text(url: str):
    """
    API endpoint to process an image from the given URL and extract text using OCR.
    """
    try:
        # Load and process the image
        img = fetch_image_from_url(url)
        img = get_grayscale(img)
        img = remove_noise(img)
        img = thresholding(img)

        # Extract text using OCR
        text = ocr_core(img)

        return {"text": text, "text_length": len(text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")
