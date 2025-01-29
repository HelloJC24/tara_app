# Importing Datasets


Optional Download `id-validator/manage-datasets` folder if you want to create a new model

All models created is found in `./model` folder


**Steps:**
1. **Download** datasets by running `downloaddata.py` 
2. **Create folders** for your datasets 

        dataset /
        ├── real          # Some real face images here
        └── not_real      # Some drawing/face-like images here

4. **Split datasets** to train and validation images using `splitdata.py`
5. **Create Model** using `model.py`
6. **Test** your model for accuracy using `test.py` 

