# ID CARD Validator with Face Recognition

This project provides a FastAPI application that processes ID card images to detect faces, validate authenticity, perform OCR (Optical Character Recognition) to extract text, and optionally match the face on the ID card against a reference image.

The step by step process of the code are as follows:
1. Detect if a face is present in ID .
2. Validate face quality if ID Card (Real Human Face).
3. Optionally match the face with a reference image.
4. Classify the ID type (using the texts in the OCR image). (On Progress)
5. OCR image (e.g. get ID number,type and name) and print output in json format (On Progress): 


## Features

- **Face Detection**: Detect faces from the ID card image.
- **Face Validation**: Validate the quality of the detected face using a pre-trained model.
- **OCR**: Extract text from the ID card image and identify the type of ID.
- **Face Matching**: Compare the detected face against a reference face from an optional reference image.

### Requirements

Ensure that you have Python 3.11 or higher installed.

To run this application, you need the following Python libraries:

- `fastapi`: For creating the web server.
- `requests`: For making HTTP requests to fetch images.
- `opencv-python`: For image processing and face detection.
- `pytesseract`: For Optical Character Recognition (OCR).
- `numpy`: For handling image data as arrays.
- `tensorflow`: For loading and using the pre-trained face classification model.
- `face_recognition`: For face encoding and comparison.
- `re`: For handling regular expressions in OCR processing.

You can install these dependencies by running the following command:

```bash
pip install -r requirements.txt
```

### Setup
1. **Install Dependencies**: To install the required libraries, you can use pip:
```bash
pip install -r requirements.txt
```
2. **Download Pre-trained Model**:
   The project uses a pre-trained face classification model (`drawing_face_classifier-v1.h5`) located in the `model/` directory. Make sure to place the model file in the correct folder.

   If you don't have the model, you will need to obtain it and place it in the `model/` directory.

### Running the FastAPI Server

To run the FastAPI server, follow these steps:

Save the FastAPI code in a file (filename: `app.py` ).


**Run the server using the following command:**

```bash
uvicorn app:app --reload
```
Default Link:  `http://127.0.0.1:8000`

### API Endpoints
`/process-id-card`

Request: A GET request with the following query parameters:

`id_card_url` (required): The URL of the ID card image.
`reference_url` (optional): The URL of the reference image for face matching. 

Example:

```bash
http://127.0.0.1:8000/process-id-card?id_card_url=https://example.com/id_card.jpg&reference_url=https://example.com/reference_image.jpg
```

Response:
```bash
{
  "reference_image": "matched" or "unmatched" or "none",
  "name": "Extracted Name from OCR",
  "id_type": "Passport" or "Driver's License" or "etc",
  "id_number": "Some ID Number Here",
  "text_in_id": "Full OCR text from ID card"
}

```
