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
// COMPARISON ENGINE
// ============================================

let selectedHospitals = [];

function getColor(waitTime) {
    if (waitTime < 30) return 'green';
    if (waitTime < 60) return 'yellow';
    if (waitTime < 90) return 'orange';
    return 'red';
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '⭐';
    if (half) stars += '⭐';
    return stars || '☆';
}

function getWaitEmoji(waitTime) {
    if (waitTime < 30) return '🟢';
    if (waitTime < 60) return '🟡';
    if (waitTime < 90) return '🟠';
    return '🔴';
}

function getRankLabel(index) {
    if (index === 0) return { label: '🥇 Best', class: 'gold' };
    if (index === 1) return { label: '🥈 2nd', class: 'silver' };
    if (index === 2) return { label: '🥉 3rd', class: 'bronze' };
    return { label: `#${index + 1}`, class: '' };
}

function updateComparison() {
    const container = document.getElementById('comparisonContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (selectedHospitals.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';
    
    // Sort selected hospitals by wait time (for ranking)
    const sorted = [...selectedHospitals].sort((a, b) => a.wait - b.wait);
    
    // Get sort preference
    const sortBy = document.getElementById('sortBy').value;
    let displayOrder = [...selectedHospitals];
    if (sortBy === 'wait') displayOrder.sort((a, b) => a.wait - b.wait);
    else if (sortBy === 'rating') displayOrder.sort((a, b) => b.rating - a.rating);
    else displayOrder.sort((a, b) => a.name.localeCompare(b.name));
    
    let html = '';
    displayOrder.forEach((hospital, index) => {
        const isBest = hospital.name === sorted[0].name;
        const rank = getRankLabel(index);
        const color = getColor(hospital.wait);
        const stars = renderStars(hospital.rating);
        
        html += `
            <div class="compare-card show">
                ${isBest ? '<div class="best-badge">🏆 Best Choice</div>' : ''}
                <div class="rank ${rank.class}">${rank.label}</div>
                
                <div class="hospital-name">${hospital.name}</div>
                <div class="hospital-address">📍 ${hospital.address}</div>
                
                <div class="metric">
                    <span class="metric-label">⏱️ Wait Time</span>
                    <span class="metric-value ${color}">${hospital.wait} min ${getWaitEmoji(hospital.wait)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">⭐ Rating</span>
                    <span class="metric-value">${stars} (${hospital.rating})</span>
                </div>
                <div class="metric">
                    <span class="metric-label">🏙️ Province</span>
                    <span class="metric-value">${hospital.province}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">🛏️ Beds</span>
                    <span class="metric-value">${hospital.beds}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">👨‍⚕️ Doctors</span>
                    <span class="metric-value">${hospital.doctors}</span>
                </div>
                
                <div class="actions">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}" target="_blank" class="btn-directions">🧭 Directions</a>
                    <a href="/?hospital=${encodeURIComponent(hospital.name)}" class="btn-predict-small">🔮 Predict</a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// RENDER HOSPITAL CHECKBOXES
// ============================================

function renderHospitals() {
    const grid = document.getElementById('hospitalGrid');
    
    // Populate province filter
    const filterSelect = document.getElementById('filterProvince');
    const provinces = [...new Set(hospitals.map(h => h.province))].sort();
    provinces.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        filterSelect.appendChild(opt);
    });
    
    function filterHospitals() {
        const search = document.getElementById('searchHospital').value.toLowerCase();
        const province = document.getElementById('filterProvince').value;
        
        return hospitals.filter(h => {
            const matchName = h.name.toLowerCase().includes(search);
            const matchProvince = province === 'all' || h.province === province;
            return matchName && matchProvince;
        });
    }
    
    function render() {
        const filtered = filterHospitals();
        const grid = document.getElementById('hospitalGrid');
        grid.innerHTML = '';
        
        filtered.forEach(h => {
            const isSelected = selectedHospitals.some(s => s.name === h.name);
            const isDisabled = !isSelected && selectedHospitals.length >= 4;
            
            const div = document.createElement('div');
            div.className = 'hospital-check';
            div.innerHTML = `
                <input type="checkbox" 
                       id="h_${h.name.replace(/\s/g, '_')}"
                       ${isSelected ? 'checked' : ''}
                       ${isDisabled ? 'disabled' : ''}>
                <label for="h_${h.name.replace(/\s/g, '_')}">
                    ${h.name}
                    ${isSelected ? '<span class="selected-badge">✓ Selected</span>' : ''}
                    <span style="font-size:12px;color:var(--text-muted);margin-left:4px;">(${h.wait}min)</span>
                </label>
            `;
            
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function(e) {
                if (this.checked) {
                    if (selectedHospitals.length < 4) {
                        selectedHospitals.push(h);
                        render();
                        updateComparison();
                    } else {
                        this.checked = false;
                        alert('You can only compare up to 4 hospitals at a time.');
                    }
                } else {
                    selectedHospitals = selectedHospitals.filter(s => s.name !== h.name);
                    render();
                    updateComparison();
                }
            });
            
            grid.appendChild(div);
        });
        
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);grid-column:1/-1;">No hospitals found matching your search.</div>';
        }
    }
    
    // Event listeners
    document.getElementById('sortBy').addEventListener('change', updateComparison);
    document.getElementById('filterProvince').addEventListener('change', render);
    document.getElementById('searchHospital').addEventListener('input', render);
    
    render();
}

// ============================================
// INIT
// ============================================

renderHospitals();
updateComparison();