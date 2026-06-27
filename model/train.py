import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load data
df = pd.read_csv('data/sample_data.csv')

# Encode categorical variables
le_province = LabelEncoder()
le_hospital = LabelEncoder()
le_day = LabelEncoder()
le_season = LabelEncoder()
le_triage = LabelEncoder()

df['province_encoded'] = le_province.fit_transform(df['province'])
df['hospital_encoded'] = le_hospital.fit_transform(df['hospital_type'])
df['day_encoded'] = le_day.fit_transform(df['day_of_week'])
df['season_encoded'] = le_season.fit_transform(df['season'])
df['triage_encoded'] = le_triage.fit_transform(df['triage_level'])

# Features and target
X = df[['province_encoded', 'hospital_encoded', 'day_encoded', 
        'hour', 'season_encoded', 'triage_encoded']]
y = df['wait_time_minutes']

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model and encoders
os.makedirs('model', exist_ok=True)
joblib.dump(model, 'model/er_model.pkl')
joblib.dump(le_province, 'model/le_province.pkl')
joblib.dump(le_hospital, 'model/le_hospital.pkl')
joblib.dump(le_day, 'model/le_day.pkl')
joblib.dump(le_season, 'model/le_season.pkl')
joblib.dump(le_triage, 'model/le_triage.pkl')

print("✅ Model trained and saved!")
print(f"📈 R² Score: {model.score(X, y):.3f}")