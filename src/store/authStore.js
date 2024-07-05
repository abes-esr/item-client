import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    user: null,
    token: null
  }),
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => state.authenticated,
    getToken: (state) => state.token
  },
  actions: {
    login(user, token) {
      this.authenticated = true;
      this.user = user;
      this.token = token;
    },
    logout() {
      this.authenticated = false;
      this.user = null;
      this.token = null;
    },
    setToken(token) {
      this.token = token;
    }
  },
  persist: true // This will persist the store to localStorage
});
