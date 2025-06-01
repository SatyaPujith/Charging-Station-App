<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-indigo-600 mb-6 text-center">Login</h2>
      <div v-if="error" class="bg-red-100 p-4 rounded-lg mb-6 text-red-700">
        {{ error }}
      </div>
      <form @submit.prevent="login" class="space-y-4">
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
          Login
        </button>
      </form>
      <p class="mt-4 text-center text-gray-600">
        Don't have an account? <router-link to="/register" class="text-indigo-600 hover:underline">Register</router-link>
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
    async login() {
      this.error = '';
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password,
        });
        if (res && res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          this.$router.push('/chargers');
        } else {
          this.error = 'Login failed: No token received';
        }
      } catch (err) {
        console.error('Login error:', err);
        if (err.response) {
          this.error = err.response.data.message || 'Login failed';
        } else if (err.request) {
          this.error = 'Unable to connect to the server. Please ensure the backend is running.';
        } else {
          this.error = 'An unexpected error occurred during login';
        }
      }
    },
  },
};
</script>