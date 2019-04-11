import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { EventBus } from "../EventBus";

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
    fire: {
      station: null,
      apparatus: null,
      company: null,
      id: null,
      radio: null
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
      },
      cases: {
        title: null,
        status: null,
        entry: null
      },
      document: {
        type: null,
        casenumber: null,
        character_id: null,
        licenseplate: null,
        make: null,
        model: null,
        color: null,
        address: null,
        city: null,
        violations: [],
        narrative: null,
        plea: null,
        restitution: null,
        restitution_amount: null
      },
      newcall: {
        type: null,
        address: null,
        city: null,
        description: null,
        console: null
      },
      bolo: {
        suspect_info: null,
        vehicle_info: null,
        details: null
      }
    },
    calls: [],
    units: [],
    bolos: [],
    cases: [],
    assignedCall: null,
    channelHeld: false,
    phoneCall: false,
    laws: [],
    dispatch: {
      channelHeld: false,
      phoneRing: false,
      channelHeldStage: 0,
      phoneRingStage: 0,
      initialLoading: false
    },
    mapCurrentZoom: undefined,
    mapCurrentCenter: undefined,
    ws: {}
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
    formcases: (state, payload) => {
      state.forms.cases = { ...state.forms.cases, ...payload };
    },
    formdocument: (state, payload) => {
      state.forms.document = { ...state.forms.document, ...payload };
    },
    formnewcall: (state, payload) => {
      state.forms.newcall = { ...state.forms.newcall, ...payload };
    },
    formbolo: (state, payload) => {
      state.forms.bolo = { ...state.forms.bolo, ...payload };
    },
    calls: (state, payload) => {
      state.calls[payload.id] = payload.call;
    },
    fillunits: (state, payload) => {
      state.units = payload;
    },
    fillcalls: (state, payload) => {
      state.calls = payload;
    },
    unit: (state, payload) => {
      let changed = false;
      state.units.forEach((v, i) => {
        if (v.id === payload.id) {
          Vue.set(state.units, i, { ...state.units[i], ...payload });
          changed = true;
        }
      });
      if (!changed) {
        state.units.push(payload);
      }
    },
    fire: (state, payload) => {
      state.fire = payload;
    },
    removeunit: (state, payload) => {
      state.units = state.units.filter(v => v.id !== payload);
    },
    call: (state, payload) => {
      let changed = false;
      state.calls.forEach((v, i) => {
        if (v.callnumber === payload.callnumber) {
          Vue.set(state.calls, i, { ...state.calls[i], ...payload });
          /*           state.calls[i] = { ...state.calls[i], ...payload }; */
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
    },
    channelHeld: (state, payload) => {
      state.channelHeld = payload;
    },
    phoneCall: (state, payload) => {
      state.phoneCall = payload;
    },
    bolo: (state, payload) => {
      let changed = false;
      state.bolos.forEach((v, i) => {
        if (v.id === payload.id) {
          if (payload.status !== "live") {
            state.bolos = state.bolos.filter(b => b.id !== parseInt(payload.id, 10));
          } else {
            Vue.set(state.bolos, i, { ...state.bolos[i], ...payload });
          }
          changed = true;
        }
      });
      if (!changed && payload.status === "live") {
        state.bolos.push(payload);
        EventBus.$emit("new-bolo");
      }
    },
    bolos: (state, payload) => {
      state.bolos = payload;
    },
    cases: (state, payload) => {
      state.cases = payload;
    },
    case: (state, payload) => {
      let change = false;
      state.cases.forEach((v, i) => {
        if (v.id === payload.id) {
          Vue.set(state.cases, i, { ...state.cases[i], ...payload });
          change = true;
        }
      });

      if (!change) state.cases.push(payload);
    },
    laws: (state, payload) => {
      state.laws = payload;
    },
    dispatchInitial: (state, payload) => {
      state.dispatch.initialLoading = payload;
    },
    mapCenter(state, payload) {
      state.mapCurrentCenter = payload;
    },
    mapZoom(state, payload) {
      state.mapCurrentZoom = payload;
    },
    ws: (state, payload) => {
      state.ws = { ...state.ws, ...payload };
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
    assignedCall: state => state.assignedCall,
    channelHeld: state => state.channelHeld,
    phoneCall: state => state.phoneCall,
    bolos: state => state.bolos,
    cases: state => state.cases,
    laws: state => state.laws,
    dispatchInitial: state => state.dispatch.initialLoading,
    mapCenter: state => state.mapCurrentCenter,
    mapZoom: state => state.mapCurrentZoom,
    fire: state => state.fire,
    ws: state => state.ws
  }
});
