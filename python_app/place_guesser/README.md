# PLACE GUESSER BASED ON SUBMITTED USER HISTORY

Process:

**Step 1: Loading the Dataset**

Validate the file being sent whether `.csv` or `.json` else, it will throw an error.

**Step 2: Validating Individual Entries**

Checking if date, day, and time fields are properly formatted and not empty.

**Step 3: Preprocess Data**

Creating new features from the existing dataset : 
    
  Columns:

    ['day', 'fromLocation', 'toLocation', 'month', 'day_of_month', 'weekday',
       'hour', 'half_hour', 'is_weekend']


**Step 4: Validate Future Data**

Checking if the submitting Future Data Entries are valid. `toLocation` must be left empty.
    Format must be :

    [{
        "date": "2025-01-15",
        "day": "Thursday",
        "time": "18:45",
        "fromLocation": "Some City Here",
        "toLocation": ""
    }]

**Step 5: Split Data into Training and Testing Sets**

The `split_data` function splits the dataset into training and testing sets.

**Step 6: Train the Model**

The `train_model` function uses Random Forest model for training the data

**Step 7: Evaluate the Model**

 `evaluate_model` Checks Accuracy of the model 

**Step 8: Prediction Function with Validation**

`predict_and_store_toLocation` predicts the toLocation for future data.


