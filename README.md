# 🏥 ER Wait Time Predictor

## 🇨🇦 Solving Canada's ER Crisis

Predicts ER wait times to help Canadians make informed decisions during a healthcare crisis.

## 📊 Real-World Impact

Canada's ER wait times have increased 72% since 2020. This tool helps:

- **Patients** decide which ER to visit
- **Hospitals** allocate staff efficiently
- **Government** identify problem areas

## 🧠 Technology

- **Model:** Linear Regression (simple, interpretable)
- **Backend:** FastAPI
- **Frontend:** Pure HTML/CSS/JS (no frameworks)
- **Data:** CIHI and provincial data sources

## 🚀 Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Train model
python model/train.py

# 3. Run app
python app.py