<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-indigo-600 mb-6">Charging Station Map</h2>
      <div v-if="error" class="bg-red-100 p-4 rounded-lg mb-6 text-red-700">
        {{ error }}
      </div>
      <div v-else>
        <div id="map" class="h-[600px] w-full rounded-lg shadow-lg"></div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import axios from 'axios';

export default {
  name: 'Map',
  data() {
    return {
      chargers: [],
      error: '',
      map: null,
    };
  },
  mounted() {
    this.fetchChargers();
    this.initMap();
  },
  methods: {
    async fetchChargers() {
      try {
        const res = await axios.get('https://charging-station-app-g0lb.onrender.com/api/chargers');
        this.chargers = res.data || [];
        this.addMarkers();
      } catch (err) {
        console.error('Error fetching chargers:', err);
        this.error = 'Failed to fetch chargers';
      }
    },
    initMap() {
      // Initialize the map centered on a default location (e.g., London)
      this.map = L.map('map').setView([51.505, -0.09], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    },
    addMarkers() {
      if (!this.map || !this.chargers.length) return;

      this.chargers.forEach(charger => {
        const lat = charger.location.latitude;
        const lon = charger.location.longitude;

        // Validate latitude and longitude
        if (typeof lat !== 'number' || typeof lon !== 'number' || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          console.warn(`Invalid coordinates for charger ${charger.name}: (${lat}, ${lon})`);
          return;
        }

        // Add marker to the map
        const marker = L.marker([lat, lon]).addTo(this.map);

        // Add popup with charger details
        marker.bindPopup(`
          <b>${charger.name}</b><br>
          Status: ${charger.status}<br>
          Power Output: ${charger.powerOutput} kW<br>
          Connector Type: ${charger.connectorType}
        `);

        // Adjust the map bounds to fit all markers
        const bounds = this.chargers
          .filter(ch => typeof ch.location.latitude === 'number' && typeof ch.location.longitude === 'number')
          .map(ch => [ch.location.latitude, ch.location.longitude]);
        if (bounds.length > 0) {
          this.map.fitBounds(bounds, { padding: [50, 50] });
        }
      });
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>

<style scoped>
/* Ensure the map container has a defined height */
#map {
  height: 600px;
}
</style>
