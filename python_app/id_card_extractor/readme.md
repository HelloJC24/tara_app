# OCR Text Extraction API

This project provides a FastAPI-based service to extract text from images via OCR (Optical Character Recognition). The user provides the URL of an image, which the API processes and returns extracted text and its length.

---

## Features
- Accepts image URLs via GET requests.
- Preprocesses images using OpenCV (grayscale, noise removal, thresholding).
- Extracts text from processed images using Tesseract-OCR.

---

## Prerequisites

1. **Python 3.8 or Higher**  
   Download and install from [Python's official site](https://www.python.org/downloads/).

2. **Tesseract-OCR**  
   - **Windows**:  
     Download the installer from [Tesseract GitHub Releases](https://github.com/tesseract-ocr/tesseract) and add the installation path (e.g., `C:\Program Files\Tesseract-OCR`) to your system PATH.
   - **Linux (Debian/Ubuntu)**:  
     ```bash
     sudo apt update
     sudo apt install tesseract-ocr
     ```
   - **macOS**:  
     ```bash
     brew install tesseract
     ```

3. **Git**  
   Install Git from [git-scm.com](https://git-scm.com/) if not already installed.

---

## Installation

### 1. Clone the Repository

### 2. Install Dependencies
    
     pip install -r requirements.txt
     
### 3. Verify Tesseract Installation

If Tesseract is not added to your PATH, specify its location in the main.py file:

    
    pytesseract.pytesseract.tesseract_cmd = r"C:\Path\to\tesseract.exe"  # Adjust path as needed


## Running the Application
### 1. Start Server

     uvicorn app:app --reload

### 2. Access the API Usage
**Endpoint:**

- GET /extract-text/

    **Query Parameter:** 
    - url (string): The URL of the image to process.

    Example Request:
    ```bash
    http://127.0.0.1:8000/extract-text/?url=https://grit.ph/wp-content/uploads/2020/05/passport-1.jpg
    ```

    Example Response:
```bash
    {
        "text": "Extracted text from the image here",
        "text_length": 42
    }
```

