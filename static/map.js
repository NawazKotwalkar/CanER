// ============================================
// MAP CONFIGURATION
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // HOSPITAL DATA
    // ============================================
    
    // (Data will be loaded from CSV in production)
    // For now, we use hardcoded data
    const hospitals = [
        { name: "Toronto General", lat: 43.6596, lng: -79.3852, wait: 45, address: "200 Elizabeth St, Toronto", rating: 4.2 },
        { name: "St. Michael's", lat: 43.6541, lng: -79.3796, wait: 62, address: "30 Bond St, Toronto", rating: 4.0 },
        { name: "Sunnybrook", lat: 43.7304, lng: -79.3791, wait: 38, address: "2075 Bayview Ave, Toronto", rating: 4.5 },
        { name: "North York General", lat: 43.7674, lng: -79.4110, wait: 55, address: "4001 Leslie St, Toronto", rating: 3.9 },
        { name: "Scarborough General", lat: 43.7742, lng: -79.2397, wait: 48, address: "3050 Lawrence Ave E, Toronto", rating: 3.8 },
        { name: "Vancouver General", lat: 49.2637, lng: -123.1153, wait: 35, address: "855 W 12th Ave, Vancouver", rating: 4.3 },
        { name: "St. Paul's Hospital", lat: 49.2813, lng: -123.1284, wait: 52, address: "1081 Burrard St, Vancouver", rating: 4.1 },
        { name: "Royal Columbian", lat: 49.2232, lng: -122.8893, wait: 28, address: "330 E Columbia St, New Westminster", rating: 3.7 },
        { name: "Montreal General", lat: 45.4972, lng: -73.5889, wait: 42, address: "1650 Cedar Ave, Montreal", rating: 4.0 },
        { name: "Jewish General", lat: 45.4827, lng: -73.6343, wait: 58, address: "3755 Côte-Sainte-Catherine Rd, Montreal", rating: 3.9 },
        { name: "Quebec City CHU", lat: 46.8287, lng: -71.2649, wait: 33, address: "10 Rue de l'Espinay, Quebec City", rating: 4.2 },
        { name: "Calgary Foothills", lat: 51.0706, lng: -114.1300, wait: 47, address: "1403 29 St NW, Calgary", rating: 4.3 },
        { name: "Edmonton Royal Alex", lat: 53.5647, lng: -113.4867, wait: 54, address: "10240 Kingsway NW, Edmonton", rating: 3.8 },
        { name: "South Calgary Health", lat: 50.9321, lng: -114.0847, wait: 29, address: "4448 Front St SE, Calgary", rating: 4.0 },
        { name: "Ottawa General", lat: 45.4049, lng: -75.6486, wait: 41, address: "501 Smyth Rd, Ottawa", rating: 4.1 },
        { name: "Hamilton General", lat: 43.2598, lng: -79.8717, wait: 49, address: "237 Barton St E, Hamilton", rating: 3.9 },
        { name: "London Health", lat: 42.9876, lng: -81.2382, wait: 36, address: "800 Commissioners Rd E, London", rating: 4.4 },
        { name: "Winnipeg Health", lat: 49.9068, lng: -97.1370, wait: 44, address: "700 William Ave, Winnipeg", rating: 3.7 },
        { name: "Halifax Infirmary", lat: 44.6540, lng: -63.5880, wait: 39, address: "1796 Summer St, Halifax", rating: 4.0 },
        { name: "Saskatoon Royal", lat: 52.1200, lng: -106.6590, wait: 46, address: "103 Hospital Dr, Saskatoon", rating: 3.6 },
        { name: "Kelowna General", lat: 49.8834, lng: -119.4900, wait: 31, address: "2268 Pandosy St, Kelowna", rating: 3.9 },
        { name: "Moncton Hospital", lat: 46.0932, lng: -64.7735, wait: 43, address: "135 MacBeath Ave, Moncton", rating: 3.8 },
        { name: "St. John's Health", lat: 47.5780, lng: -52.7070, wait: 51, address: "300 Prince Philip Dr, St. John's", rating: 3.5 },
        { name: "Victoria General", lat: 48.4350, lng: -123.3270, wait: 34, address: "1 Hospital Way, Victoria", rating: 4.1 },
        { name: "Regina General", lat: 50.4490, lng: -104.6470, wait: 56, address: "1440 14th Ave, Regina", rating: 3.4 }
    ];
    
    // ============================================
    // CREATE MAP
    // ============================================
    
    // Center on Canada
    const map = L.map('map').setView([52.0, -100.0], 4);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // ============================================
    // CUSTOM MARKERS
    // ============================================
    
    function getColor(waitTime) {
        if (waitTime < 30) return '#22c55e';
        if (waitTime < 60) return '#eab308';
        if (waitTime < 90) return '#f97316';
        return '#ef4444';
    }
    
    function getStatus(waitTime) {
        if (waitTime < 30) return 'Fast 🟢';
        if (waitTime < 60) return 'Moderate 🟡';
        if (waitTime < 90) return 'Busy 🟠';
        return 'Very Busy 🔴';
    }
    
    // Create custom icon
    function createMarkerIcon(waitTime) {
        const color = getColor(waitTime);
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 11px; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">${waitTime}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -40]
        });
    }
    
    // ============================================
    // ADD MARKERS
    // ============================================
    
    hospitals.forEach(hospital => {
        const icon = createMarkerIcon(hospital.wait);
        
        const marker = L.marker([hospital.lat, hospital.lng], {
            icon: icon
        }).addTo(map);
        
        // Popup content
        const color = getColor(hospital.wait);
        const status = getStatus(hospital.wait);
        
        const popupContent = `
            <div class="hospital-popup">
                <h3>🏥 ${hospital.name}</h3>
                <p>📍 ${hospital.address}</p>
                <p>⭐ ${hospital.rating}/5</p>
                <div class="wait-time ${hospital.wait < 30 ? 'green' : hospital.wait < 60 ? 'yellow' : hospital.wait < 90 ? 'orange' : 'red'}">
                    ⏱️ ${hospital.wait} minutes
                </div>
                <p><strong>Status:</strong> ${status}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}" target="_blank" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">Get Directions →</a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });
    
    // ============================================
    // ADD LAYER CONTROL
    // ============================================
    
    // Fit map to show all markers
    const group = L.featureGroup();
    hospitals.forEach(h => {
        group.addLayer(L.marker([h.lat, h.lng]));
    });
    map.fitBounds(group.getBounds().pad(0.1));
    
    // ============================================
    // REFRESH DATA (every 30 seconds)
    // ============================================
    
    // In production, you'd fetch updated data here
    // For demo, we just update every 30 seconds with slight changes
    // setInterval(() => { ... }, 30000);
    
    console.log('🗺️ Map loaded with', hospitals.length, 'hospitals');
});