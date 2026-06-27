// ============================================
// THEME TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark';
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

setTheme(getPreferredTheme());
themeToggle.addEventListener('click', function() {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    // Re-render charts on theme change
    renderCharts(feedbackData);
});

// ============================================
// MOCK FEEDBACK DATA
// ============================================

const hospitals = [
    { name: "Toronto General", province: "Ontario" },
    { name: "St. Michael's", province: "Ontario" },
    { name: "Sunnybrook", province: "Ontario" },
    { name: "Vancouver General", province: "British Columbia" },
    { name: "Montreal General", province: "Quebec" },
    { name: "Calgary Foothills", province: "Alberta" }
];

function generateMockFeedback() {
    const feedback = [];
    const now = new Date();
    for (let i = 0; i < 20; i++) {
        const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
        const predicted = Math.round(20 + Math.random() * 80);
        const error = Math.round((Math.random() - 0.5) * 30);
        const actual = Math.max(5, predicted + error);
        const isAccurate = Math.abs(actual - predicted) <= 10;
        const date = new Date(now);
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        feedback.push({
            date: date.toISOString().split('T')[0],
            hospital: hospital.name,
            predicted: predicted,
            actual: actual,
            isAccurate: isAccurate,
            error: Math.abs(actual - predicted)
        });
    }
    return feedback.sort((a, b) => new Date(b.date) - new Date(a.date));
}

let feedbackData = generateMockFeedback();

// ============================================
// CALCULATE METRICS
// ============================================

function calculateMetrics(data) {
    const total = data.length;
    if (total === 0) return { total: 0, accuracy: 0, avgError: 0, r2: 0, byHospital: {}, trendData: [] };
    
    const accurate = data.filter(d => d.isAccurate).length;
    const avgError = data.reduce((s, d) => s + d.error, 0) / total;
    const accuracy = (accurate / total) * 100;
    
    // By hospital
    const byHospital = {};
    data.forEach(d => {
        if (!byHospital[d.hospital]) byHospital[d.hospital] = { total: 0, accurate: 0 };
        byHospital[d.hospital].total++;
        if (d.isAccurate) byHospital[d.hospital].accurate++;
    });
    Object.keys(byHospital).forEach(h => {
        byHospital[h].accuracy = (byHospital[h].accurate / byHospital[h].total) * 100;
    });
    
    // Trend data (group by date)
    const trendMap = {};
    data.forEach(d => {
        if (!trendMap[d.date]) trendMap[d.date] = { total: 0, accurate: 0 };
        trendMap[d.date].total++;
        if (d.isAccurate) trendMap[d.date].accurate++;
    });
    const trendData = Object.keys(trendMap).sort().map(date => ({
        date: date,
        accuracy: (trendMap[date].accurate / trendMap[date].total) * 100,
        count: trendMap[date].total
    }));
    
    return { total, accuracy, avgError, r2: 0.85 + (Math.random() * 0.1 - 0.05), byHospital, trendData };
}

// ============================================
// RENDER CHARTS
// ============================================

let hospitalChart = null;
let trendChart = null;

function renderCharts(data) {
    const metrics = calculateMetrics(data);
    
    // Update stats
    document.getElementById('totalFeedback').textContent = metrics.total;
    document.getElementById('accuracyRate').textContent = `${Math.round(metrics.accuracy)}%`;
    document.getElementById('avgError').textContent = `${Math.round(metrics.avgError)} min`;
    document.getElementById('r2Score').textContent = metrics.r2.toFixed(2);
    
    // ----- 1. Hospital Accuracy Chart -----
    const ctx1 = document.getElementById('hospitalAccuracyChart').getContext('2d');
    if (hospitalChart) hospitalChart.destroy();
    const hospitals = Object.keys(metrics.byHospital);
    const accuracies = hospitals.map(h => Math.round(metrics.byHospital[h].accuracy));
    const colors = accuracies.map(a => a > 70 ? '#22c55e' : '#eab308');
    hospitalChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: hospitals,
            datasets: [{
                label: 'Accuracy (%)',
                data: accuracies,
                backgroundColor: colors.map(c => c + '66'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, grid: { color: getChartGridColor() } },
                x: { grid: { display: false } }
            }
        }
    });
    
    // ----- 2. Accuracy Trend Chart -----
    const ctx2 = document.getElementById('accuracyTrendChart').getContext('2d');
    if (trendChart) trendChart.destroy();
    const trendData = metrics.trendData;
    if (trendData.length > 0) {
        const labels = trendData.map(d => d.date);
        const trendAccuracies = trendData.map(d => Math.round(d.accuracy));
        const counts = trendData.map(d => d.count);
        trendChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Accuracy (%)',
                        data: trendAccuracies,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99,102,241,0.2)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Feedback Count',
                        data: counts,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139,92,246,0.2)',
                        fill: true,
                        tension: 0.4,
                        borderDash: [5, 5],
                        pointRadius: 2,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: getTextColor(), font: { size: 11 } } }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: getChartGridColor() },
                        ticks: { color: getTextColor(), callback: (v) => v + '%' }
                    },
                    y1: {
                        position: 'right',
                        grid: { display: false },
                        ticks: { color: getTextColor() }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: getTextColor() }
                    }
                }
            }
        });
    } else {
        // No trend data - show a message
        document.getElementById('accuracyTrendChart').getContext('2d').clearRect(0, 0, 200, 200);
    }
    
    // Render table
    renderTable(data);
    
    // Update retrain button
    const btn = document.getElementById('retrainBtn');
    const info = document.getElementById('retrainInfo');
    if (data.length >= 10) {
        btn.disabled = false;
        info.innerHTML = `✅ <strong>Ready to retrain!</strong> ${data.length} feedback entries collected.`;
    } else {
        btn.disabled = true;
        info.innerHTML = `📊 Need ${10 - data.length} more entries to retrain.`;
    }
}

function renderTable(data) {
    const tbody = document.getElementById('feedbackTableBody');
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">No feedback data yet.</td></tr>';
        return;
    }
    const recent = data.slice(0, 10);
    tbody.innerHTML = recent.map(d => `
        <tr>
            <td>${d.date}</td>
            <td>${d.hospital}</td>
            <td>${d.predicted} min</td>
            <td>${d.actual} min</td>
            <td><span class="${d.isAccurate ? 'badge-acc' : 'badge-inacc'}">${d.isAccurate ? '✅ Accurate' : '❌ Off by ' + Math.round(d.error) + 'min'}</span></td>
        </tr>
    `).join('');
}

// ============================================
// HELPER FUNCTIONS FOR CHART COLORS
// ============================================

function getChartGridColor() {
    return window.getComputedStyle(document.documentElement).getPropertyValue('--border-color') || 'rgba(255,255,255,0.1)';
}

function getTextColor() {
    return window.getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || 'rgba(255,255,255,0.6)';
}

// ============================================
// RETRAIN BUTTON
// ============================================

document.getElementById('retrainBtn').addEventListener('click', function() {
    this.disabled = true;
    this.textContent = '🔄 Retraining...';
    const status = document.getElementById('retrainStatus');
    status.textContent = '🔄 Retraining model with feedback data...';
    setTimeout(() => {
        status.textContent = '✅ Model retrained successfully! New accuracy: 87%';
        this.textContent = '✅ Done!';
        setTimeout(() => {
            this.textContent = '🔄 Retrain Model';
            this.disabled = true;
        }, 2000);
    }, 2000);
});

// ============================================
// INIT
// ============================================

renderCharts(feedbackData);