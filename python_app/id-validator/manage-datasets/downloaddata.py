#dataset source, run this for importing datasets
import kagglehub

# Download latest version
path = kagglehub.dataset_download("pushpakbhoge/fake-or-real")

print("Path to dataset files:", path)