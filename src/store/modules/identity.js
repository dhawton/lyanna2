export const identity = {
  state: {
    id: 0,
    identifier: 0,
    session_identifier: null,
    name: ''
  },
  getters: {
    identity(state) { return state; }
  },
  mutators: {
    identity: (state, payload) => {
      state = { ...state, ...payload };
    }
  }
};
