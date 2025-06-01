<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-indigo-600 mb-6">Charging Stations Map</h2>
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <l-map :zoom="zoom" :center="center" class="h-[500px]">
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker
          v-for="charger in chargers"
          :key="charger._id"
          :lat-lng="[charger.location.latitude, charger.location.longitude]"
        >
          <l-popup>
            <div>
              <h3 class="text-lg font-semibold text-indigo-600">{{ charger.name }}</h3>
              <p class="text-gray-600">Status: {{ charger.status }}</p>
              <p class="text-gray-600">Power: {{ charger.powerOutput }} kW</p>
              <p class="text-gray-600">Connector: {{ charger.connectorType }}</p>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';

export default {
  components: { LMap, LTileLayer, LMarker, LPopup },
  data() {
    return {
      zoom: 10,
      center: [51.505, -0.09],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };
  },
  computed: {
    chargers() {
      return this.$store.state.chargers;
    },
  },
  created() {
    this.$store.dispatch('fetchChargers');
  },
};
</script>