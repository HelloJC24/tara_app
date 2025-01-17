import cv2
import pytesseract
from PIL import Image
import numpy as np
import requests
from io import BytesIO

# Load the image from the URL
image_url = "https://grit.ph/wp-content/uploads/2020/05/passport-1.jpg"
response = requests.get(image_url)
imagePillow = Image.open(BytesIO(response.content))
img = cv2.cvtColor(np.array(imagePillow), cv2.COLOR_RGB2BGR)

def ocr_core(img):
    text = pytesseract.image_to_string(img)
    return text

# get grayscale of the image
def get_grayscale(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# noise removal
def remove_noise(img):
    return cv2.medianBlur(img, 1)

# thresholding
def thresholding(img):
    ret, binary_img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return binary_img

# Sharpen image
def sharpen_image(img):
    # Define the sharpening kernel 
    # kernel = np.array([[ 0, -1,  0], [-1,  9, -1], [ 0, -1,  0]])

    kernel = np.array([[0, -1, 0], [-1, 5,-1], [0, -1, 0]])
    return cv2.filter2D(src=img, ddepth=-1, kernel=kernel)

# Apply image processing steps
img = get_grayscale(img)
resized = cv2.resize(img, (1191, 2000))
img = remove_noise(img)
img = thresholding(img)
# img = sharpen_image(img)

# Run OCR and print result
print(ocr_core(img))
print(len(ocr_core(img)))

# Display the processed image
try:
    cv2.imshow('Processed Image', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
except cv2.error as e:
    print(f"Error displaying image: {e}")
