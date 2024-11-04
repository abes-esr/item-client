import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')),
    token: sessionStorage.getItem('token'),
    authenticated: !!sessionStorage.getItem('token'),
  }),

  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => state.authenticated,
    getToken: (state) => state.token,
  },
  actions: {
    login(user, token) {
      this.authenticated = true;
      this.user = user;
      this.token = token;
      sessionStorage.setItem('user', JSON.stringify(this.user));
      sessionStorage.setItem('token', this.token);
    },
    logout() {
      this.authenticated = false;
      this.user = null;
      this.token = null;
      sessionStorage.setItem('user', JSON.stringify(this.user))
      sessionStorage.setItem('token', this.token);
    },
    setUser(user){
      this.user = user;
    },
    isAdmin() {
      console.log(JSON.stringify(this.user))
      return this.user.role === 'ADMIN';
    }
  },
});
