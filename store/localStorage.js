export const state = () => ({
  authUser: null
});

export const mutations = {
  RESET_STORE: (state, user) => {
    state.authUser = user;
  },

  SET_AUTH_USER: (state, authUser) => {
    state.authUser = { uid: authUser.uid, email: authUser.email };
  }
};

export const actions = {
  onAuthStateChanged({ commit }, authUser) {
    if (!authUser) {
      commit("RESET_STORE", null);
      return;
    }
    commit("SET_AUTH_USER", authUser);
  },
  RESET({ commit }) {
    commit("RESET_STORE", null);
  }
};

export const getters = {
  isLoggedIn: state => {
    try {
      return state.authUser.uid !== null;
    } catch {
      return false;
    }
  },
  userID: state => {
    var res = state.authUser.uid;
    return res;
  }
};
