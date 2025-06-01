import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import ChargerList from '../components/ChargerList.vue';
import Profile from '../components/Profile.vue';
import Map from '../components/Map.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/chargers', 
    component: ChargerList,
    meta: { requiresAuth: true },
  },
  { 
    path: '/profile', 
    component: Profile,
    meta: { requiresAuth: true },
  },
  { 
    path: '/map', 
    component: Map,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;