import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex, axios);

export default new Vuex.Store({
  modules: {
    // Soon(tm)
  },
  state: {
    isLoggedIn: false,
    roles: [],
    server: 0,
    identifier: null,
    name: null,
    department: {
      id: 0,
      name: null,
      role: null
    },
    character: {},
    signon: undefined,
    updateReady: false,
  },
  mutations: {
    loggedIn: (state, payload) => {
      state.isLoggedIn = payload;
    },
    roles: (state, payload) => {
      state.roles = payload;
    },
    server: (state, payload) => {
      state.server = payload;
    },
    department: (state, payload) => {
      state.department = { ...state.department, ...payload };
    },
    character: (state, payload) => {
      state.character = { ...state.character, ...payload };
    },
    me: (state, payload) => {
      state.identifier = payload.identifier || state.identifier;
      state.name = payload.name || state.name;
    },
    signon: (state, payload) => {
      state.signon = { ...state.signon, ...payload }
    },
    update: (state, payload) => {
      state.updateReady = payload;
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    roles: state => state.roles,
    server: state => state.server,
    department: state => state.department,
    character: state => state.character,
    me: state => ({ identifier: state.identifier, name: state.name }),
    signon: state => state.signon,
    updateReady: state => state.updateReady
  },
});
