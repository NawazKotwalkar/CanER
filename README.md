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

| Capability | Impact |
|---|---|
| **Wait time predictions** | Patients reach the ER with realistic expectations; hospitals prepare staffing |
| **Interactive hospital map** | Find the nearest ER with the shortest predicted wait time |
| **Hospital comparison** | Side-by-side metrics for up to 4 hospitals (wait time, triage distribution, peak hours) |
| **Trend analysis** | Identify hourly, daily, and seasonal patterns; understand peak-hour dynamics |
| **Peak hour detection** | Discover quietest and busiest times for any hospital |
| **Email reports** | Generate and schedule reports for personal tracking |
| **Accuracy dashboard** | Track prediction performance in production; monitor drift |
| **Bilingual interface** | English/French toggle with persistent user preference |

---

## Technical Implementation

### Model & Performance

- **Algorithm:** XGBoost (gradient boosting for tabular data)
- **Baseline:** Linear Regression (provided for comparison)
- **Training data:** 10,000 synthetic patient records based on CIHI NACRS structure
- **Features:** Province, hospital type, day of week, hour, season, triage level
- **Inference latency:** <50ms per prediction
- **Model artifact:** 8MB (serialized XGBoost + label encoders)

### Architecture

| Layer | Technology |
|---|---|
| **Backend** | FastAPI (Python 3.12) |
| **ML framework** | XGBoost + Scikit-learn |
| **Frontend** | HTML5, CSS3, vanilla JavaScript |
| **Visualization** | Chart.js (line/bar), Leaflet.js (maps) |
| **Deployment** | Render.com (Docker container) |
| **CI/CD** | GitHub Actions |

### Dataset

- **10,000 records** covering 50+ Canadian hospitals
- **Synthetic data** modeled on CIHI National Ambulatory Care Reporting System (NACRS) structure
- Distributions match real ER patterns; feature engineering driven by domain research
- **Data files:** `canadian_waittimes.csv` (synthetic), `hospitals.csv` (reference), `sample_data.csv` (quick-start subset)

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

# Train the model (optional; pre-trained models included)
python model/train_xgboost.py

# Start the server
python app.py
```

Visit `http://localhost:8000` in your browser.

---

## Live Demo

**[https://caner.onrender.com](https://caner.onrender.com)**

---

## Project Structure

```
CanER/
├── app.py                           # FastAPI application entry point
├── model/
│   ├── train_xgboost.py            # XGBoost model training pipeline
│   ├── train.py                    # Linear Regression baseline
│   ├── er_model_xgb.pkl            # Trained XGBoost model
│   ├── le_*.pkl                    # Label encoders (province, hospital, etc.)
├── data/
│   ├── canadian_waittimes.csv      # 10,000 synthetic ER records
│   ├── hospitals.csv               # Hospital metadata (location, type)
│   ├── sample_data.csv             # Quick-start subset
│   └── data_loader.py              # Data ingestion utilities
├── templates/                       # HTML pages
│   ├── index.html                  # Homepage
│   ├── map.html                    # Interactive hospital map
│   ├── compare.html                # 4-hospital comparison view
│   ├── trends.html                 # Trend analysis dashboard
│   ├── peak-hours.html             # Peak hour detection
│   ├── reports.html                # Email report generator
│   ├── feedback.html               # Accuracy/feedback dashboard
│   └── kpi-builder.html            # [Upcoming] Custom KPI builder
├── static/                          # JavaScript & CSS
│   ├── style.css                   # Canadian-theme stylesheet
│   ├── script.js                   # Core functionality
│   ├── map.js                      # Leaflet integration
│   ├── compare.js                  # Comparison logic
│   ├── trends.js                   # Chart rendering
│   ├── peak-hours.js               # Peak detection
│   ├── reports.js                  # Report generation
│   ├── feedback.js                 # Accuracy monitoring
│   └── kpi-builder.js              # [Upcoming] Custom metrics
├── .github/workflows/
│   └── docker-build.yml            # GitHub Actions CI/CD
├── Dockerfile
├── requirements.txt
├── netlify.toml                    # (Legacy; now on Render)
├── netlify-build.sh
├── LICENSE
└── README.md
```

---

## Features in Detail

### 1. Wait Time Prediction
Submit hospital, time of day, and triage level; receive predicted wait time in minutes with confidence indicators.

### 2. Interactive Map
- Real-time color-coded hospital locations (red = long waits, green = short waits)
- Click any hospital for full details and trend view
- Search by province or postal code
- Leaflet-based mapping with OpenStreetMap

### 3. Hospital Comparison
Compare up to 4 hospitals simultaneously:
- Predicted wait times by hour
- Triage level distribution
- Peak hours and quietest times
- Hospital metadata (address, type, capacity)

### 4. Trend Analysis
- **Hourly patterns:** Which hours have longest waits?
- **Weekly patterns:** Day-of-week effects
- **Seasonal patterns:** Summer vs. winter differences
- **Predictive trends:** Historical accuracy (predicted vs. actual wait times)

### 5. Peak Hour Detection
Automated analysis identifying:
- Busiest hour of the day (and why—triage distribution)
- Quietest hour for non-urgent cases
- Day-of-week effects (e.g., Monday surge, weekend lull)
- Seasonal outliers

### 6. Email Reports
- Generate on-demand PDF reports
- Schedule recurring reports (daily, weekly, monthly)
- Filtered by hospital, time range, or triage level
- Email delivery (requires SMTP configuration)

### 7. Accuracy Dashboard
Monitor model performance in production:
- Mean Absolute Error (MAE) by hospital
- Prediction confidence intervals
- Drift detection (when predictions diverge from actual waits)
- Per-hospital performance heatmap

### 8. Bilingual Support (Live)
- English/French toggle
- User preference persisted in browser localStorage
- All UI text, labels, and charts bilingual

---

## Canadian Theming

- **Color palette:** Canadian red (#C8102E) + white + steel blue accents
- **Typography:** Typographic hierarchy with sans-serif body (accessibility-first)
- **Visuals:** Animated maple leaf motif; flag-inspired layout
- **Dark/Light mode:** User preference persisted
- **Accessibility:** WCAG 2.1 AA compliance target

---

## Deployment

### Production (Render.com)

Deployed with:
- Docker containerization
- Environment-based configuration (Python 3.12, FastAPI)
- Automatic redeploys on GitHub push
- Live at: **[https://caner.onrender.com](https://caner.onrender.com)**

### CI/CD (GitHub Actions)

- Automatic Docker build and push on every commit to `main`
- Render detects new image and redeploys
- Build time: ~2 minutes

---

## Performance Benchmarks

- **Model training:** ~2 seconds (3,000 XGBoost trees, CPU)
- **Inference:** <50ms per prediction (batch predictions faster)
- **Model size:** 8MB serialized
- **Browser compatibility:** Chrome, Firefox, Safari, Edge (ES6+)
- **Mobile:** Responsive design; tested on iOS Safari, Android Chrome

---

## Data & Limitations

### Data Source
- **Type:** Synthetic (not real patient data)
- **Records:** 10,000 observations
- **Rationale:** Real CIHI NACRS data requires provincial health ministry access; synthetic data allows proof-of-concept
- **Modeling:** Distributions validated against published Canadian ER statistics

### Known Limitations

- **Synthetic data:** Real-world deployment requires access to provincial/hospital ER data (CIHI NACRS, provincial health ministries)
- **Scope:** Predictions assume normal operations; does not account for major incidents, disasters, policy changes, or emergency declarations
- **Granularity:** Predictions at hospital level; no unit-specific (e.g., trauma bay, pediatric ER) breakdowns
- **Temporal scope:** Model trained on static dataset; periodic retraining needed for production drift (recommend weekly)
- **External factors:** Does not account for staffing changes, bed closures, or policy shifts mid-production

---

## Roadmap

### Current (Shipped)
- [x] XGBoost + Linear Regression models
- [x] Interactive map view
- [x] 4-hospital comparison
- [x] Trend analysis (hourly, daily, seasonal)
- [x] Peak hour detection
- [x] Email reports
- [x] Accuracy dashboard
- [x] Bilingual support (English/French)
- [x] Docker deployment

### Upcoming

- [ ] **KPI Builder:** Custom metric creation (users define their own KPIs; e.g., "% waits < 60 min")
- [ ] Real CIHI NACRS data integration (with provincial partnerships)
- [ ] Real-time bed occupancy feed from hospital systems
- [ ] Mobile app (React Native)
- [ ] SMS alerts ("Wait time at [Hospital] now 120 min")
- [ ] Multimodel ensemble (XGBoost + LSTM for temporal patterns)
- [ ] Causal analysis: which staffing policies reduce waits most?
- [ ] API endpoint for third-party integrations (hospital apps, Google Maps)

---

## Glossary: Healthcare Terms Explained

**CanER uses healthcare terminology.** Here's what it means in plain English:

### Triage
**Triage** = sorting patients by medical urgency when they arrive at the ER.

Think of it like this: 100 people show up at the ER. A nurse looks at each person and asks, "How urgent is this?" The triage nurse assigns a level (1–5) that determines the order patients are seen.

- **Level 1 (Resuscitation)** = Life-threatening right now (cardiac arrest, severe trauma). Seen immediately.
- **Level 2 (Emergent)** = Serious but not immediately life-threatening (chest pain, severe bleeding). Seen within 10–30 minutes.
- **Level 3 (Urgent)** = Needs care soon but not immediately (broken arm, high fever). Seen within 30–60 minutes.
- **Level 4 (Semi-urgent)** = Can wait a few hours (mild infection, minor injury). Seen within 1–3 hours.
- **Level 5 (Non-urgent)** = Could be treated in urgent care instead (cold, minor cut). Waits longest; sometimes sent home to urgent care.

**CanER's prediction includes triage level** because a Level 1 patient is seen instantly (wait = 0), while a Level 5 might wait 2 hours. So when you enter a triage level, CanER knows how urgent your case is and predicts accordingly.

---

### CIHI & NACRS

**CIHI** = Canadian Institute for Health Information (government agency that collects healthcare data).

**NACRS** = National Ambulatory Care Reporting System (CIHI's database of all ER visits across Canada).

Think of NACRS like a national ER ledger: every time someone visits an ER in Canada, the hospital reports key data to CIHI:
- What time they arrived
- What province they're from
- Triage level
- How long they waited
- What they were treated for

CanER's synthetic data is **modeled on the structure of NACRS records**—meaning our fake data looks like real NACRS data, but the values are made up. This lets us prove the concept works before accessing real government data.

---

### Bed Occupancy / Bed Bloat

**Bed occupancy** = % of hospital beds currently filled.

**"30% of hospital beds occupied by patients who no longer need acute care"** means: 30% of people in hospital beds are discharged from ER care (e.g., recovering from surgery or observation) but haven't left the hospital yet because:
- They have nowhere to go (no home care available)
- They're waiting for a bed in a long-term care facility
- They're waiting for outpatient services

This is called **bed bloat**—beds are full, but not because of new ER patients. Result: ER patients wait longer because there's no bed to admit them to.

CanER doesn't directly solve bed bloat, but **predicting ER wait times** helps hospitals:
- Discharge patients faster (knowing more are coming)
- Redirect non-urgent cases to urgent care (frees beds for Level 2–3 patients)

---

### Staffing & Resource Allocation

**Resource allocation** = deciding how many doctors, nurses, and beds you need at any given time.

Right now, hospitals staff based on:
- Historical patterns (we're always busy on Monday nights)
- Gut feeling (we know summer is slow)
- Reactive crisis mode (ER is packed; call in extra staff now)

**CanER helps staff proactively:** If CanER predicts 150 Level 2–3 patients at 6 PM, the hospital calls in an extra doctor at 5 PM instead of waiting until the ER is overrun.

---

### Wait Time vs. Length of Stay

**Wait time** = time from arrival to being seen by a doctor (what CanER predicts).

**Length of stay** = time from arrival to discharge (includes diagnosis, treatment, observation). Can be hours or days.

CanER only predicts wait time—the first 30 minutes to 2 hours. What happens *after* you're seen is different.

---

### Seasonal / Hourly / Weekly Patterns

**Seasonal** = changes by season (summer ER is quieter; winter flu season is packed).

**Hourly** = changes by time of day (6 AM is quiet; 6 PM is busy—people are off work).

**Weekly** = changes by day of week (Monday ER is packed; Sunday is quieter).

CanER learns all three from historical data, so it can predict:
- "Tuesday at 7 PM = busiest hour of the week"
- "July = slowest month"
- "Level 3 patients wait 40 min on average; Level 5 wait 90 min"

---

### Drift (Model Drift)

**Model drift** = when your predictions stop matching reality.

Example: Your model was trained on 2023 data and predicts "10 PM ER wait = 60 min." But in 2024, a new hospital opens 5 km away and steals half your patients. Now 10 PM wait = 30 min. Your model is *drifting*—it's wrong.

**Why it matters:** A model that's drifted is useless or dangerous. Hospitals need to know when to retrain.

CanER's accuracy dashboard detects drift by comparing predicted wait times vs. actual wait times over time. If the gap widens, it's time to retrain.

---

### Inference Latency

**Latency** = time it takes to get an answer.

When you submit "Hospital X, Tuesday 3 PM, Level 3 triage" to CanER, your computer sends that to the server, the server runs the XGBoost model, and sends back "Predicted wait: 52 minutes."

**Inference latency** = how fast that happens. <50ms = super fast (you don't notice). 5 seconds = you might notice the app is slow.

CanER's <50ms latency means: type in a hospital, get a prediction instantly. No annoying loading spinner.

---

### Synthetic vs. Real Data

**Synthetic data** = made-up data that follows realistic patterns (but isn't from real people).

**Real data** = actual patient records from hospitals.

CanER currently uses synthetic data because:
- Real ER data is private (HIPAA/PIPEDA protected)
- Accessing real NACRS data requires partnerships with provincial health ministries
- Synthetic data lets us prove the concept works

**Tradeoff:** Synthetic data is good for proof-of-concept, bad for production. A hospital wouldn't trust predictions from made-up data. Real deployment requires real data.

---

### Label Encoding

**Label encoding** = converting text into numbers so a machine learning model can understand it.

Example: XGBoost doesn't understand "Ontario" or "Alberta"—it only understands numbers. So:
- Ontario = 0
- Alberta = 1
- British Columbia = 2
- etc.

CanER has 6 label encoders (le_province.pkl, le_hospital.pkl, etc.) that convert text labels (province names, hospital names) into numbers. When you pick a hospital from the dropdown, the app uses the encoder to convert it to a number, feeds it to XGBoost, and XGBoost spits out a wait time prediction.

---

### Confidence Intervals

**Confidence interval** = a range of plausible answers, not a single guess.

Instead of saying "Wait time = 52 minutes," a good model says:

**"Wait time = 52 minutes, give or take 15 minutes (so 37–67 minute range, 95% confidence)"**

This tells you:
- Our best guess is 52 minutes
- But 95% of the time, the true wait is somewhere between 37–67 minutes
- If we said 52 ± 2, we'd be overconfident (usually wrong)

CanER's accuracy dashboard should show confidence intervals—tells hospitals how much to trust each prediction.

---

## Development

### Local Testing

```bash
# Run tests (when available)
pytest tests/

# Format code
black .

# Lint
flake8 .
```

### Code Standards
- Black (code formatting)
- Flake8 (linting)
- Type hints encouraged throughout

### Contributing
Pull requests welcome. Please open an issue first to discuss major changes.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## About

**Nawaz**  
B.Sc. Data Science, University of Mumbai  
Based in Mumbai, India • Open to remote roles

[GitHub](https://github.com/NawazKotwalkar) — [LinkedIn](https://linkedin.com/in/nawazkotwalkar)

---

## Why This Matters

Canada's healthcare system is under stress. Better information flow between patients and hospitals can:

- **Reduce unnecessary ER visits** by directing non-urgent cases to alternatives (urgent care, walk-in clinics)
- **Improve patient outcomes** by reducing time-to-treatment for true emergencies
- **Inform policy** with data on which interventions (staffing, bed expansion, incentive structures) actually move the needle
- **Enable operational efficiency** through predictive staffing and resource allocation

CanER is a proof of concept for data-driven healthcare management in Canada. The synthetic-data proof of concept demonstrates the feasibility; real provincial data would enable production deployment.

---

Made with ❤️ for Canada 🍁