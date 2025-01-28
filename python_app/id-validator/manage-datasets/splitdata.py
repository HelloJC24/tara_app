#run this code for spliting and creating datasets: Validation and Training
import os
import shutil
from sklearn.model_selection import train_test_split

# Path to your dataset folder
dataset_path = "./dataset/"
categories = ['real', 'not_real']
train_path = os.path.join(dataset_path, 'train')
val_path = os.path.join(dataset_path, 'val')

# Create train and val directories
os.makedirs(train_path, exist_ok=True)
os.makedirs(val_path, exist_ok=True)

# Loop through categories and split data
for category in categories:
    category_path = os.path.join(dataset_path, category)
    
    # Check if category directory exists
    if not os.path.exists(category_path):
        print(f"Directory not found: {category_path}")
        continue

    # Filter only image files
    images = [f for f in os.listdir(category_path) if f.endswith(('.jpg', '.png', '.jpeg'))]
    
    # Check if there are any images
    if len(images) == 0:
        print(f"No images found in: {category_path}")
        continue

    train_images, val_images = train_test_split(images, test_size=0.2, random_state=42)
    
    # Create category subfolders in train and val
    os.makedirs(os.path.join(train_path, category), exist_ok=True)
    os.makedirs(os.path.join(val_path, category), exist_ok=True)
    
    # Move training images
    for image in train_images:
        shutil.move(os.path.join(category_path, image), os.path.join(train_path, category, image))
    
    # Move validation images
    for image in val_images:
        shutil.move(os.path.join(category_path, image), os.path.join(val_path, category, image))

print("Dataset successfully split into train and val!")
