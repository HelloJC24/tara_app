# Importing Datasets


Optional Download `id-validator/manage-datasets` folder if you want to create a new model

All models created is found in `./model` folder


**Steps:**
1. **Download** datasets by running `downloaddata.py` 
2. **Create folders** for your datasets 
        dataset / 
            real  *Some real face image here*
            not_real  *Some Drawing / Face like Images here*
3. **Split datasets** to train and validation images using `splitdata.py`
4. **Create Model** using ``model.py`
5. **Test** your model for accuracy using `test.py` 

