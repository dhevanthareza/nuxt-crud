import Vuex from 'vuex'
import Alert from './alert'

const createStore = () => {
  return new Vuex.Store({
    state: {
      isAuthenticated: false,
    },
    mutations: {
      authenticate(state) {
        state.isAuthenticated = true
      },
      unauthenticate(state) {
        state.isAuthenticated = false
      },
    },
    modules: {
      Alert,
    },
  })
}

export default createStore
