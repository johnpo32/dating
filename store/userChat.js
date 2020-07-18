export const state = () => ({
  notificacion: false
});

export const mutation = {
  THERE_USER: (state, ruta) => {
    state.notificacion = ruta;
  }
};

export const action = {
  chatIdUser({ commit }, notificacion) {
    commit("THERE_USER", notificacion);
  }
};

export const getters = {
  chatActual: state => {
    var res = state.notificacion;
    return res;
  }
};
