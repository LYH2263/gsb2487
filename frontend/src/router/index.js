import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/post/:slug',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Simple auth guard for admin route
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.path.startsWith('/admin') && !auth.isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }
  next();
});

export default router
