<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-indigo-600 mb-6 text-center">Register</h2>
      <div v-if="error" class="bg-red-100 p-4 rounded-lg mb-6 text-red-700">
        {{ error }}
      </div>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-center text-gray-600">
        Already have an account? <router-link to="/login" class="text-indigo-600 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async register() {
      this.error = '';
      try {
        const res = await axios.post('https://charging-station-app-g0lb.onrender.com/api/auth/register', {
          email: this.email,
          password: this.password,
        });
        if (res && res.data) {
          alert('Registration successful! Please login.');
          this.$router.push('/login');
        } else {
          this.error = 'Registration failed: No response data received';
        }
      } catch (err) {
        console.error('Registration error:', err);
        if (err.response) {
          this.error = err.response.data.message || 'Registration failed';
        } else if (err.request) {
          this.error = 'Unable to connect to the server. Please ensure the backend is running.';
        } else {
          this.error = 'An unexpected error occurred during registration';
        }
      }
    },
  },
};
</script>
