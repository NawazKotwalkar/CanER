# CanER
## Canadian Emergency Room Wait Time Predictor

**Know before you go.** CanER predicts emergency room wait times across Canada, helping patients make informed decisions and hospitals optimize resource allocation.

---

## The Problem

- **72% increase** in Canadian ER wait times since 2020
- Over **30% of hospital beds** occupied by patients who no longer need acute care
- **60% of Canadians** open to private healthcare options due to wait times

Canada's emergency departments face compounding capacity pressure. Patients have limited information when deciding where to seek care. Hospitals lack a shared view of demand patterns.

CanER closes this gap with machine learning.

---

## What CanER Does

| Capability | Business Impact |
|---|---|
| **Wait time predictions** | Patients reach the ER with realistic expectations; hospitals prepare staffing |
| **Interactive hospital map** | Find the nearest ER with the shortest predicted wait time |
| **Hospital comparison** | Side-by-side metrics for up to 4 hospitals (wait time, triage distribution, peak hours) |
| **Trend analysis** | Identify hourly, daily, and seasonal patterns; understand peak-hour dynamics |
| **Bilingual interface** | English/French toggle with persistent user preference |
| **Accuracy dashboard** | Track prediction performance in production; flag drift |

---

## Technical Implementation

### Model & Performance

- **Algorithm:** XGBoost (gradient boosting for tabular data)
- **Training data:** 10,000 synthetic patient records based on CIHI NACRS structure
- **Features:** Province, hospital type, day of week, hour, season, triage level
- **Baseline:** Linear Regression (provided for comparison)

### Architecture

| Layer | Technology |
|---|---|
| **Backend** | FastAPI (Python 3.12) |
| **ML framework** | XGBoost + Scikit-learn |
| **Frontend** | HTML5, CSS3, vanilla JavaScript |
| **Visualization** | Chart.js (line/bar), Leaflet.js (maps) |
| **Deployment** | Render.com (Docker container) |

### Dataset

- **10,000 records** covering 50+ Canadian hospitals
- Features modeled on CIHI National Ambulatory Care Reporting System (NACRS)
- Synthetic but structurally realistic (distributions match real ER patterns)

---

## Getting Started

### Prerequisites
- Python 3.12+
- pip

### Install & Run Locally

```bash
# Clone repository
git clone https://github.com/NawazKotwalkar/CanER.git
cd CanER

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python model/train_xgboost.py

# Start the server
python app.py
```

Visit `http://localhost:8000` in your browser.

---

## Project Structure

```
CanER/
├── app.py                    # FastAPI application entry point
├── model/
│   ├── train_xgboost.py     # XGBoost model training pipeline
│   └── train.py             # Linear Regression baseline
├── data/
│   └── sample_data.csv      # 10,000 training records
├── templates/               # HTML pages
│   ├── index.html
│   ├── map.html
│   ├── compare.html
│   ├── trends.html
│   ├── peak_hours.html
│   ├── reports.html
│   └── feedback.html
├── static/
│   ├── style.css            # Canadian-theme stylesheet
│   ├── script.js
│   ├── map.js
│   ├── trends.js
│   ├── compare.js
│   ├── peak_hours.js
│   ├── reports.js
│   └── feedback.js
├── requirements.txt
├── Dockerfile
├── LICENSE
└── README.md
```

---

## Key Features

### 1. Wait Time Prediction
Submit hospital, time of day, and triage level; receive predicted wait time in minutes.

### 2. Interactive Map
- Real-time color-coded hospital locations (red = long waits, green = short waits)
- Click any hospital for full details and trend view
- Search by province or postal code

### 3. Hospital Comparison
Compare up to 4 hospitals simultaneously:
- Predicted wait times by hour
- Triage level distribution
- Peak hours and quietest times

### 4. Trend Analysis
- **Hourly patterns:** Which hours have longest waits?
- **Weekly patterns:** Day-of-week effects
- **Seasonal patterns:** Summer vs. winter differences
- **Historical accuracy:** Predicted vs. actual wait times

### 5. Bilingual Support
- English/French toggle
- User preference saved in browser localStorage
- All UI text, labels, and charts bilingual

### 6. Accuracy Dashboard
Monitor model performance:
- Mean Absolute Error (MAE) by hospital
- Prediction confidence intervals
- Drift detection (when predictions diverge from actual)

---

## Canadian Theming

- **Color palette:** Canadian red (#C8102E) + white + steel blue accents
- **Typography:** Typographic hierarchy with sans-serif body (accessibility-first)
- **Visuals:** Animated maple leaf motif; flag-inspired layout
- **Dark/Light mode:** User preference persisted

---

## Deployment

Deployed on **Render.com** with:
- Docker containerization
- Environment-based configuration
- Automatic redeploys on GitHub push

**Live at:** [https://caner.onrender.com](https://caner.onrender.com)

---

## Performance Notes

- **Training time:** ~2 seconds on CPU (3,000 trees)
- **Inference time:** <50ms per prediction
- **Model size:** ~8MB (compressed XGBoost artifact)
- **Browser compatibility:** Chrome, Firefox, Safari, Edge (ES6+)

---

## Known Limitations

- **Synthetic data:** Real-world model would require access to provincial/hospital ER data (CIHI NACRS)
- **Scope:** Predictions assume normal operations; does not account for major incidents, disasters, or policy changes
- **Granularity:** Predictions at hospital level; no unit-specific (e.g., trauma bay) breakdowns
- **Updates:** Model trained on static dataset; periodic retraining needed for production drift

---

## Future Roadmap

- [ ] Integration with real CIHI NACRS data (provincial health ministries)
- [ ] Real-time bed occupancy feed from hospital systems
- [ ] Mobile app (React Native)
- [ ] SMS alerts ("Wait time at [Hospital] now 120 min")
- [ ] Multimodel ensemble (XGBoost + LSTM for temporal patterns)
- [ ] Causal analysis: which staffing policies reduce waits most?

---

## Development

### Running Tests
```bash
pytest tests/
```

### Code Standards
- Black (code formatting)
- Flake8 (linting)
- Type hints throughout

### Contributing
Pull requests welcome. Please open an issue first to discuss major changes.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## About

**Nawaz**  
B.Sc. Data Science, University of Mumbai  
Toronto-based • Open to remote roles

[GitHub](https://github.com/NawazKotwalkar) — [LinkedIn](https://linkedin.com/in/nawazkotwalkar)

---

## Why This Matters

Canada's healthcare system is under stress. Better information flow between patients and hospitals can:
- **Reduce unnecessary ER visits** by directing non-urgent cases to alternatives (urgent care, walk-in clinics)
- **Improve patient outcomes** by reducing time-to-treatment for true emergencies
- **Inform policy** with data on which interventions (staffing, bed expansion, incentive structures) actually move the needle

CanER is a proof of concept for data-driven healthcare management in Canada.

---

Made with ❤️ for Canada 🍁