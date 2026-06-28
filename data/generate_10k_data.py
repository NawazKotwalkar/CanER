import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_10k_records(n_records=10000, seed=42):
    """Generate 10,000 realistic Canadian ER wait time records"""
    
    np.random.seed(seed)
    random.seed(seed)
    
    # ---------- Hospitals with real locations ----------
    hospitals = [
        {"name": "Toronto General", "city": "Toronto", "province": "ON", "type": "Urban"},
        {"name": "St. Michael's Hospital", "city": "Toronto", "province": "ON", "type": "Urban"},
        {"name": "Sunnybrook Health Sciences", "city": "Toronto", "province": "ON", "type": "Urban"},
        {"name": "North York General", "city": "Toronto", "province": "ON", "type": "Urban"},
        {"name": "Scarborough General", "city": "Toronto", "province": "ON", "type": "Urban"},
        {"name": "Vancouver General", "city": "Vancouver", "province": "BC", "type": "Urban"},
        {"name": "St. Paul's Hospital", "city": "Vancouver", "province": "BC", "type": "Urban"},
        {"name": "Royal Columbian Hospital", "city": "New Westminster", "province": "BC", "type": "Urban"},
        {"name": "Montreal General", "city": "Montreal", "province": "QC", "type": "Urban"},
        {"name": "Jewish General Hospital", "city": "Montreal", "province": "QC", "type": "Urban"},
        {"name": "Quebec City CHU", "city": "Quebec City", "province": "QC", "type": "Urban"},
        {"name": "Calgary Foothills", "city": "Calgary", "province": "AB", "type": "Urban"},
        {"name": "Edmonton Royal Alex", "city": "Edmonton", "province": "AB", "type": "Urban"},
        {"name": "South Calgary Health", "city": "Calgary", "province": "AB", "type": "Urban"},
        {"name": "Ottawa General", "city": "Ottawa", "province": "ON", "type": "Urban"},
        {"name": "Hamilton General", "city": "Hamilton", "province": "ON", "type": "Urban"},
        {"name": "London Health Sciences", "city": "London", "province": "ON", "type": "Urban"},
        {"name": "Winnipeg Health", "city": "Winnipeg", "province": "MB", "type": "Urban"},
        {"name": "Halifax Infirmary", "city": "Halifax", "province": "NS", "type": "Urban"},
        {"name": "Saskatoon Royal", "city": "Saskatoon", "province": "SK", "type": "Urban"},
        {"name": "Kelowna General", "city": "Kelowna", "province": "BC", "type": "Urban"},
        {"name": "Moncton Hospital", "city": "Moncton", "province": "NB", "type": "Urban"},
        {"name": "St. John's Health", "city": "St. John's", "province": "NL", "type": "Urban"},
        {"name": "Victoria General", "city": "Victoria", "province": "BC", "type": "Urban"},
        {"name": "Regina General", "city": "Regina", "province": "SK", "type": "Urban"},
        {"name": "Rural Hospital - Timmins", "city": "Timmins", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Kenora", "city": "Kenora", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Prince George", "city": "Prince George", "province": "BC", "type": "Rural"},
        {"name": "Rural Hospital - Red Deer", "city": "Red Deer", "province": "AB", "type": "Rural"},
        {"name": "Rural Hospital - Moose Jaw", "city": "Moose Jaw", "province": "SK", "type": "Rural"},
        {"name": "Rural Hospital - Brandon", "city": "Brandon", "province": "MB", "type": "Rural"},
        {"name": "Rural Hospital - Truro", "city": "Truro", "province": "NS", "type": "Rural"},
        {"name": "Rural Hospital - Corner Brook", "city": "Corner Brook", "province": "NL", "type": "Rural"},
        {"name": "Rural Hospital - Bathurst", "city": "Bathurst", "province": "NB", "type": "Rural"},
        {"name": "Rural Hospital - Sault Ste. Marie", "city": "Sault Ste. Marie", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Thunder Bay", "city": "Thunder Bay", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Sudbury", "city": "Sudbury", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Peterborough", "city": "Peterborough", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Brantford", "city": "Brantford", "province": "ON", "type": "Rural"},
        {"name": "Rural Hospital - Guelph", "city": "Guelph", "province": "ON", "type": "Rural"},
    ]
    
    # Province base wait times
    province_base = {
        'ON': 48, 'BC': 42, 'QC': 52, 'AB': 45, 'MB': 50,
        'NS': 47, 'SK': 51, 'NB': 48, 'NL': 53, 'PE': 44
    }
    
    # Season factors (month -> multiplier)
    season_factors = {
        1: 1.25, 2: 1.30, 3: 1.15,   # Winter (Jan-Mar)
        4: 0.90, 5: 0.85, 6: 0.90,   # Spring (Apr-Jun)
        7: 0.90, 8: 0.95, 9: 1.05,   # Summer (Jul-Sep)
        10: 1.10, 11: 1.20, 12: 1.30  # Fall (Oct-Dec)
    }
    
    # Hour factors (time of day)
    hour_factors = {
        0: 0.50, 1: 0.40, 2: 0.35, 3: 0.35, 4: 0.40, 5: 0.50,
        6: 0.65, 7: 0.80, 8: 1.00, 9: 1.20, 10: 1.25, 11: 1.20,
        12: 1.15, 13: 1.20, 14: 1.30, 15: 1.35, 16: 1.40, 17: 1.50,
        18: 1.45, 19: 1.35, 20: 1.20, 21: 1.00, 22: 0.80, 23: 0.60
    }
    
    # Triage level distribution (1=Critical, 5=Minor)
    triage_probs = [0.05, 0.15, 0.35, 0.30, 0.15]  # 1-5 probabilities
    
    # Day of week busy factors
    day_factors = {
        'Monday': 1.15, 'Tuesday': 1.00, 'Wednesday': 0.95,
        'Thursday': 1.00, 'Friday': 1.10, 'Saturday': 1.05,
        'Sunday': 1.00
    }
    
    records = []
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2025, 12, 31)
    date_range = (end_date - start_date).days
    
    for _ in range(n_records):
        # 1. Pick hospital
        h = random.choice(hospitals)
        hospital_name = h['name']
        province = h['province']
        hospital_type = h['type']
        
        # 2. Pick random date
        random_days = random.randint(0, date_range)
        date = start_date + timedelta(days=random_days)
        month = date.month
        hour = random.randint(0, 23)
        day_of_week = date.strftime('%A')
        
        # 3. Get season from month
        if month in [12, 1, 2]:
            season = 'Winter'
        elif month in [3, 4, 5]:
            season = 'Spring'
        elif month in [6, 7, 8]:
            season = 'Summer'
        else:
            season = 'Fall'
        
        # 4. Calculate wait time
        base_wait = province_base.get(province, 48)
        season_factor = season_factors[month]
        hour_factor = hour_factors[hour]
        day_factor = day_factors[day_of_week]
        
        # Rural hospitals tend to have slightly shorter waits (less crowded)
        rural_adjustment = 0.85 if hospital_type == 'Rural' else 1.0
        
        # Random noise
        noise = np.random.normal(0, 12)
        
        # Calculate wait time
        wait_time = base_wait * season_factor * hour_factor * day_factor * rural_adjustment + noise
        wait_time = max(5, int(round(wait_time)))
        
        # 5. Triage level (random, but higher triage = shorter wait in real life)
        triage_level = np.random.choice([1, 2, 3, 4, 5], p=triage_probs)
        # Critical patients (1) get seen faster
        if triage_level <= 2:
            wait_time = int(wait_time * 0.7)
        elif triage_level >= 4:
            wait_time = int(wait_time * 1.3)
        wait_time = max(5, wait_time)
        
        records.append({
            'province': province,
            'hospital_type': hospital_type,
            'day_of_week': day_of_week,
            'hour': hour,
            'season': season,
            'triage_level': triage_level,
            'wait_time_minutes': wait_time
        })
    
    return pd.DataFrame(records)

if __name__ == "__main__":
    print("🏥 Generating 10,000 synthetic Canadian ER records...")
    df = generate_10k_records(10000)
    
    # Save
    output_path = 'data/sample_data.csv'
    df.to_csv(output_path, index=False)
    
    print(f"✅ Generated {len(df)} records")
    print(f"📂 Saved to: {output_path}")
    print("\n📊 Data Summary:")
    print(f"   • Records: {len(df)}")
    print(f"   • Provinces: {df['province'].nunique()}")
    print(f"   • Avg Wait Time: {df['wait_time_minutes'].mean():.1f} min")
    print(f"   • Wait Time Range: {df['wait_time_minutes'].min()} - {df['wait_time_minutes'].max()} min")
    print("\n📊 Sample:")
    print(df.head(10))
    print("\n📊 Column types:")
    print(df.dtypes)