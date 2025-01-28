#run this code for creating a new model 

import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
import numpy as np

# Define paths
train_dir = os.path.abspath('./dataset/train')
val_dir = os.path.abspath('./dataset/val')

# Data augmentation and preprocessing
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255)

# Map fake/other images to "not_real" class
def custom_class_mapping(directory):
    for subdir in os.listdir(directory):
        if subdir in ['fake', 'other']:
            source_path = os.path.join(directory, subdir)
            target_path = os.path.join(directory, 'not_real')
            
            if not os.path.exists(target_path):
                os.rename(source_path, target_path)
            else:
                for file_name in os.listdir(source_path):
                    file_path = os.path.join(source_path, file_name)
                    new_file_path = os.path.join(target_path, file_name)
                    if not os.path.exists(new_file_path):  # Avoid overwriting existing files
                        os.rename(file_path, new_file_path)
                os.rmdir(source_path)  # Remove the empty folder

# Ensure the mapping is applied to the dataset folders
custom_class_mapping(train_dir)
custom_class_mapping(val_dir)

# Create data generators
train_data = train_datagen.flow_from_directory(
    train_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary',
    classes=['real', 'not_real']
)

val_data = val_datagen.flow_from_directory(
    val_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary',
    classes=['real', 'not_real']
)

# Dynamically calculate steps_per_epoch and validation_steps
steps_per_epoch = len(train_data)
validation_steps = len(val_data)

# Build the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')  # Binary output: real vs. not_real
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=10,
    steps_per_epoch=steps_per_epoch,
    validation_steps=validation_steps
)

# Evaluate the model
val_loss, val_accuracy = model.evaluate(val_data)
print(f"Validation Accuracy: {val_accuracy * 100:.2f}%")

# Save the trained model
model.save("drawing_face_classifier.h5")
print("Model saved as drawing_face_classifier.h5")
