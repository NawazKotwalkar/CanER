import pandas as pd
import io
import os
import re
import numpy as np
from datetime import datetime

def load_cihi_data():
    """
    Load CIHI Emergency Department data
    Handles complex formatting
    """
    # Try multiple possible file paths
    possible_paths = [
        'data\\sample_data.csv'
    ]
    
    df = None
    
    for path in possible_paths:
        if not os.path.exists(path):
            continue
            
        print(f"📂 Trying to load: {path}")
        
        try:
            # Try different approaches based on file type
            if path.endswith('.csv'):
                df = load_cihi_csv(path)
            elif path.endswith('.xlsx'):
                df = load_cihi_excel(path)
            
            if df is not None and len(df) > 0:
                print(f"✅ Successfully loaded {len(df)} records from {path}")
                
                # Check if this is the custom data format (has 'Hospital' or 'Avg_Wait_Minutes')
                if 'Avg_Wait_Minutes' in df.columns or 'Hospital' in df.columns:
                    print("🔄 Transforming custom data format...")
                    df = transform_custom_data(df)
                else:
                    # Standardize column names
                    df = standardize_columns(df)
                
                break
                
        except Exception as e:
            print(f"⚠️ Error loading {path}: {e}")
            continue
    
    if df is None or len(df) == 0:
        print("⚠️ No valid data found. Using sample data...")
        df = create_sample_data()
    
    # Ensure required columns exist
    required = ['province', 'hospital_type', 'day_of_week', 'hour', 'season', 'triage_level', 'wait_time_minutes']
    missing = [col for col in required if col not in df.columns]
    if missing:
        print(f"⚠️ Missing columns: {missing}. Adding defaults...")
        for col in missing:
            if col == 'hour':
                df[col] = np.random.randint(0, 24, len(df))
            elif col == 'triage_level':
                df[col] = np.random.randint(1, 6, len(df))
            elif col == 'day_of_week':
                df[col] = 'Monday'  # Placeholder
            elif col == 'season':
                df[col] = 'Summer'
            elif col == 'hospital_type':
                df[col] = 'Urban'
    
    return df

def load_cihi_csv(path):
    """Load CIHI CSV with special handling"""
    
    # Try different approaches
    approaches = [
        # Approach 1: Try reading normally with UTF-8
        lambda: pd.read_csv(path, encoding='utf-8'),
        # Approach 2: Try with latin-1
        lambda: pd.read_csv(path, encoding='latin-1'),
        # Approach 3: Try skipping rows
        lambda: pd.read_csv(path, skiprows=range(0, 5), encoding='latin-1'),
        # Approach 4: Try different delimiter
        lambda: pd.read_csv(path, sep=';', encoding='latin-1'),
        # Approach 5: Try with auto-detection
        lambda: pd.read_csv(path, encoding='latin-1', on_bad_lines='skip'),
    ]
    
    for approach in approaches:
        try:
            df = approach()
            if df is not None and len(df) > 0:
                # If it has more than 2 columns, it's probably good
                if len(df.columns) >= 3:
                    return df
        except:
            continue
    
    return None

def load_cihi_excel(path):
    """Load CIHI Excel with special handling"""
    try:
        xl = pd.ExcelFile(path, engine='openpyxl')
        print("📋 Sheets found:", xl.sheet_names)
        
        # Try each sheet
        for sheet in xl.sheet_names:
            for skip in [0, 5, 10]:
                try:
                    df = pd.read_excel(path, sheet_name=sheet, skiprows=skip, engine='openpyxl')
                    if len(df.columns) > 3:
                        print(f"✅ Read sheet '{sheet}' with skiprows={skip}")
                        return df
                except:
                    continue
        return None
    except Exception as e:
        print(f"⚠️ Excel error: {e}")
        return None

def transform_custom_data(df):
    """
    Transform the user's custom data format to the required model format.
    Expects columns: Hospital, City, Province, Department, Date, Patients_Seen,
    Avg_Wait_Minutes, Target_Minutes, Met_Target
    Returns DataFrame with: province, hospital_type, day_of_week, hour, season, triage_level, wait_time_minutes
    """
    
    # Map province codes to full names
    province_map = {
        'ON': 'Ontario',
        'BC': 'BritishColumbia',
        'QC': 'Quebec',
        'AB': 'Alberta',
        'MB': 'Manitoba',
        'NS': 'Nova Scotia',
        'SK': 'Saskatchewan',
        'NB': 'New Brunswick',
        'NL': 'Newfoundland',
        'PE': 'Prince Edward Island'
    }
    
    # Map city to hospital type (Urban if major city, else Rural)
    urban_cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 
                    'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax', 'Victoria']
    
    # Convert date to datetime
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Extract day of week
    df['day_of_week'] = df['Date'].dt.day_name()
    
    # Extract season
    def get_season(month):
        if month in [12, 1, 2]:
            return 'Winter'
        elif month in [3, 4, 5]:
            return 'Spring'
        elif month in [6, 7, 8]:
            return 'Summer'
        else:
            return 'Fall'
    
    df['season'] = df['Date'].dt.month.apply(get_season)
    
    # Map province
    df['province'] = df['Province'].map(province_map)
    # If some provinces are already full names, keep them
    df['province'] = df['province'].fillna(df['Province'])
    
    # Map hospital type
    df['hospital_type'] = df['City'].apply(lambda x: 'Urban' if x in urban_cities else 'Rural')
    
    # Generate hour (random between 8 AM and 8 PM for realistic distribution)
    df['hour'] = np.random.randint(8, 20, len(df))
    
    # Generate triage level (based on department or random)
    # Emergency tends to have higher acuity, but we'll randomize
    df['triage_level'] = np.random.randint(1, 6, len(df))
    
    # Wait time minutes
    df['wait_time_minutes'] = df['Avg_Wait_Minutes']
    
    # Keep only required columns
    result = df[['province', 'hospital_type', 'day_of_week', 'hour', 'season', 'triage_level', 'wait_time_minutes']]
    
    print(f"✅ Transformed {len(result)} records to model format")
    return result

def standardize_columns(df):
    """Standardize column names to match our format"""
    
    # Clean column names
    df.columns = df.columns.str.strip().str.lower()
    
    # Mapping
    mapping = {
        'province': 'province',
        'province/territory': 'province',
        'hospital': 'hospital_type',
        'hospital type': 'hospital_type',
        'day': 'day_of_week',
        'day of week': 'day_of_week',
        'hour': 'hour',
        'season': 'season',
        'triage': 'triage_level',
        'triage level': 'triage_level',
        'wait time': 'wait_time_minutes',
        'wait time (min)': 'wait_time_minutes',
        'length of stay': 'wait_time_minutes'
    }
    
    # Rename
    for old, new in mapping.items():
        if old in df.columns:
            df = df.rename(columns={old: new})
    
    return df

def create_sample_data():
    """Create sample data if no file works"""
    import numpy as np
    
    provinces = ['Ontario', 'BritishColumbia', 'Quebec', 'Alberta', 'Manitoba']
    hospital_types = ['Urban', 'Rural']
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    seasons = ['Winter', 'Spring', 'Summer', 'Fall']
    
    data = []
    for _ in range(200):
        province = np.random.choice(provinces)
        base_wait = {
            'Ontario': 45,
            'BritishColumbia': 35,
            'Quebec': 42,
            'Alberta': 47,
            'Manitoba': 40
        }.get(province, 42)
        
        wait = base_wait + np.random.normal(0, 15)
        
        data.append({
            'province': province,
            'hospital_type': np.random.choice(hospital_types),
            'day_of_week': np.random.choice(days),
            'hour': np.random.randint(0, 24),
            'season': np.random.choice(seasons),
            'triage_level': np.random.randint(1, 6),
            'wait_time_minutes': max(5, int(wait))
        })
    
    df = pd.DataFrame(data)
    save_path = 'data/sample_data.csv'
    df.to_csv(save_path, index=False)
    print(f"✅ Created sample data with {len(df)} records")
    
    return df

if __name__ == "__main__":
    df = load_cihi_data()
    print(f"\n📊 Loaded {len(df)} records")
    print("\n📊 Sample:")
    print(df.head())
    print("\n📊 Columns:")
    print(df.columns.tolist())