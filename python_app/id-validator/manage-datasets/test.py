#Testing your model 
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np

# Load the trained model
model = load_model("./drawing_face_classifier-v1.h5")

# Function to preprocess the image
def preprocess_image(image_path):
    # Load the image with target size (224, 224)
    img = load_img(image_path, target_size=(224, 224))
    # Convert the image to a numpy array
    img_array = img_to_array(img)
    # Rescale pixel values to [0, 1]
    img_array = img_array / 255.0
    # Expand dimensions to match the model input shape (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Test the model with a sample image
image_path = "./sample_images/s17.jpg"  # Replace with the path to your test image
preprocessed_image = preprocess_image(image_path)

# Make a prediction
prediction = model.predict(preprocessed_image)

# Interpret the prediction
# the llower the percentage the high chance it is a real person
if prediction[0][0] > 0.25:
    print(f"Prediction {prediction[0][0]} : The image {image_path} is classified as 'Not Real' with confidence {prediction[0][0] * 100:.2f}%")
else:
    print(f"Prediction {prediction[0][0]} : The image {image_path} is classified as 'Real' with confidence {(1-prediction[0][0]) * 100:.2f}%")
