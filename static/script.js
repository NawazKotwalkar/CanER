// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

setTheme(getPreferredTheme());
themeToggle.addEventListener('click', toggleTheme);

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    en: {
        title: "CanER - Canadian ER Wait Time Predictor",
        subtitle: "Know before you go • Canadian Healthcare",
        emergency: "⚠️ Emergency?",
        emergency_call: "Call 911 or go to nearest ER",
        province: "Province",
        hospital_type: "Hospital Type",
        urban: "Urban (City)",
        rural: "Rural",
        day: "Day of Week",
        hour: "Hour (0-23)",
        season: "Season",
        winter: "Winter ❄️",
        spring: "Spring 🌸",
        summer: "Summer ☀️",
        fall: "Fall 🍂",
        triage: "Triage Level (1=Critical, 5=Minor)",
        predict: "🔮 Predict Wait Time",
        analyzing: "Analyzing ER data...",
        fast: "Fast 🟢",
        moderate: "Moderate 🟡",
        long: "Long 🔴",
        recommendation_fast: "Go to this ER now",
        recommendation_moderate: "Consider this ER or check others",
        recommendation_long: "Try a different hospital if possible",
        api_docs: "📚 API Docs",
        view_map: "🗺️ View Map",
        compare_hospitals: "📊 Compare Hospitals",
        trends: "📈 Trends",
        peak_hours: "⏰ Peak Hours",
        reports: "📧 Reports",
        accuracy: "📊 Accuracy",
        made_for_canada: "🇨🇦 Made for Canada",
        feedback_title: "Was this prediction accurate?",
        feedback_accurate: "✅ Accurate",
        feedback_inaccurate: "❌ Inaccurate",
        feedback_or: "or",
        feedback_detailed: "📝 Provide Detailed Feedback",
        feedback_view: "📊 View Accuracy"
    },
    fr: {
        title: "CanER - Prédicteur de temps d'attente aux urgences",
        subtitle: "Sachez avant d'y aller • Santé canadienne",
        emergency: "⚠️ Urgence?",
        emergency_call: "Appelez le 911 ou allez aux urgences",
        province: "Province",
        hospital_type: "Type d'hôpital",
        urban: "Urbain (Ville)",
        rural: "Rural",
        day: "Jour de la semaine",
        hour: "Heure (0-23)",
        season: "Saison",
        winter: "Hiver ❄️",
        spring: "Printemps 🌸",
        summer: "Été ☀️",
        fall: "Automne 🍂",
        triage: "Niveau de triage (1=Critique, 5=Mineur)",
        predict: "🔮 Prédire le temps d'attente",
        analyzing: "Analyse des données des urgences...",
        fast: "Rapide 🟢",
        moderate: "Modéré 🟡",
        long: "Long 🔴",
        recommendation_fast: "Allez aux urgences maintenant",
        recommendation_moderate: "Envisagez ces urgences ou vérifiez ailleurs",
        recommendation_long: "Essayez un autre hôpital si possible",
        api_docs: "📚 Documentation API",
        view_map: "🗺️ Voir la carte",
        compare_hospitals: "📊 Comparer les hôpitaux",
        trends: "📈 Tendances",
        peak_hours: "⏰ Heures de pointe",
        reports: "📧 Rapports",
        accuracy: "📊 Précision",
        made_for_canada: "🇨🇦 Fait pour le Canada",
        feedback_title: "Cette prédiction était-elle précise?",
        feedback_accurate: "✅ Précise",
        feedback_inaccurate: "❌ Imprécise",
        feedback_or: "ou",
        feedback_detailed: "📝 Fournir un commentaire détaillé",
        feedback_view: "📊 Voir la précision"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.querySelector('.lang-icon').textContent = lang === 'en' ? '🇫🇷' : '🇬🇧';
    document.querySelector('.lang-toggle').setAttribute('aria-label', lang === 'en' ? 'Passer en français' : 'Switch to English');
    applyTranslations();
}

function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'fr' : 'en');
}

function applyTranslations() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
}

document.getElementById('langToggle').addEventListener('click', toggleLanguage);
setLanguage(currentLang);

// ============================================
// RIPPLE EFFECT (Feature 2)
// ============================================

document.querySelectorAll('.btn-predict').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ============================================
// SMART INPUT VALIDATION (Feature 5)
// ============================================

const hourInput = document.getElementById('hour');
const triageInput = document.getElementById('triage');
const hourError = document.getElementById('hourError');
const triageError = document.getElementById('triageError');

// Hour validation
hourInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (this.value === '') {
        hourError.classList.remove('show');
        return;
    }
    if (isNaN(value) || value < 0 || value > 23) {
        hourError.classList.add('show');
        this.setCustomValidity('Invalid hour');
    } else {
        hourError.classList.remove('show');
        this.setCustomValidity('');
    }
});

hourInput.addEventListener('blur', function() {
    if (this.value === '') {
        hourError.classList.remove('show');
        return;
    }
    const value = parseInt(this.value);
    if (isNaN(value) || value < 0 || value > 23) {
        hourError.classList.add('show');
    }
});

// Triage validation
triageInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (this.value === '') {
        triageError.classList.remove('show');
        return;
    }
    if (isNaN(value) || value < 1 || value > 5) {
        triageError.classList.add('show');
        this.setCustomValidity('Invalid triage level');
    } else {
        triageError.classList.remove('show');
        this.setCustomValidity('');
    }
});

triageInput.addEventListener('blur', function() {
    if (this.value === '') {
        triageError.classList.remove('show');
        return;
    }
    const value = parseInt(this.value);
    if (isNaN(value) || value < 1 || value > 5) {
        triageError.classList.add('show');
    }
});

// ============================================
// FORM SUBMISSION WITH SKELETON LOADING
// ============================================

document.getElementById('predictForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('predictBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const skeleton = document.getElementById('skeletonWrapper');
    const feedbackSection = document.getElementById('feedbackSection');
    
    // Validate form
    const hour = parseInt(document.getElementById('hour').value);
    const triage = parseInt(document.getElementById('triage').value);
    
    if (isNaN(hour) || hour < 0 || hour > 23) {
        hourError.classList.add('show');
        document.getElementById('hour').focus();
        return;
    }
    if (isNaN(triage) || triage < 1 || triage > 5) {
        triageError.classList.add('show');
        document.getElementById('triage').focus();
        return;
    }
    
    // Disable button
    btn.disabled = true;
    result.classList.remove('show');
    feedbackSection.style.display = 'none';
    
    // Show skeleton loading (Feature 1)
    skeleton.style.display = 'block';
    loading.classList.remove('show');
    
    const data = {
        province: document.getElementById('province').value,
        hospital_type: document.getElementById('hospital_type').value,
        day_of_week: document.getElementById('day').value,
        hour: hour,
        season: document.getElementById('season').value,
        triage_level: triage
    };
    
    try {
        // Simulate loading delay for skeleton effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const resultData = await response.json();
        
        // Hide skeleton
        skeleton.style.display = 'none';
        loading.classList.remove('show');
        btn.disabled = false;
        
        // Display result with animation
        displayResult(resultData);
        
    } catch (err) {
        skeleton.style.display = 'none';
        loading.classList.remove('show');
        btn.disabled = false;
        result.className = 'result show';
        result.innerHTML = `
            <div style="color: #ef4444; text-align:center;">
                ❌ Error: Could not predict. Please try again.
            </div>
        `;
    }
});

// ============================================
// ANIMATED RESULT DISPLAY (Feature 4)
// ============================================

function displayResult(resultData) {
    const result = document.getElementById('result');
    const feedbackSection = document.getElementById('feedbackSection');
    
    // Determine category
    const t = translations[currentLang];
    let categoryText, recommendationText, className;
    
    if (resultData.wait_time_category.includes('Fast')) {
        categoryText = t.fast;
        recommendationText = t.recommendation_fast;
        className = 'fast';
    } else if (resultData.wait_time_category.includes('Moderate')) {
        categoryText = t.moderate;
        recommendationText = t.recommendation_moderate;
        className = 'moderate';
    } else {
        categoryText = t.long;
        recommendationText = t.recommendation_long;
        className = 'long';
    }
    
    const emoji = resultData.wait_time_category.includes('Fast') ? '🟢' : 
                 resultData.wait_time_category.includes('Moderate') ? '🟡' : '🔴';
    
    // Build result HTML
    result.className = `result show ${className}`;
    result.innerHTML = `
        <div class="result-number">
            <span class="animate-number" id="resultValue">${resultData.predicted_wait_minutes}</span>
            <span>minutes</span>
        </div>
        <div class="result-category">
            ${emoji} ${categoryText}
        </div>
        <div class="result-recommendation">
            💡 ${recommendationText}
        </div>
        <div class="result-details">
            <p>🆔 ${resultData.id}</p>
            <p>🕐 ${resultData.timestamp}</p>
        </div>
    `;
    
    // Store prediction for feedback
    lastPrediction = {
        id: resultData.id,
        predicted_wait_minutes: resultData.predicted_wait_minutes
    };
    
    // Show feedback section after a delay
    setTimeout(() => {
        feedbackSection.style.display = 'block';
        feedbackSection.style.animation = 'fadeIn 0.5s ease';
    }, 500);
}

// ============================================
// FEEDBACK SYSTEM
// ============================================

let lastPrediction = null;

document.querySelectorAll('.feedback-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        const feedback = this.dataset.feedback;
        if (!lastPrediction) return;
        
        document.querySelectorAll('.feedback-btn').forEach(b => b.disabled = true);
        this.style.opacity = '0.7';
        
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prediction_id: lastPrediction.id,
                    predicted_wait: lastPrediction.predicted_wait_minutes,
                    feedback: feedback,
                    actual_wait: feedback === 'accurate' ? lastPrediction.predicted_wait_minutes : null
                })
            });
            
            if (response.ok) {
                this.textContent = feedback === 'accurate' ? '✅ Thank you!' : '❌ Thanks for feedback!';
                this.className = 'feedback-btn ' + (feedback === 'accurate' ? 'feedback-btn-thankyou' : 'feedback-btn-thanks-inaccurate');
            }
        } catch (err) {
            console.error('Feedback error:', err);
        }
    });
});

document.getElementById('detailedFeedbackBtn').addEventListener('click', function() {
    if (lastPrediction) {
        window.location.href = `/feedback?prediction_id=${lastPrediction.id}&predicted=${lastPrediction.predicted_wait_minutes}`;
    }
});