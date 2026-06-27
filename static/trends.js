// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
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
// HOSPITAL DATA
// ============================================

const hospitals = [
    { name: "Toronto General", wait: 45, rating: 4.2 },
    { name: "St. Michael's", wait: 62, rating: 4.0 },
    { name: "Sunnybrook", wait: 38, rating: 4.5 },
    { name: "North York General", wait: 55, rating: 3.9 },
    { name: "Scarborough General", wait: 48, rating: 3.8 },
    { name: "Vancouver General", wait: 35, rating: 4.3 },
    { name: "St. Paul's Hospital", wait: 52, rating: 4.1 },
    { name: "Royal Columbian", wait: 28, rating: 3.7 },
    { name: "Montreal General", wait: 42, rating: 4.0 },
    { name: "Jewish General", wait: 58, rating: 3.9 },
    { name: "Quebec City CHU", wait: 33, rating: 4.2 },
    { name: "Calgary Foothills", wait: 47, rating: 4.3 },
    { name: "Edmonton Royal Alex", wait: 54, rating: 3.8 },
    { name: "South Calgary Health", wait: 29, rating: 4.0 },
    { name: "Ottawa General", wait: 41, rating: 4.1 },
    { name: "Hamilton General", wait: 49, rating: 3.9 },
    { name: "London Health", wait: 36, rating: 4.4 },
    { name: "Winnipeg Health", wait: 44, rating: 3.7 },
    { name: "Halifax Infirmary", wait: 39, rating: 4.0 },
    { name: "Saskatoon Royal", wait: 46, rating: 3.6 },
    { name: "Kelowna General", wait: 31, rating: 3.9 },
    { name: "Moncton Hospital", wait: 43, rating: 3.8 },
    { name: "St. John's Health", wait: 51, rating: 3.5 },
    { name: "Victoria General", wait: 34, rating: 4.1 },
    { name: "Regina General", wait: 56, rating: 3.4 }
];

// ============================================
// CHART INSTANCES
// ============================================

let hourlyChart = null;
let weeklyChart = null;
let monthlyChart = null;
let seasonalChart = null;

// ============================================
// GENERATE MOCK HISTORICAL DATA
// ============================================

function generateHistoricalData(baseWait) {
    // Hourly data (24 hours)
    const hourly = [];
    for (let i = 0; i < 24; i++) {
        let variation = 0;
        if (i >= 8 && i <= 10) variation = -10; // Morning dip
        else if (i >= 17 && i <= 20) variation = 20; // Evening peak
        else if (i >= 23 || i <= 5) variation = -15; // Night low
        else if (i >= 12 && i <= 14) variation = 5; // Lunch rush
        const value = Math.max(5, Math.round(baseWait + variation + (Math.random() * 8 - 4)));
        hourly.push(value);
    }
    
    // Weekly data (7 days)
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekly = weekdays.map((day, i) => {
        let variation = 0;
        if (i === 0) variation = 15; // Monday busy
        else if (i === 6) variation = 10; // Sunday busy
        else if (i >= 1 && i <= 4) variation = -5; // Mid-week low
        else if (i === 5) variation = 0; // Saturday average
        return Math.max(5, Math.round(baseWait + variation + (Math.random() * 6 - 3)));
    });
    
    // Monthly data (12 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthly = months.map((month, i) => {
        let variation = 0;
        if (i >= 11 || i <= 1) variation = 20; // Winter peak
        else if (i >= 2 && i <= 4) variation = -10; // Spring dip
        else if (i >= 5 && i <= 8) variation = 5; // Summer average
        else variation = 0; // Fall average
        return Math.max(5, Math.round(baseWait + variation + (Math.random() * 8 - 4)));
    });
    
    // Seasonal data
    const seasons = ['Winter ❄️', 'Spring 🌸', 'Summer ☀️', 'Fall 🍂'];
    const seasonal = seasons.map((season, i) => {
        let variation = 0;
        if (i === 0) variation = 20; // Winter peak
        else if (i === 1) variation = -10; // Spring dip
        else if (i === 2) variation = 5; // Summer average
        else variation = 0; // Fall average
        return Math.max(5, Math.round(baseWait + variation + (Math.random() * 6 - 3)));
    });
    
    return { hourly, weekly, monthly, seasonal, weekdays, months, seasons };
}

// ============================================
// CHART COLORS
// ============================================

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        text: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        orange: '#f97316',
        border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
    };
}

// ============================================
// CREATE CHARTS
// ============================================

function createCharts(data, hospitalName) {
    const colors = getChartColors();
    const baseWait = data.hourly.reduce((a, b) => a + b, 0) / data.hourly.length;
    
    // Find best and worst times
    const minHour = data.hourly.indexOf(Math.min(...data.hourly));
    const maxHour = data.hourly.indexOf(Math.max(...data.hourly));
    const minDay = data.weekly.indexOf(Math.min(...data.weekly));
    const maxDay = data.weekly.indexOf(Math.max(...data.weekly));
    const bestMonth = data.monthly.indexOf(Math.min(...data.monthly));
    const worstMonth = data.monthly.indexOf(Math.max(...data.monthly));
    
    // Update insights
    document.getElementById('insightsGrid').innerHTML = `
        <div class="insight-card">
            <div class="label">🏆 Best Time</div>
            <div class="value green">${minHour}:00</div>
            <div class="sub">${Math.min(...data.hourly)} min wait</div>
        </div>
        <div class="insight-card">
            <div class="label">⚠️ Worst Time</div>
            <div class="value red">${maxHour}:00</div>
            <div class="sub">${Math.max(...data.hourly)} min wait</div>
        </div>
        <div class="insight-card">
            <div class="label">📅 Best Day</div>
            <div class="value green">${data.weekdays[minDay]}</div>
            <div class="sub">${Math.min(...data.weekly)} min wait</div>
        </div>
        <div class="insight-card">
            <div class="label">📅 Worst Day</div>
            <div class="value red">${data.weekdays[maxDay]}</div>
            <div class="sub">${Math.max(...data.weekly)} min wait</div>
        </div>
        <div class="insight-card">
            <div class="label">🌡️ Best Season</div>
            <div class="value green">${data.seasons[data.seasonal.indexOf(Math.min(...data.seasonal))]}</div>
            <div class="sub">${Math.min(...data.seasonal)} min wait</div>
        </div>
        <div class="insight-card">
            <div class="label">🌡️ Worst Season</div>
            <div class="value red">${data.seasons[data.seasonal.indexOf(Math.max(...data.seasonal))]}</div>
            <div class="sub">${Math.max(...data.seasonal)} min wait</div>
        </div>
    `;
    
    // 1. Hourly Chart
    if (hourlyChart) hourlyChart.destroy();
    const hourlyCtx = document.getElementById('hourlyChart').getContext('2d');
    hourlyChart = new Chart(hourlyCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            datasets: [{
                label: 'Wait Time (min)',
                data: data.hourly,
                borderColor: colors.primary,
                backgroundColor: colors.primary + '33',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: colors.primary
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} minutes`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: colors.grid },
                    ticks: { color: colors.text }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: colors.text,
                        maxTicksLimit: 12
                    }
                }
            }
        }
    });
    
    // 2. Weekly Chart
    if (weeklyChart) weeklyChart.destroy();
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    const weeklyColors = data.weekly.map(v => v > baseWait + 10 ? colors.danger : v < baseWait - 5 ? colors.success : colors.warning);
    weeklyChart = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: data.weekdays,
            datasets: [{
                label: 'Wait Time (min)',
                data: data.weekly,
                backgroundColor: weeklyColors.map(c => c + '66'),
                borderColor: weeklyColors,
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} minutes`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: colors.grid },
                    ticks: { color: colors.text }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: colors.text }
                }
            }
        }
    });
    
    // 3. Monthly Chart
    if (monthlyChart) monthlyChart.destroy();
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    monthlyChart = new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [{
                label: 'Wait Time (min)',
                data: data.monthly,
                borderColor: colors.secondary,
                backgroundColor: colors.secondary + '33',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: data.monthly.map(v => 
                    v > baseWait + 15 ? colors.danger : 
                    v < baseWait - 5 ? colors.success : 
                    colors.secondary
                )
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y} minutes`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: colors.grid },
                    ticks: { color: colors.text }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: colors.text }
                }
            }
        }
    });
    
    // 4. Seasonal Chart
    if (seasonalChart) seasonalChart.destroy();
    const seasonalCtx = document.getElementById('seasonalChart').getContext('2d');
    const seasonalColors = data.seasonal.map(v => 
        v > baseWait + 15 ? colors.danger : 
        v < baseWait - 5 ? colors.success : 
        colors.warning
    );
    seasonalChart = new Chart(seasonalCtx, {
        type: 'doughnut',
        data: {
            labels: data.seasons,
            datasets: [{
                data: data.seasonal,
                backgroundColor: ['#ef444466', '#22c55e66', '#eab30866', '#f9731666'],
                borderColor: ['#ef4444', '#22c55e', '#eab308', '#f97316'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: colors.text, font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.parsed} minutes`
                    }
                }
            }
        }
    });
}

// ============================================
// LOAD HOSPITAL DATA
// ============================================

function loadHospitalData(hospitalName) {
    const loading = document.getElementById('loadingState');
    const content = document.getElementById('chartContent');
    
    loading.style.display = 'block';
    content.style.display = 'none';
    
    // Simulate loading
    setTimeout(() => {
        const hospital = hospitals.find(h => h.name === hospitalName);
        if (!hospital) return;
        
        const data = generateHistoricalData(hospital.wait);
        createCharts(data, hospitalName);
        
        loading.style.display = 'none';
        content.style.display = 'block';
    }, 500);
}

// ============================================
// POPULATE HOSPITAL SELECT
// ============================================

function populateSelect() {
    const select = document.getElementById('hospitalSelect');
    hospitals.sort((a, b) => a.name.localeCompare(b.name));
    hospitals.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.name;
        opt.textContent = h.name;
        select.appendChild(opt);
    });
    
    // Set default to first
    if (hospitals.length > 0) {
        select.value = hospitals[0].name;
        loadHospitalData(hospitals[0].name);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.getElementById('hospitalSelect').addEventListener('change', function() {
    if (this.value) {
        loadHospitalData(this.value);
    }
});

// ============================================
// THEME CHANGE - Re-render charts
// ============================================

const observer = new MutationObserver(() => {
    // Re-render charts on theme change
    const selected = document.getElementById('hospitalSelect').value;
    if (selected) {
        loadHospitalData(selected);
    }
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

// ============================================
// INIT
// ============================================

populateSelect();

// Set default date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('dateRange').value = today;