import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from datetime import datetime
import requests
import json


app = FastAPI()


class PredictionRequest(BaseModel):
    file_url: str
    future_data: str  

# Step 1: Load the dataset
def load_data(file_url):
    """
    Load the dataset from a CSV or JSON file.
    Throws an error for unsupported file formats or invalid dataset structure and formatting.
    """
    # Request data from URL
    try:
        if file_url.endswith('.csv'):
            df = pd.read_csv(file_url)
        elif file_url.endswith('.json'):
            df = pd.read_json(file_url)
        else:
            raise ValueError("Unsupported file format. Please provide a CSV or JSON file.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error loading file: {str(e)}")

    # Validate required columns
    required_columns = {'date', 'day', 'time', 'fromLocation', 'toLocation'}
    if not required_columns.issubset(df.columns):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid dataset. Missing required columns: {required_columns}"
        )

    # Validate formatting and non-emptiness
    for index, row in df.iterrows():
        if not validate_entry(row):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid formatting in row {index + 1}. Ensure date, day, and time are correctly formatted."
            )

    return df

# Step 2: Validate individual entries
def validate_entry(entry):
    try:
        # Validate date
        if pd.isna(entry['date']):
            return False
        if isinstance(entry['date'], pd.Timestamp):
            date_str = entry['date'].strftime('%Y-%m-%d')
        else:
            date_str = entry['date']
        datetime.strptime(date_str, '%Y-%m-%d')  # Throws error if format is invalid

        # Validate day
        if pd.isna(entry['day']) or entry['day'] not in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']:
            return False

        # Validate time
        if pd.isna(entry['time']):
            return False
        datetime.strptime(entry['time'], '%H:%M')  # Throws error if format is invalid

        return True
    except Exception:
        return False

# Step 3: Preprocess data
def preprocess_data(df):
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.day_name()
    df['hour'] = pd.to_datetime(df['time'], format='%H:%M').dt.hour
    df['minute'] = pd.to_datetime(df['time'], format='%H:%M').dt.minute
    df['half_hour'] = df['hour'] + (df['minute'] // 30) * 0.5
    df['is_weekend'] = df['weekday'].isin(['Saturday', 'Sunday']).astype(int)
    df = df.drop(columns=['date', 'time', 'minute'])
    return df

# Step 4: Split data
def split_data(df):
    X = df[['day_of_month', 'weekday', 'half_hour', 'month', 'is_weekend', 'fromLocation']]
    X = pd.get_dummies(X, columns=['weekday', 'fromLocation'], drop_first=True)
    y = df['toLocation']
    return train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Train the model
def train_model(X_train, y_train):
    model = RandomForestClassifier(random_state=42, n_estimators=100)
    model.fit(X_train, y_train)
    return model

# Step 6: Prediction for future data
def predict_and_store_toLocation(model, future_data, train_columns):
    future_df = pd.DataFrame(future_data)
    print(future_df)
    
    future_df = preprocess_data(future_df)
    print(future_df)
    X_future = future_df[['day_of_month', 'weekday', 'half_hour', 'month', 'is_weekend', 'fromLocation']]
    X_future = pd.get_dummies(X_future, columns=['weekday', 'fromLocation'])
    X_future = X_future.reindex(columns=train_columns, fill_value=0)
    
    predictions = model.predict(X_future)
    return predictions

# API endpoint to handle GET request for prediction
@app.get("/predict/")
async def predict(file_url: str, future_data: str):
    try:
        # Parse the 'future_data' JSON string into a list of dictionaries
        future_data = json.loads(future_data)

        # Load data from URL
        df = load_data(file_url)
        df = preprocess_data(df)

        # Split data for training
        X_train, X_test, y_train, y_test = split_data(df)
        model = train_model(X_train, y_train)
        # Evaluate the model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Predict for new data (future_data)
        train_columns = X_train.columns
        
        predictions = predict_and_store_toLocation(model, future_data, train_columns)

        # Return the predictions and accuracy
        return {
            "accuracy": f"{(accuracy)*100}%",
            "predictions": predictions.tolist()
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



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