<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-indigo-600 mb-6">My Profile</h2>
      <div v-if="error" class="bg-red-100 p-4 rounded-lg mb-6 text-red-700">
        {{ error }}
      </div>
      <div v-else class="bg-white p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold text-gray-800">User Information</h3>
        <p class="mt-2 text-gray-600">Email: {{ userEmail }}</p>
        <button
          @click="logout"
          class="mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">My Charging Stations</h3>
        <div v-if="myChargers.length === 0" class="text-gray-600">
          You haven't added any charging stations yet.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="charger in myChargers"
            :key="charger._id"
            class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <div v-if="editingChargerId !== charger._id">
              <h4 class="text-lg font-semibold text-indigo-600">{{ charger.name }}</h4>
              <p class="text-gray-600">Location: {{ charger.location.latitude }}, {{ charger.location.longitude }}</p>
              <p class="text-gray-600">Status: {{ charger.status }}</p>
              <p class="text-gray-600">Power Output: {{ charger.powerOutput }} kW</p>
              <p class="text-gray-600">Connector Type: {{ charger.connectorType }}</p>
              <div class="mt-4 flex gap-2">
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
                    v-model.number="editForm.location.latitude"
                    type="number"
                    step="any"
                    required
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    v-model.number="editForm.location.longitude"
                    type="number"
                    step="any"
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
      <div class="mt-4">
        <router-link to="/chargers" class="text-indigo-600 hover:underline">Back to Charger List</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Changed to named import

export default {
  data() {
    return {
      userEmail: '',
      myChargers: [],
      error: '',
      userId: '',
      editingChargerId: null,
      editForm: {
        name: '',
        location: { latitude: 0, longitude: 0 },
        status: 'Active',
        powerOutput: 0,
        connectorType: 'Type 1',
      },
    };
  },
  created() {
    this.loadProfile();
    this.fetchMyChargers();
  },
  methods: {
    loadProfile() {
      this.error = '';
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'No authentication token found. Please log in.';
        this.logout();
        return;
      }
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        this.userEmail = decoded.email || 'Not available';
        this.userId = decoded.userId || 'Not available';
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          this.error = 'Your session has expired. Please log in again.';
          this.logout();
          return;
        }
        if (this.userEmail === 'Not available') {
          console.warn('Email not found in JWT token. Please ensure the token includes the email field.');
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        this.error = 'Invalid authentication token. Please log in again.';
        this.logout();
      }
    },
    async fetchMyChargers() {
      this.error = '';
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'No authentication token found. Please log in.';
        this.logout();
        return;
      }
      try {
        const res = await axios.get('http://localhost:3000/api/chargers/my-chargers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('My Chargers Response:', res.data);
        this.myChargers = res.data || [];
      } catch (err) {
        console.error('Error fetching chargers:', err);
        if (err.response) {
          console.log('Error response:', err.response.data);
          if (err.response.status === 401) {
            this.error = 'Session expired or unauthorized. Please log in again.';
            this.logout();
          } else {
            this.error = `Failed to fetch chargers: ${err.response.data.message || 'Unknown error'}`;
          }
        } else {
          this.error = 'Failed to fetch chargers. Please check your network connection.';
        }
      }
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
          this.logout();
          return;
        }
        await axios.put(`http://localhost:3000/api/chargers/${this.editingChargerId}`, this.editForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.editingChargerId = null;
        this.fetchMyChargers();
      } catch (err) {
        console.error('Error updating charger:', err);
        if (err.response) {
          console.log('Update error response:', err.response.data);
          if (err.response.status === 401) {
            this.error = 'Session expired or unauthorized. Please log in again.';
            this.logout();
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
            this.logout();
            return;
          }
          await axios.delete(`http://localhost:3000/api/chargers/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`Charger ${id} deleted successfully`);
          this.fetchMyChargers();
        } catch (err) {
          console.error('Error deleting charger:', err);
          if (err.response) {
            console.log('Delete error response:', err.response.data);
            if (err.response.status === 401) {
              this.error = 'Session expired or unauthorized. Please log in again.';
              this.logout();
            } else {
              alert(`Error deleting charger: ${err.response.data.message || 'Unknown error'}`);
            }
          } else {
            alert('Error deleting charger: Network error');
          }
        }
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>