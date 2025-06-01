<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="bg-indigo-600 p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white text-xl font-bold">Charging Station App</div>
        <div class="flex space-x-4">
          <router-link to="/chargers" class="text-white hover:text-indigo-200 transition duration-300">
            Chargers
          </router-link>
          <router-link to="/map" class="text-white hover:text-indigo-200 transition duration-300">
            Map
          </router-link>
          <router-link to="/profile" class="text-white hover:text-indigo-200 transition duration-300">
            Profile
          </router-link>
          
        </div>
      </div>
    </nav>
    <!-- Main Content -->
    <div class="pt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>