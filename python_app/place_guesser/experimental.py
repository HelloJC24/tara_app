# USE THIS CODE IF YOU WANT TO TEST WITHOUT THE API

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Step 1: Load the dataset

def load_data(file_path):
    """
    Load the dataset from a CSV or JSON file.
    Throws an error for unsupported file formats or invalid dataset structure and formatting.
    """
    # Load file
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.json'):
        df = pd.read_json(file_path)
    else:
        raise ValueError("Unsupported file format. Please provide a CSV or JSON file.")

    # Validate required columns
    required_columns = {'date', 'day', 'time', 'fromLocation', 'toLocation'}
    if not required_columns.issubset(df.columns):
        raise ValueError(
            f"Invalid dataset provided. Format should include the following keys: {required_columns}"
        )

    # Validate formatting and non-emptiness
    for index, row in df.iterrows():
        if not validate_entry(row):
            raise ValueError(
                f"Invalid dataset formatting in row {index + 1}. Ensure date, day, and time are correctly formatted."
            )

    return df

# Step 2: Validate individual entries
def validate_entry(entry):
    """
    Validate a single row of data for proper formatting of date, day, and time.
    Handles both string and Timestamp formats for the 'date' field.
    """
    try:
        # Validate date
        if pd.isna(entry['date']):
            print("Error: 'date' is empty.")
            return False
        if isinstance(entry['date'], pd.Timestamp):
            # Convert Timestamp to string for consistent validation
            date_str = entry['date'].strftime('%Y-%m-%d')
        else:
            date_str = entry['date']
        datetime.strptime(date_str, '%Y-%m-%d')  # Throws error if format is invalid

        # Validate day (must match a valid weekday)
        if pd.isna(entry['day']) or entry['day'] not in [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ]:
            print(f"Error: 'day' is invalid or empty. Found: {entry['day']}")
            return False

        # Validate time
        if pd.isna(entry['time']):
            print("Error: 'time' is empty.")
            return False
        datetime.strptime(entry['time'], '%H:%M')  # Throws error if format is invalid

        return True
    except Exception as e:
        print(f"Validation error: {e} for entry: {entry}")
        return False

# Step 3: Preprocess data
def preprocess_data(df):
    """
    Preprocess the dataset by creating new features.
    """
    # Convert 'date' to datetime
    df['date'] = pd.to_datetime(df['date'])

    # Create new features
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.day_name()
    df['hour'] = pd.to_datetime(df['time'], format='%H:%M').dt.hour
    df['minute'] = pd.to_datetime(df['time'], format='%H:%M').dt.minute
    df['half_hour'] = df['hour'] + (df['minute'] // 30) * 0.5
    df['is_weekend'] = df['weekday'].isin(['Saturday', 'Sunday']).astype(int)

    # Drop unused columns
    df = df.drop(columns=['date', 'time', 'minute'])
    # print(df)
    return df

# Step 4: Validate future_data
def validate_future_data(future_data):
    """
    Validate the structure and formatting of the future_data input.
    """
    required_keys = {'date', 'day', 'time', 'fromLocation', 'toLocation'}
    for index, entry in enumerate(future_data):
        # Check for required keys
        if not required_keys.issubset(entry.keys()):
            raise ValueError(
                f"Invalid future_data entry at index {index + 1}. Each entry must have keys: {required_keys}"
            )

        # Validate formatting and non-emptiness
        if not validate_entry(entry):
            raise ValueError(
                f"Invalid formatting in future_data at index {index + 1}. Ensure date, day, and time are correctly formatted."
            )

# Step 5: Split data into training and testing sets
def split_data(df):
    """
    Split the data into training and testing sets.
    """
    X = df[['day_of_month', 'weekday', 'half_hour', 'month', 'is_weekend', 'fromLocation']]
    X = pd.get_dummies(X, columns=['weekday', 'fromLocation'], drop_first=True)
    y = df['toLocation']

    return train_test_split(X, y, test_size=0.2, random_state=42)

# Step 6: Train the model
def train_model(X_train, y_train):
    """
    Train a Random Forest classifier.
    """
    model = RandomForestClassifier(random_state=42, n_estimators=100)
    model.fit(X_train, y_train)
    return model

# Step 7: Evaluate the model
def evaluate_model(model, X_test, y_test):
    """
    Evaluate the model's performance.
    """
    y_pred = model.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))

# Step 8: Prediction Function with Validation
predicted_locations = []  # Global array to store all predicted toLocations

def predict_and_store_toLocation(model, future_data, train_columns):
    """
    Predict the toLocation, store predictions in an array, and print them.
    """
    # Validate future_data
    validate_future_data(future_data)

    # Convert input data to DataFrame and preprocess
    future_df = pd.DataFrame(future_data)
    future_df = preprocess_data(future_df)  # Preprocess input data

    # Align columns with training data
    X_future = future_df[['day_of_month', 'weekday', 'half_hour', 'month', 'is_weekend', 'fromLocation']]
    X_future = pd.get_dummies(X_future, columns=['weekday', 'fromLocation'])

    # Reindex to align with training data columns
    X_future = X_future.reindex(columns=train_columns, fill_value=0)

    try:
        # Predict the toLocation
        predictions = model.predict(X_future)

        # Store predictions in the global array
        global predicted_locations
        predicted_locations.extend(predictions)

        # Return predictions and print the stored array
        print("Predicted toLocation:", predictions)
        print("All Predicted toLocations:", predicted_locations)
        return predictions
    except ValueError as e:
        print(f"Error in prediction: {e}")
        return None

# Main workflow
if __name__ == "__main__":
    try:
        # Load the dataset
        file_path = "http://localhost/place_guesser/data.csv"  # Replace with your file path (CSV or JSON)
        df = load_data(file_path)

        # Preprocess the data
        df = preprocess_data(df)
        print(df.columns)
        # Split into train and test sets
        X_train, X_test, y_train, y_test = split_data(df)
        train_columns = X_train.columns  # Save training columns for alignment

        # Train the model
        model = train_model(X_train, y_train)

        # Evaluate the model
        evaluate_model(model, X_test, y_test)

        # Predict for new data and store results
        future_data = [
            {
                'date': '2025-01-14',
                'day': 'Wednesday',
                'time': '18:45',
                'fromLocation': 'Island City Mall, Tagbilaran City',
                'toLocation': None  # To be predicted
            },
            {
                'date': '2025-01-15',
                'day': 'Thursday',
                'time': '18:45',
                'fromLocation': 'Island City Mall, Tagbilaran City',
                'toLocation': None  # To be predicted
            }
        ]
        predict_and_store_toLocation(model, future_data, train_columns)
    except ValueError as e:
        print(f"Error: {e}")
"""

correct url format: 

http://127.0.0.1:8000/predict/?file_url=http://localhost/place_guesser/data.json&future_data=[
    {
        "date": "2025-01-15",
        "day": "Thursday",
        "time": "18:45",
        "fromLocation": "Island City Mall, Tagbilaran City",
        "toLocation": ""   #Leave this one empty to be guessed
    },{ #Some more data here for multiple place guessing(optional)
        "date": "2025-01-15",
        "day": "Thursday",
        "time": "18:45",
        "fromLocation": "Island City Mall, Tagbilaran City",
        "toLocation": ""
    }
]

"""