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
    { name: "Toronto General", wait: 45, rating: 4.2, province: "Ontario" },
    { name: "St. Michael's", wait: 62, rating: 4.0, province: "Ontario" },
    { name: "Sunnybrook", wait: 38, rating: 4.5, province: "Ontario" },
    { name: "North York General", wait: 55, rating: 3.9, province: "Ontario" },
    { name: "Scarborough General", wait: 48, rating: 3.8, province: "Ontario" },
    { name: "Vancouver General", wait: 35, rating: 4.3, province: "British Columbia" },
    { name: "St. Paul's Hospital", wait: 52, rating: 4.1, province: "British Columbia" },
    { name: "Royal Columbian", wait: 28, rating: 3.7, province: "British Columbia" },
    { name: "Montreal General", wait: 42, rating: 4.0, province: "Quebec" },
    { name: "Jewish General", wait: 58, rating: 3.9, province: "Quebec" },
    { name: "Quebec City CHU", wait: 33, rating: 4.2, province: "Quebec" },
    { name: "Calgary Foothills", wait: 47, rating: 4.3, province: "Alberta" },
    { name: "Edmonton Royal Alex", wait: 54, rating: 3.8, province: "Alberta" },
    { name: "South Calgary Health", wait: 29, rating: 4.0, province: "Alberta" },
    { name: "Ottawa General", wait: 41, rating: 4.1, province: "Ontario" },
    { name: "Hamilton General", wait: 49, rating: 3.9, province: "Ontario" },
    { name: "London Health", wait: 36, rating: 4.4, province: "Ontario" },
    { name: "Winnipeg Health", wait: 44, rating: 3.7, province: "Manitoba" },
    { name: "Halifax Infirmary", wait: 39, rating: 4.0, province: "Nova Scotia" },
    { name: "Saskatoon Royal", wait: 46, rating: 3.6, province: "Saskatchewan" },
    { name: "Kelowna General", wait: 31, rating: 3.9, province: "British Columbia" },
    { name: "Moncton Hospital", wait: 43, rating: 3.8, province: "New Brunswick" },
    { name: "St. John's Health", wait: 51, rating: 3.5, province: "Newfoundland" },
    { name: "Victoria General", wait: 34, rating: 4.1, province: "British Columbia" },
    { name: "Regina General", wait: 56, rating: 3.4, province: "Saskatchewan" }
];

// ============================================
// POPULATE HOSPITAL SELECT
// ============================================

function populateSelect() {
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
populateSelect();

// ============================================
// GENERATE REPORT CONTENT
// ============================================

function generateReportContent(reportType, hospitalName) {
    const selectedHospitals = hospitalName === 'all' 
        ? hospitals 
        : hospitals.filter(h => h.name === hospitalName);
    
    const avgWait = Math.round(selectedHospitals.reduce((s, h) => s + h.wait, 0) / selectedHospitals.length);
    const avgRating = (selectedHospitals.reduce((s, h) => s + h.rating, 0) / selectedHospitals.length).toFixed(1);
    const bestHospital = selectedHospitals.sort((a, b) => a.wait - b.wait)[0];
    const worstHospital = selectedHospitals.sort((a, b) => b.wait - a.wait)[0];
    
    // Generate report based on type
    let report = '';
    const now = new Date().toLocaleString();
    
    report += `========================================\n`;
    report += `🏥 ER Wait Time Report\n`;
    report += `========================================\n`;
    report += `Generated: ${now}\n`;
    report += `Report Type: ${reportType.toUpperCase()}\n`;
    if (hospitalName !== 'all') report += `Hospital: ${hospitalName}\n`;
    report += `\n`;
    
    // Summary Section
    report += `📊 SUMMARY\n`;
    report += `----------------------------------------\n`;
    report += `📌 Hospitals Analyzed: ${selectedHospitals.length}\n`;
    report += `⏱️ Average Wait Time: ${avgWait} minutes\n`;
    report += `⭐ Average Rating: ${avgRating}/5\n`;
    report += `\n`;
    
    // Best and Worst
    report += `🏆 BEST PERFORMING HOSPITAL\n`;
    report += `   ${bestHospital.name} - ${bestHospital.wait} min (${bestHospital.rating}⭐)\n`;
    report += `   📍 ${bestHospital.province}\n`;
    report += `\n`;
    report += `⚠️ WORST PERFORMING HOSPITAL\n`;
    report += `   ${worstHospital.name} - ${worstHospital.wait} min (${worstHospital.rating}⭐)\n`;
    report += `   📍 ${worstHospital.province}\n`;
    report += `\n`;
    
    // Daily/Weekly section
    if (reportType === 'daily' || reportType === 'weekly') {
        report += `📈 ${reportType === 'daily' ? 'DAILY' : 'WEEKLY'} TREND\n`;
        report += `----------------------------------------\n`;
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach((day, i) => {
            const dayWait = Math.round(avgWait + (Math.random() * 20 - 10));
            const bar = '█'.repeat(Math.floor(dayWait / 3));
            report += `   ${day}: ${dayWait}min ${bar}\n`;
        });
        report += `\n`;
    }
    
    // Peak Hours section
    if (reportType === 'peak' || reportType === 'daily') {
        report += `⏰ PEAK HOURS ANALYSIS\n`;
        report += `----------------------------------------\n`;
        const peakHours = [
            { time: '6:00 AM - 8:00 AM', wait: Math.round(avgWait * 0.8) },
            { time: '8:00 AM - 12:00 PM', wait: Math.round(avgWait * 1.1) },
            { time: '12:00 PM - 2:00 PM', wait: Math.round(avgWait * 1.0) },
            { time: '2:00 PM - 6:00 PM', wait: Math.round(avgWait * 1.2) },
            { time: '6:00 PM - 10:00 PM', wait: Math.round(avgWait * 1.5) },
            { time: '10:00 PM - 6:00 AM', wait: Math.round(avgWait * 0.6) }
        ];
        peakHours.forEach(ph => {
            const bar = '█'.repeat(Math.floor(ph.wait / 3));
            const emoji = ph.wait > avgWait * 1.3 ? '🔴' : ph.wait > avgWait ? '🟡' : '🟢';
            report += `   ${emoji} ${ph.time}: ${ph.wait}min ${bar}\n`;
        });
        report += `\n`;
        report += `💡 RECOMMENDATION: Best time to visit is 10:00 PM - 6:00 AM (${peakHours[5].wait}min)\n`;
        report += `\n`;
    }
    
    // Recommendations
    report += `💡 RECOMMENDATIONS\n`;
    report += `----------------------------------------\n`;
    report += `✅ Best time: Early morning (2:00 AM - 5:00 AM)\n`;
    report += `⚠️ Avoid: Evening rush (6:00 PM - 9:00 PM)\n`;
    report += `📊 ${avgWait < 40 ? 'Good' : avgWait < 60 ? 'Moderate' : 'Poor'} overall wait times today\n`;
    report += `\n`;
    
    // All Hospitals List
    if (hospitalName === 'all') {
        report += `📋 ALL HOSPITALS\n`;
        report += `----------------------------------------\n`;
        const sorted = [...hospitals].sort((a, b) => a.wait - b.wait);
        sorted.forEach((h, i) => {
            const emoji = h.wait < 30 ? '🟢' : h.wait < 60 ? '🟡' : '🔴';
            report += `   ${i+1}. ${emoji} ${h.name}: ${h.wait}min (${h.rating}⭐)\n`;
        });
        report += `\n`;
    }
    
    report += `========================================\n`;
    report += `🇨🇦 Made for Canada • ER Wait Time Predictor\n`;
    report += `========================================\n`;
    
    return report;
}

// ============================================
// GENERATE & SEND REPORT
// ============================================

document.getElementById('generateReportBtn').addEventListener('click', function() {
    const reportType = document.getElementById('reportType').value;
    const hospitalName = document.getElementById('hospitalSelect').value;
    const email = document.getElementById('emailRecipient').value;
    
    if (!email) {
        alert('Please enter an email address.');
        return;
    }
    
    const loading = document.getElementById('loadingState');
    const preview = document.getElementById('reportPreview');
    const previewContent = document.getElementById('previewContent');
    
    loading.classList.add('show');
    preview.classList.remove('show');
    this.disabled = true;
    
    setTimeout(() => {
        const report = generateReportContent(reportType, hospitalName);
        
        loading.classList.remove('show');
        this.disabled = false;
        
        // Show preview
        previewContent.textContent = report;
        preview.classList.add('show');
        
        // Simulate sending
        alert(`📧 Report sent to ${email}\n\nReport type: ${reportType}\nHospital: ${hospitalName || 'All Hospitals'}`);
        
        // Add to scheduled (simulated)
        addScheduledReport(reportType, email);
    }, 1500);
});

// ============================================
// PREVIEW REPORT
// ============================================

document.getElementById('previewReportBtn').addEventListener('click', function() {
    const reportType = document.getElementById('reportType').value;
    const hospitalName = document.getElementById('hospitalSelect').value;
    const preview = document.getElementById('reportPreview');
    const previewContent = document.getElementById('previewContent');
    
    const report = generateReportContent(reportType, hospitalName);
    previewContent.textContent = report;
    preview.classList.add('show');
    
    // Scroll to preview
    preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================
// SCHEDULE REPORT
// ============================================

document.getElementById('scheduleReportBtn').addEventListener('click', function() {
    const reportType = document.getElementById('reportType').value;
    const email = document.getElementById('emailRecipient').value;
    const frequency = document.getElementById('scheduleFrequency').value;
    
    if (!email) {
        alert('Please enter an email address.');
        return;
    }
    
    const typeNames = {
        'daily': 'Daily Summary',
        'weekly': 'Weekly Trend',
        'peak': 'Peak Hours Analysis',
        'custom': 'Custom Report'
    };
    
    const freqNames = {
        'now': 'now',
        'daily': 'daily at 9:00 AM',
        'weekly': 'weekly on Monday at 9:00 AM',
        'monthly': 'monthly on the 1st at 9:00 AM'
    };
    
    if (frequency === 'now') {
        alert('Please select a schedule frequency (daily/weekly/monthly).');
        return;
    }
    
    addScheduledReport(typeNames[reportType], email, freqNames[frequency]);
    alert(`📅 Report scheduled!\n\nType: ${typeNames[reportType]}\nFrequency: ${freqNames[frequency]}\nRecipient: ${email}`);
});

// ============================================
// SCHEDULED REPORTS MANAGEMENT
// ============================================

function addScheduledReport(name, email, frequency) {
    const list = document.getElementById('scheduledList');
    const item = document.createElement('div');
    item.className = 'schedule-item';
    item.innerHTML = `
        <div class="schedule-info">
            <strong>${name}</strong><br>
            <span style="font-size:12px;color:var(--text-muted);">${frequency || 'Sent now'} • ${email}</span>
        </div>
        <div class="schedule-actions">
            <span class="badge-scheduled">Active</span>
            <button class="delete" onclick="this.closest('.schedule-item').remove()">✕</button>
        </div>
    `;
    list.appendChild(item);
}

// Add initial scheduled items
document.addEventListener('DOMContentLoaded', function() {
    // Demo scheduled items already in HTML
});