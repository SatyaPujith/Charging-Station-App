<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-indigo-600 mb-6">Charging Stations</h2>
      <div v-if="error" class="bg-red-100 p-4 rounded-lg mb-6 text-red-700">
        {{ error }}
      </div>

      <!-- Button to Open Add Charger Modal -->
      <div class="mb-6">
        <button
          @click="openAddModal"
          class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Create a New Charging Station
        </button>
      </div>

      <!-- Add Charger Modal -->
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Add New Charger</h3>
          <form @submit.prevent="addCharger" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input
                v-model="newCharger.name"
                type="text"
                placeholder="Charger Name"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                v-model="newCharger.location.latitude"
                type="number"
                step="0.0001"
                placeholder="Latitude (e.g., 21.235)"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                v-model="newCharger.location.longitude"
                type="number"
                step="0.0001"
                placeholder="Longitude (e.g., -0.1278)"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="newCharger.status"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
              <input
                v-model.number="newCharger.powerOutput"
                type="number"
                placeholder="Power Output"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Connector Type</label>
              <select
                v-model="newCharger.connectorType"
                required
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Type 1">Type 1</option>
                <option value="Type 2">Type 2</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="CCS">CCS</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button
                type="submit"
                class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Add Charger
              </button>
              <button
                @click="closeAddModal"
                type="button"
                class="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Filter Charging Stations</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @change="applyFilters"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
            <select
              v-model="filters.powerOutput"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @change="applyFilters"
            >
              <option value="">All</option>
              <option value="0-50">0-50 kW</option>
              <option value="51-100">51-100 kW</option>
              <option value="101+">101+ kW</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Connector Type</label>
            <select
              v-model="filters.connectorType"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @change="applyFilters"
            >
              <option value="">All</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="CCS">CCS</option>
            </select>
          </div>
        </div>
      </div>

      <!-- List of Charging Stations -->
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">All Charging Stations</h3>
        <div v-if="filteredChargers.length === 0" class="text-gray-600">
          No charging stations available.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="charger in filteredChargers"
            :key="charger._id"
            class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <div v-if="editingChargerId !== charger._id">
              <h4 class="text-lg font-semibold text-indigo-600">{{ charger.name }}</h4>
              <p class="text-gray-600">Location: {{ charger.location.latitude }}, {{ charger.location.longitude }}</p>
              <p class="text-gray-600">Status: {{ charger.status }}</p>
              <p class="text-gray-600">Power Output: {{ charger.powerOutput }} kW</p>
              <p class="text-gray-600">Connector Type: {{ charger.connectorType }}</p>
              <p class="text-gray-600">Added by: {{ charger.createdBy === currentUserId ? 'You' : 'Another User' }}</p>
              <div v-if="charger.createdBy === currentUserId" class="mt-4 flex gap-2">
                <button
                  @click="editCharger(charger)"
                  class="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  @click="deleteCharger(charger._id)"
                  class="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
            <div v-else>
              <form @submit.prevent="updateCharger" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    v-model="editForm.location.latitude"
                    type="number"
                    step="0.0001"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    v-model="editForm.location.longitude"
                    type="number"
                    step="0.0001"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    v-model="editForm.status"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
                  <input
                    v-model.number="editForm.powerOutput"
                    type="number"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Connector Type</label>
                  <select
                    v-model="editForm.connectorType"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                    <option value="CCS">CCS</option>
                  </select>
                </div>
                <div class="flex gap-2">
                  <button
                    type="submit"
                    class="py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelEdit"
                    type="button"
                    class="py-1 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      chargers: [],
      filteredChargers: [],
      newCharger: {
        name: '',
        location: { latitude: null, longitude: null },
        status: 'Active',
        powerOutput: 0,
        connectorType: 'Type 1',
      },
      filters: {
        status: '',
        powerOutput: '',
        connectorType: '',
      },
      showAddModal: false,
      editingChargerId: null,
      editForm: {
        name: '',
        location: { latitude: null, longitude: null },
        status: 'Active',
        powerOutput: 0,
        connectorType: 'Type 1',
      },
      error: '',
      currentUserId: '',
    };
  },
  created() {
    this.loadCurrentUser();
    this.fetchChargers();
  },
  methods: {
    loadCurrentUser() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          this.currentUserId = decoded.userId || '';
        } catch (err) {
          console.error('Error decoding token:', err);
          this.error = 'Invalid authentication token. Please log in again.';
          this.$router.push('/login');
        }
      }
    },
    async fetchChargers() {
      try {
        const res = await axios.get('https://charging-station-app-g0lb.onrender.com/api/chargers');
        this.chargers = res.data || [];
        this.applyFilters();
      } catch (err) {
        console.error('Error fetching chargers:', err);
        this.error = 'Failed to fetch chargers';
      }
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
      this.newCharger = {
        name: '',
        location: { latitude: null, longitude: null },
        status: 'Active',
        powerOutput: 0,
        connectorType: 'Type 1',
      };
    },
    async addCharger() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'No authentication token found. Please log in.';
          this.$router.push('/login');
          return;
        }
        await axios.post('https://charging-station-app-g0lb.onrender.com/api/chargers', this.newCharger, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.closeAddModal();
        this.fetchChargers();
      } catch (err) {
        console.error('Error adding charger:', err);
        if (err.response) {
          this.error = err.response.data.message || 'Failed to add charger';
        } else {
          this.error = 'Failed to add charger. Please check your network connection.';
        }
      }
    },
    applyFilters() {
      this.filteredChargers = this.chargers.filter(charger => {
        let matches = true;

        // Filter by status
        if (this.filters.status && charger.status !== this.filters.status) {
          matches = false;
        }

        // Filter by power output
        if (this.filters.powerOutput) {
          const [min, max] = this.filters.powerOutput.split('-').map(Number);
          if (this.filters.powerOutput === '101+') {
            if (charger.powerOutput <= 100) matches = false;
          } else {
            if (charger.powerOutput < min || (max && charger.powerOutput > max)) matches = false;
          }
        }

        // Filter by connector type
        if (this.filters.connectorType && charger.connectorType !== this.filters.connectorType) {
          matches = false;
        }

        return matches;
      });
    },
    editCharger(charger) {
      this.editingChargerId = charger._id;
      this.editForm = {
        name: charger.name,
        location: { latitude: charger.location.latitude, longitude: charger.location.longitude },
        status: charger.status,
        powerOutput: charger.powerOutput,
        connectorType: charger.connectorType,
      };
    },
    async updateCharger() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'No authentication token found. Please log in.';
          this.$router.push('/login');
          return;
        }
        await axios.put(`https://charging-station-app-g0lb.onrender.com/api/chargers/${this.editingChargerId}`, this.editForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.editingChargerId = null;
        this.fetchChargers();
      } catch (err) {
        console.error('Error updating charger:', err);
        if (err.response) {
          console.log('Update error response:', err.response.data);
          if (err.response.status === 401) {
            this.error = 'Session expired or unauthorized. Please log in again.';
            this.$router.push('/login');
          } else {
            alert(`Error updating charger: ${err.response.data.message || 'Unknown error'}`);
          }
        } else {
          alert('Error updating charger: Network error');
        }
      }
    },
    cancelEdit() {
      this.editingChargerId = null;
    },
    async deleteCharger(id) {
      if (confirm('Are you sure you want to delete this charger?')) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.error = 'No authentication token found. Please log in.';
            this.$router.push('/login');
            return;
          }
          await axios.delete(`https://charging-station-app-g0lb.onrender.com/api/chargers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`Charger ${id} deleted successfully`);
          this.fetchChargers();
        } catch (err) {
          console.error('Error deleting charger:', err);
          if (err.response) {
            console.log('Delete error response:', err.response.data);
            if (err.response.status === 401) {
              this.error = 'Session expired or unauthorized. Please log in again.';
              this.$router.push('/login');
            } else {
              alert(`Error deleting charger: ${err.response.data.message || 'Unknown error'}`);
            }
          } else {
            alert('Error deleting charger: Network error');
          }
        }
      }
    },
  },
};
</script>
