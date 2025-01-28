### Optional : Run these files for creating black and white images

import os
from PIL import Image


def convert_images_to_bw(input_folder, output_folder):
    imageNum = 1
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        input_path = os.path.join(input_folder, filename)

        # Check if the file is an image
        if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif')):
            try:
                # Open the image
                with Image.open(input_path) as img:
                    # Convert image to black and white
                    bw_img = img.convert('L')

                    # Create the output path
                    output_path = os.path.join(output_folder, f"B{filename}")

                    # Save the black and white image
                    bw_img.save(output_path)
                    imageNum = imageNum + 1
                    print(f"Converted and saved: {output_path}")
            except Exception as e:
                print(f"Failed to process {filename}: {e}")

# Specify the input and output folder paths
input_folder = "./dataset/val/not_"  # Replace with the path to your folder of images
output_folder = "./dataset/blackandwhite"  # Replace with the path to the desired output folder

convert_images_to_bw(input_folder, output_folder)
