function showMap(locationName) {
        var map = L.map("map").setView([20.5937, 78.9629], 5); // Default: India
    
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        var geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`;
    
        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    map.setView([lat, lon], 12);
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${locationName}</b>`)
                        .openPopup();
                }
            });
    }
    