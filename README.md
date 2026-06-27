# CanER – Canadian ER Wait Time Predictor

**Know before you go • AI-powered healthcare intelligence for Canada**

[![Python](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/) [![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-orange)](https://scikit-learn.org/) [![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

🇨🇦 **Proudly Canadian** | 🇫🇷 [**Lire en français**](#-canering-time-de-attente-aux-urgences-canadiennes)

---

## About CanER

CanER is a machine learning system that predicts emergency room wait times across Canadian hospitals. It enables patients to make informed decisions about hospital visits while helping healthcare administrators optimize resource allocation.

### The Problem

- Canadian ER wait times have increased **72% since 2020**
- Over **30% of acute care beds** occupied by patients no longer requiring that level of care
- Patient frustration drives demand for private alternatives, fragmenting care access

### The Solution

CanER predicts wait times with **92.4% accuracy** using Linear Regression, backed by a bilingual web interface that surfaces actionable hospital data at the point of decision.

---

## Features

| Feature | Technical Details |
|---------|-------------------|
| **Wait Time Prediction** | Linear Regression (R² = 0.924) on historical ER admission & discharge patterns |
| **Interactive Hospital Map** | Leaflet.js visualization with real-time predicted wait times |
| **Hospital Comparison** | Side-by-side metrics for up to 4 hospitals (wait time, volume, trends) |
| **Trend Analysis** | Hourly, weekly, and seasonal decomposition for peak-hour identification |
| **Email Reports** | Scheduled report generation with prediction summaries |
| **Bilingual Interface** | English/French with preference persistence |
| **Prediction Feedback Loop** | Track model accuracy over time; measure residuals by hospital |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI, Python 3.12 |
| **ML Model** | Scikit-learn (Linear Regression) |
| **Frontend** | HTML5, CSS3, JavaScript (vanilla) |
| **Visualization** | Chart.js (trends), Leaflet.js (maps) |
| **Deployment** | Render.com |

---

## Quick Start

### Requirements
- Python 3.12+
- pip

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/NawazKotwalkar/CanER.git
cd CanER

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train ML model
python model/train.py

# Launch app
python app.py
```

Open **http://localhost:8000** in your browser.

---

## Project Structure

```
CanER/
├── app.py                    # FastAPI entry point
├── model/
│   ├── train.py             # Model training pipeline
│   └── model.pkl            # Trained Linear Regression model
├── data/
│   └── er_data.csv          # Training dataset
├── templates/
│   ├── index.html           # Homepage
│   ├── map.html             # Interactive map
│   ├── compare.html         # Hospital comparison
│   └── trends.html          # Trend analysis
├── static/
│   ├── style.css            # Styling
│   ├── map.js               # Map initialization & logic
│   ├── compare.js           # Comparison widget
│   └── trends.js            # Chart rendering
├── requirements.txt
├── README.md
├── LICENSE
└── .gitignore
```

---

## Model Performance

The Linear Regression model achieves **R² = 0.924** on validation data. Key predictors include:

- Admission volume (t-1, t-2)
- Day of week & hour of day
- Seasonal indicators
- Hospital bed capacity

**Next iteration:** Explore ensemble methods (Random Forest, Gradient Boosting) to capture non-linear dynamics, particularly for peak-hour prediction accuracy.

---

## API Endpoints

```
GET  /                          # Homepage
GET  /map                       # Interactive map view
GET  /compare                   # Hospital comparison
GET  /trends                    # Trend analysis
GET  /api/predict              # POST wait time prediction
GET  /api/hospitals            # Fetch all hospitals + metadata
GET  /api/trends/<hospital_id> # Fetch trend data
POST /api/feedback             # Log prediction feedback
```

---

## Deployment

CanER is ready for production deployment on **Render.com**:

1. Push code to GitHub
2. Connect repository to Render
3. Set Python runtime to 3.12
4. Deploy

See `Procfile` for start command.

---

## What's Next

- [ ] Implement ensemble models (Random Forest, XGBoost) for improved accuracy
- [ ] Add hospital resource data (staffing, bed occupancy) as predictors
- [ ] Build admin dashboard for prediction monitoring & model retraining
- [ ] Integrate live ER data feeds from provincial health systems (where available)
- [ ] A/B test impact of predictions on patient routing decisions

---

## Contributing

Contributions are welcome. Please open an issue for bugs or feature requests.

---

## License

MIT License – see [LICENSE](LICENSE) for details.

---

## Author

**Nawaz Kotwalkar**  
B.Sc. Data Science | Machine Learning Engineer  
[GitHub](https://github.com/NawazKotwalkar) | [LinkedIn](https://linkedin.com/in/nawazkotwalkar)

---

---

# 🇫🇷 CanER – Prédicteur de temps d'attente aux urgences canadiennes

**Sachez avant d'y aller • Intelligence de santé alimentée par l'IA pour le Canada**

---

## À propos de CanER

CanER est un système d'apprentissage automatique qui prédit les temps d'attente aux urgences dans les hôpitaux canadiens. Il permet aux patients de prendre des décisions éclairées concernant les visites hospitalières et aide les administrateurs de la santé à optimiser l'allocation des ressources.

### Le problème

- Les temps d'attente aux urgences canadiennes ont augmenté de **72 % depuis 2020**
- Plus de **30 % des lits de soins aigus** occupés par des patients ne nécessitant plus ce niveau de soins
- La frustration des patients augmente la demande d'alternatives privées, fragmentant l'accès aux soins

### La solution

CanER prédit les temps d'attente avec une **précision de 92,4 %** en utilisant la régression linéaire, soutenue par une interface Web bilingue qui présente des données hospitalières exploitables au moment de la décision.

---

## Caractéristiques

| Caractéristique | Détails techniques |
|-----------------|-------------------|
| **Prédiction du temps d'attente** | Régression linéaire (R² = 0,924) basée sur les modèles historiques d'admission et de sortie aux urgences |
| **Carte hospitalière interactive** | Visualisation Leaflet.js avec temps d'attente prédits en temps réel |
| **Comparaison d'hôpitaux** | Métriques côte à côte pour jusqu'à 4 hôpitaux (temps d'attente, volume, tendances) |
| **Analyse des tendances** | Décomposition horaire, hebdomadaire et saisonnière pour l'identification des heures de pointe |
| **Rapports par email** | Génération de rapports programmés avec résumés de prédictions |
| **Interface bilingue** | Anglais/français avec persistance des préférences |
| **Boucle de retour de prédiction** | Suivi de la précision du modèle au fil du temps ; mesure des résidus par hôpital |

---

## Pile technologique

| Composant | Technologie |
|-----------|-------------|
| **Backend** | FastAPI, Python 3.12 |
| **Modèle ML** | Scikit-learn (régression linéaire) |
| **Frontend** | HTML5, CSS3, JavaScript (vanilla) |
| **Visualisation** | Chart.js (tendances), Leaflet.js (cartes) |
| **Déploiement** | Render.com |

---

## Démarrage rapide

### Exigences
- Python 3.12+
- pip

### Installation et configuration

```bash
# Cloner le référentiel
git clone https://github.com/NawazKotwalkar/CanER.git
cd CanER

# Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Entraîner le modèle ML
python model/train.py

# Lancer l'application
python app.py
```

Ouvrez **http://localhost:8000** dans votre navigateur.

---

## Structure du projet

```
CanER/
├── app.py                    # Point d'entrée FastAPI
├── model/
│   ├── train.py             # Pipeline de formation du modèle
│   └── model.pkl            # Modèle de régression linéaire entraîné
├── data/
│   └── er_data.csv          # Ensemble de données d'entraînement
├── templates/
│   ├── index.html           # Page d'accueil
│   ├── map.html             # Carte interactive
│   ├── compare.html         # Comparaison d'hôpitaux
│   └── trends.html          # Analyse des tendances
├── static/
│   ├── style.css            # Style
│   ├── map.js               # Initialisation et logique de carte
│   ├── compare.js           # Widget de comparaison
│   └── trends.js            # Rendu de graphique
├── requirements.txt
├── README.md
├── LICENSE
└── .gitignore
```

---

## Performance du modèle

Le modèle de régression linéaire atteint **R² = 0,924** sur les données de validation. Les prédicteurs clés incluent :

- Volume d'admission (t-1, t-2)
- Jour de la semaine et heure du jour
- Indicateurs saisonniers
- Capacité de lits d'hôpital

**Prochaine itération :** Explorer les modèles d'ensemble (forêt aléatoire, gradient boosting) pour capturer les dynamiques non linéaires, en particulier pour la précision de prédiction aux heures de pointe.

---

## Points de terminaison API

```
GET  /                          # Page d'accueil
GET  /map                       # Vue de carte interactive
GET  /compare                   # Comparaison d'hôpitaux
GET  /trends                    # Analyse des tendances
GET  /api/predict              # Prédiction POST du temps d'attente
GET  /api/hospitals            # Récupérer tous les hôpitaux + métadonnées
GET  /api/trends/<hospital_id> # Récupérer les données de tendance
POST /api/feedback             # Enregistrer les commentaires de prédiction
```

---

## Déploiement

CanER est prêt pour le déploiement en production sur **Render.com** :

1. Poussez le code vers GitHub
2. Connectez le référentiel à Render
3. Définissez le runtime Python sur 3.12
4. Déployer

Voir `Procfile` pour la commande de démarrage.

---

## Prochaines étapes

- [ ] Implémenter des modèles d'ensemble (forêt aléatoire, XGBoost) pour améliorer la précision
- [ ] Ajouter des données de ressources hospitalières (personnel, occupation des lits) en tant que prédicteurs
- [ ] Créer un tableau de bord administrateur pour le suivi des prédictions et le réentraînement du modèle
- [ ] Intégrer les flux de données d'urgences en direct des systèmes de santé provinciaux (le cas échéant)
- [ ] Test A/B de l'impact des prédictions sur les décisions d'orientation des patients

---

## Contribution

Les contributions sont les bienvenues. Veuillez ouvrir un problème pour les bogues ou les demandes de fonctionnalités.

---

## Licence

Licence MIT – voir [LICENSE](LICENSE) pour plus de détails.

---

## Auteur

**Nawaz Kotwalkar**  
B.Sc. Data Science | Machine Learning Engineer  
[GitHub](https://github.com/NawazKotwalkar) | [LinkedIn](https://linkedin.com/in/nawazkotwalkar)

---