import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

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
    call: "",
    leo: {
      character: {},
      vehicle: {}
    },
    forms: {
      personcheck: {
        idnumber: null,
        firstname: null,
        lastname: null,
        dob: null
      },
      vehiclecheck: {
        licenseplate: null,
        make: null,
        model: null,
        color: null
      }
    },
    calls: [],
    units: [],
    bolos: [],
    assignedCall: null
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
      state.signon = { ...state.signon, ...payload };
    },
    update: (state, payload) => {
      state.updateReady = payload;
    },
    leocharacter: (state, payload) => {
      state.leo.character = payload;
    },
    leovehicle: (state, payload) => {
      state.leo.vehicle = payload;
    },
    forms: (state, payload) => {
      state.forms = { ...state.forms, ...payload };
    },
    calls: (state, payload) => {
      state.calls[payload.id] = payload.call;
    },
    unit: (state, payload) => {
      let changed = false;
      state.units.forEach((v, i) => {
        console.dir(v);
        console.dir(i);
        if (v.id === payload.id) {
          console.log(`Expanding payload onto ${i}`);
          state.units[i] = { ...state.units[i], ...payload };
          changed = true;
        }
      });
      if (!changed) {
        console.log("No change, pushing payload");
        state.units.push(payload);
      }
    },
    removeunit: (state, payload) => {
      state.units = state.units.filter(v => v.id !== payload);
    },
    call: (state, payload) => {
      let changed = false;
      state.calls.forEach((v, i) => {
        if (v.callnumber === payload.callnumber) {
          state.calls[i] = { ...state.calls[i], ...payload };
          changed = true;
        }
      });
      if (!changed) {
        state.calls.push(payload);
      }
    },
    removecall: (state, payload) => {
      state.calls = state.calls.filter(v => v.callnumber !== payload);
    },
    assignedCall: (state, payload) => {
      state.assignedCall = payload;
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
    updateReady: state => state.updateReady,
    leocharacter: state => state.leo.character,
    leovehicle: state => state.leo.vehicle,
    forms: state => state.forms,
    calls: state => state.calls,
    call: state => id => state.calls.find(call => call.callnumber === id),
    units: state => state.units,
    unit: state => identifier => state.units.find(unit => unit.session_identifier === identifier),
    unitById: state => id => state.units.find(unit => unit.id === id),
    assignedCall: state => state.assignedCall
  }
});
