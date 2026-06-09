import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || '');
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'));

  const isAuthenticated = computed(() => !!token.value);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    token.value = res.data.token;
    user.value = res.data.user;
    localStorage.setItem('auth_token', token.value);
    localStorage.setItem('auth_user', JSON.stringify(user.value));
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return { token, user, isAuthenticated, login, logout };
});

