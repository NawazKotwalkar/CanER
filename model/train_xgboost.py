import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
import xgboost as xgb
import joblib
import os
import sys

# Add parent directory to import data_loader
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data.data_loader import load_cihi_data

print("=" * 50)
print("🏥 CanER - XGBoost Model Training")
print("=" * 50)

# Load data
print("\n📂 Loading data...")
df = load_cihi_data()
print(f"✅ Loaded {len(df)} records")

# Encode categorical variables (LabelEncoder for XGBoost)
print("\n🔄 Encoding categorical variables...")
le_province = LabelEncoder()
le_hospital = LabelEncoder()
le_day = LabelEncoder()
le_season = LabelEncoder()
le_triage = LabelEncoder()

# Lines 32-36 in train_xgboost.py
df['province_encoded'] = le_province.fit_transform(df['province'])  # type: ignore
df['hospital_encoded'] = le_hospital.fit_transform(df['hospital_type'])  # type: ignore
df['day_encoded'] = le_day.fit_transform(df['day_of_week'])  # type: ignore
df['season_encoded'] = le_season.fit_transform(df['season'])  # type: ignore
df['triage_encoded'] = le_triage.fit_transform(df['triage_level'].astype(str))  # type: ignore

# Features and target
features = ['province_encoded', 'hospital_encoded', 'day_encoded', 
            'hour', 'season_encoded', 'triage_encoded']
X = df[features]
y = df['wait_time_minutes']

print(f"📊 Features: {len(features)} columns")
print(f"🎯 Target: wait_time_minutes")

# Split data
print("\n📊 Splitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
print("\n🧠 Training XGBoost model...")
model = xgb.XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    enable_categorical=False,  # We use LabelEncoder, not categorical
    verbosity=0
)

model.fit(X_train, y_train)

# Evaluate
print("\n📊 Evaluating model...")
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"\n📈 Model Performance (XGBoost):")
print(f"   • Mean Absolute Error: {mae:.2f} minutes")
print(f"   • R² Score: {r2:.3f}")

# Feature importance
print("\n📊 Feature Importance:")
importance = model.feature_importances_
for feature, imp in zip(features, importance):
    print(f"   • {feature}: {imp:.4f}")

# Save model and encoders
print("\n💾 Saving model and encoders...")
os.makedirs('model', exist_ok=True)
joblib.dump(model, 'model/er_model_xgb.pkl')
joblib.dump(le_province, 'model/le_province.pkl')
joblib.dump(le_hospital, 'model/le_hospital.pkl')
joblib.dump(le_day, 'model/le_day.pkl')
joblib.dump(le_season, 'model/le_season.pkl')
joblib.dump(le_triage, 'model/le_triage.pkl')

print("\n✅ XGBoost model and encoders saved successfully!")
print("=" * 50)