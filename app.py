from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import joblib
import pandas as pd
import uuid
from datetime import datetime
import os

# ============ Initialize ============
app = FastAPI(title="ER Wait Time Predictor")

# ============ Mount Static Files ============
app.mount("/static", StaticFiles(directory="static"), name="static")

# ============ Load Model & Encoders ============
model = joblib.load('model/er_model_xgb.pkl')
le_province = joblib.load('model/le_province.pkl')
le_hospital = joblib.load('model/le_hospital.pkl')
le_day = joblib.load('model/le_day.pkl')
le_season = joblib.load('model/le_season.pkl')
le_triage = joblib.load('model/le_triage.pkl')

# ============ Request Schema ============
class ERRequest(BaseModel):
    province: str
    hospital_type: str
    day_of_week: str
    hour: int
    season: str
    triage_level: int

class ERResponse(BaseModel):
    id: str
    predicted_wait_minutes: int
    wait_time_category: str
    recommendation: str
    timestamp: str

# ============ Helper Function ============
def encode_value(encoder, value):
    try:
        return encoder.transform([value])[0]
    except:
        return 0

# ============ API Endpoints ============
@app.get("/", response_class=HTMLResponse)
async def home():
    with open('templates/index.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.post("/api/predict")
async def predict(request: ERRequest):
    try:
        input_data = pd.DataFrame([[
            encode_value(le_province, request.province),
            encode_value(le_hospital, request.hospital_type),
            encode_value(le_day, request.day_of_week),
            request.hour,
            encode_value(le_season, request.season),
            encode_value(le_triage, str(request.triage_level))
        ]], columns=['province_encoded', 'hospital_encoded', 'day_encoded',
                     'hour', 'season_encoded', 'triage_encoded'])
        
        wait_time = model.predict(input_data)[0]
        wait_time = max(5, int(wait_time))
        
        if wait_time <= 30:
            category = "Fast 🟢"
            recommendation = "Go to this ER now"
        elif wait_time <= 60:
            category = "Moderate 🟡"
            recommendation = "Consider this ER or check others"
        else:
            category = "Long 🔴"
            recommendation = "Try a different hospital if possible"
        
        return ERResponse(
            id=str(uuid.uuid4())[:8],
            predicted_wait_minutes=wait_time,
            wait_time_category=category,
            recommendation=recommendation,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M")
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/map", response_class=HTMLResponse)
async def map_view():
    with open('templates/map.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.get("/compare", response_class=HTMLResponse)
async def compare():
    with open('templates/compare.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.get("/trends", response_class=HTMLResponse)
async def trends():
    with open('templates/trends.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.get("/api/health")
async def health():
    return {"status": "healthy", "model": "XGBoost"}

@app.get("/reports", response_class=HTMLResponse)
async def reports():
    with open('templates/reports.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.get("/peak-hours", response_class=HTMLResponse)
async def peak_hours():
    with open('templates/peak-hours.html', 'r', encoding='utf-8') as f:
        return f.read()

@app.get("/feedback", response_class=HTMLResponse)
async def feedback_page():
    with open('templates/feedback.html', 'r', encoding='utf-8') as f:
        return f.read()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)