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
    { name: "Toronto General", lat: 43.6596, lng: -79.3852, wait: 45, address: "200 Elizabeth St, Toronto", province: "Ontario", rating: 4.2, beds: 85, doctors: 45 },
    { name: "St. Michael's", lat: 43.6541, lng: -79.3796, wait: 62, address: "30 Bond St, Toronto", province: "Ontario", rating: 4.0, beds: 72, doctors: 38 },
    { name: "Sunnybrook", lat: 43.7304, lng: -79.3791, wait: 38, address: "2075 Bayview Ave, Toronto", province: "Ontario", rating: 4.5, beds: 90, doctors: 52 },
    { name: "North York General", lat: 43.7674, lng: -79.4110, wait: 55, address: "4001 Leslie St, Toronto", province: "Ontario", rating: 3.9, beds: 65, doctors: 35 },
    { name: "Scarborough General", lat: 43.7742, lng: -79.2397, wait: 48, address: "3050 Lawrence Ave E, Toronto", province: "Ontario", rating: 3.8, beds: 60, doctors: 32 },
    { name: "Vancouver General", lat: 49.2637, lng: -123.1153, wait: 35, address: "855 W 12th Ave, Vancouver", province: "British Columbia", rating: 4.3, beds: 88, doctors: 48 },
    { name: "St. Paul's Hospital", lat: 49.2813, lng: -123.1284, wait: 52, address: "1081 Burrard St, Vancouver", province: "British Columbia", rating: 4.1, beds: 70, doctors: 40 },
    { name: "Royal Columbian", lat: 49.2232, lng: -122.8893, wait: 28, address: "330 E Columbia St, New Westminster", province: "British Columbia", rating: 3.7, beds: 55, doctors: 30 },
    { name: "Montreal General", lat: 45.4972, lng: -73.5889, wait: 42, address: "1650 Cedar Ave, Montreal", province: "Quebec", rating: 4.0, beds: 75, doctors: 42 },
    { name: "Jewish General", lat: 45.4827, lng: -73.6343, wait: 58, address: "3755 Côte-Sainte-Catherine Rd, Montreal", province: "Quebec", rating: 3.9, beds: 68, doctors: 36 },
    { name: "Quebec City CHU", lat: 46.8287, lng: -71.2649, wait: 33, address: "10 Rue de l'Espinay, Quebec City", province: "Quebec", rating: 4.2, beds: 80, doctors: 44 },
    { name: "Calgary Foothills", lat: 51.0706, lng: -114.1300, wait: 47, address: "1403 29 St NW, Calgary", province: "Alberta", rating: 4.3, beds: 82, doctors: 46 },
    { name: "Edmonton Royal Alex", lat: 53.5647, lng: -113.4867, wait: 54, address: "10240 Kingsway NW, Edmonton", province: "Alberta", rating: 3.8, beds: 62, doctors: 34 },
    { name: "South Calgary Health", lat: 50.9321, lng: -114.0847, wait: 29, address: "4448 Front St SE, Calgary", province: "Alberta", rating: 4.0, beds: 58, doctors: 33 },
    { name: "Ottawa General", lat: 45.4049, lng: -75.6486, wait: 41, address: "501 Smyth Rd, Ottawa", province: "Ontario", rating: 4.1, beds: 78, doctors: 43 },
    { name: "Hamilton General", lat: 43.2598, lng: -79.8717, wait: 49, address: "237 Barton St E, Hamilton", province: "Ontario", rating: 3.9, beds: 66, doctors: 37 },
    { name: "London Health", lat: 42.9876, lng: -81.2382, wait: 36, address: "800 Commissioners Rd E, London", province: "Ontario", rating: 4.4, beds: 84, doctors: 50 },
    { name: "Winnipeg Health", lat: 49.9068, lng: -97.1370, wait: 44, address: "700 William Ave, Winnipeg", province: "Manitoba", rating: 3.7, beds: 64, doctors: 35 },
    { name: "Halifax Infirmary", lat: 44.6540, lng: -63.5880, wait: 39, address: "1796 Summer St, Halifax", province: "Nova Scotia", rating: 4.0, beds: 72, doctors: 40 },
    { name: "Saskatoon Royal", lat: 52.1200, lng: -106.6590, wait: 46, address: "103 Hospital Dr, Saskatoon", province: "Saskatchewan", rating: 3.6, beds: 58, doctors: 30 },
    { name: "Kelowna General", lat: 49.8834, lng: -119.4900, wait: 31, address: "2268 Pandosy St, Kelowna", province: "British Columbia", rating: 3.9, beds: 56, doctors: 32 },
    { name: "Moncton Hospital", lat: 46.0932, lng: -64.7735, wait: 43, address: "135 MacBeath Ave, Moncton", province: "New Brunswick", rating: 3.8, beds: 60, doctors: 33 },
    { name: "St. John's Health", lat: 47.5780, lng: -52.7070, wait: 51, address: "300 Prince Philip Dr, St. John's", province: "Newfoundland", rating: 3.5, beds: 54, doctors: 28 },
    { name: "Victoria General", lat: 48.4350, lng: -123.3270, wait: 34, address: "1 Hospital Way, Victoria", province: "British Columbia", rating: 4.1, beds: 74, doctors: 42 },
    { name: "Regina General", lat: 50.4490, lng: -104.6470, wait: 56, address: "1440 14th Ave, Regina", province: "Saskatchewan", rating: 3.4, beds: 52, doctors: 26 }
];

// ============================================
// PEAK DETECTION ENGINE
// ============================================

function generateHourlyData(baseWait, hospitalName) {
    const hourly = [];
    for (let i = 0; i < 24; i++) {
        let variation = 0;
        if (i >= 8 && i <= 10) variation = -8;
        else if (i >= 17 && i <= 20) variation = 25;
        else if (i >= 23 || i <= 5) variation = -20;
        else if (i >= 12 && i <= 14) variation = 5;
        const value = Math.max(5, Math.round(baseWait + variation + (Math.random() * 6 - 3)));
        hourly.push(value);
    }
    return hourly;
}

function findPeaks(hourlyData) {
    const max = Math.max(...hourlyData);
    const min = Math.min(...hourlyData);
    const avg = hourlyData.reduce((a, b) => a + b, 0) / hourlyData.length;
    const peakHour = hourlyData.indexOf(max);
    const quietHour = hourlyData.indexOf(min);
    
    // Find current status based on average
    let status, statusClass;
    if (avg > 60) { status = 'Very Busy 🔴'; statusClass = 'badge-danger'; }
    else if (avg > 45) { status = 'Busy 🟠'; statusClass = 'badge-warning'; }
    else if (avg > 25) { status = 'Moderate 🟡'; statusClass = 'badge-warning'; }
    else { status = 'Quiet 🟢'; statusClass = 'badge-success'; }
    
    // Find peak windows (hours with values > avg + 15)
    const peakWindows = [];
    const quietWindows = [];
    hourlyData.forEach((val, i) => {
        if (val > avg + 15) peakWindows.push(i);
        if (val < avg - 10) quietWindows.push(i);
    });
    
    // Find continuous peak periods
    const peakPeriods = [];
    let start = null;
    for (let i = 0; i < hourlyData.length; i++) {
        if (hourlyData[i] > avg + 15 && start === null) start = i;
        if (hourlyData[i] <= avg + 15 && start !== null) {
            peakPeriods.push({ start, end: i - 1 });
            start = null;
        }
    }
    if (start !== null) peakPeriods.push({ start, end: hourlyData.length - 1 });
    
    // Format peak periods
    const formattedPeaks = peakPeriods.map(p => {
        const startHour = p.start === 0 ? '12:00 AM' : p.start < 12 ? `${p.start}:00 AM` : p.start === 12 ? '12:00 PM' : `${p.start - 12}:00 PM`;
        const endHour = p.end === 0 ? '12:00 AM' : p.end < 12 ? `${p.end}:00 AM` : p.end === 12 ? '12:00 PM' : `${p.end - 12}:00 PM`;
        return `${startHour} - ${endHour}`;
    });
    
    return {
        peakHour: peakHour,
        peakWait: max,
        quietHour: quietHour,
        quietWait: min,
        avgWait: Math.round(avg),
        status: status,
        statusClass: statusClass,
        peakWindows: peakWindows,
        quietWindows: quietWindows,
        peakPeriods: formattedPeaks,
        hourlyData: hourlyData
    };
}

// ============================================
// RENDER PEAK DASHBOARD
// ============================================

let peakChart = null;

function renderPeakDashboard(hourlyData, hospitalName) {
    const peaks = findPeaks(hourlyData);
    
    // Update cards
    const peakHour = peaks.peakHour === 0 ? '12:00 AM' : peaks.peakHour < 12 ? `${peaks.peakHour}:00 AM` : peaks.peakHour === 12 ? '12:00 PM' : `${peaks.peakHour - 12}:00 PM`;
    const quietHour = peaks.quietHour === 0 ? '12:00 AM' : peaks.quietHour < 12 ? `${peaks.quietHour}:00 AM` : peaks.quietHour === 12 ? '12:00 PM' : `${peaks.quietHour - 12}:00 PM`;
    
    document.getElementById('peakHour').textContent = peakHour;
    document.querySelector('.peak-card.high .sub').textContent = `${peaks.peakWait} min wait`;
    document.getElementById('quietHour').textContent = quietHour;
    document.querySelector('.peak-card.low .sub').textContent = `${peaks.quietWait} min wait`;
    document.getElementById('currentStatus').textContent = peaks.status;
    document.querySelector('.peak-card.medium .sub').textContent = `${peaks.avgWait} min average`;
    
    // Update status badge
    const statusBadge = document.querySelector('.peak-card.medium .badge');
    if (peaks.status.includes('Quiet')) statusBadge.className = 'badge badge-success';
    else if (peaks.status.includes('Moderate')) statusBadge.className = 'badge badge-warning';
    else if (peaks.status.includes('Busy')) statusBadge.className = 'badge badge-warning';
    else statusBadge.className = 'badge badge-danger';
    statusBadge.textContent = peaks.status.replace(/[🟢🟠🟡🔴]/g, '').trim();
    
    // Update recommendations
    const recList = document.getElementById('recommendationList');
    let recommendations = [];
    
    // Best time recommendation
    if (peaks.quietPeriods && peaks.quietPeriods.length > 0) {
        recommendations.push(`✅ <strong>Best time:</strong> ${peaks.quietPeriods.join(', ')} (${peaks.quietWait} min wait)`);
    } else {
        recommendations.push(`✅ <strong>Best time:</strong> ${quietHour} (${peaks.quietWait} min wait)`);
    }
    
    // Worst time recommendation
    if (peaks.peakPeriods && peaks.peakPeriods.length > 0) {
        recommendations.push(`⚠️ <strong>Avoid:</strong> ${peaks.peakPeriods.join(', ')} (${peaks.peakWait} min wait)`);
    } else {
        recommendations.push(`⚠️ <strong>Avoid:</strong> ${peakHour} (${peaks.peakWait} min wait)`);
    }
    
    // Trend recommendation
    if (peaks.avgWait > 45) {
        recommendations.push(`📊 <strong>Trend:</strong> Wait times are high today. Consider visiting during off-peak hours.`);
    } else if (peaks.avgWait > 30) {
        recommendations.push(`📊 <strong>Trend:</strong> Wait times are moderate. Good time to visit.`);
    } else {
        recommendations.push(`📊 <strong>Trend:</strong> Wait times are low. Great time to visit!`);
    }
    
    // Additional insights
    if (peaks.peakWindows.length > 4) {
        recommendations.push(`🔄 <strong>Pattern:</strong> Multiple peak periods detected throughout the day.`);
    }
    
    recList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <span class="rec-icon">${rec.split(' ')[0]}</span>
            <span class="rec-text">${rec.substring(rec.indexOf(' ') + 1)}</span>
        </div>
    `).join('');
    
    // Update chart
    if (peakChart) peakChart.destroy();
    const ctx = document.getElementById('peakChart').getContext('2d');
    const labels = Array.from({length: 24}, (_, i) => i === 0 ? '12AM' : i < 12 ? `${i}AM` : i === 12 ? '12PM' : `${i-12}PM`);
    const colors = hourlyData.map(v => {
        if (v > 70) return '#ef4444';
        if (v > 50) return '#f97316';
        if (v > 30) return '#eab308';
        return '#22c55e';
    });
    
    peakChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wait Time (min)',
                data: hourlyData,
                backgroundColor: colors.map(c => c + '66'),
                borderColor: colors,
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
                    grid: { color: getChartColors().grid },
                    ticks: { color: getChartColors().text }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: getChartColors().text,
                        maxTicksLimit: 12
                    }
                }
            }
        }
    });
}

function getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        text: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
    };
}

// ============================================
// LOAD DATA
// ============================================

function loadPeakData() {
    const hospitalSelect = document.getElementById('hospitalSelect');
    const daySelect = document.getElementById('daySelect');
    const seasonSelect = document.getElementById('seasonSelect');
    
    let baseWait = 45; // Default
    let selectedHospital = hospitalSelect.value;
    
    if (selectedHospital !== 'all') {
        const hospital = hospitals.find(h => h.name === selectedHospital);
        if (hospital) baseWait = hospital.wait;
    } else {
        // Average of all hospitals
        const avg = hospitals.reduce((sum, h) => sum + h.wait, 0) / hospitals.length;
        baseWait = Math.round(avg);
    }
    
    // Apply day filter
    const day = daySelect.value;
    if (day !== 'all') {
        const dayVariation = { 'Monday': 8, 'Tuesday': 2, 'Wednesday': 0, 'Thursday': 3, 'Friday': 5, 'Saturday': 4, 'Sunday': 7 };
        baseWait += dayVariation[day] || 0;
    }
    
    // Apply season filter
    const season = seasonSelect.value;
    if (season !== 'all') {
        const seasonVariation = { 'Winter': 15, 'Spring': -8, 'Summer': 3, 'Fall': 0 };
        baseWait += seasonVariation[season] || 0;
    }
    
    baseWait = Math.max(10, baseWait);
    
    const hourlyData = generateHourlyData(baseWait, selectedHospital);
    renderPeakDashboard(hourlyData, selectedHospital);
}

// ============================================
// POPULATE SELECTS
// ============================================

function populateSelects() {
    const select = document.getElementById('hospitalSelect');
    select.innerHTML = '<option value="all">All Hospitals</option>';
    hospitals.sort((a, b) => a.name.localeCompare(b.name));
    hospitals.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.name;
        opt.textContent = h.name;
        select.appendChild(opt);
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

document.getElementById('hospitalSelect').addEventListener('change', loadPeakData);
document.getElementById('daySelect').addEventListener('change', loadPeakData);
document.getElementById('seasonSelect').addEventListener('change', loadPeakData);

// Theme change - re-render charts
const observer = new MutationObserver(() => {
    loadPeakData();
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ============================================
// INIT
// ============================================

populateSelects();
loadPeakData();