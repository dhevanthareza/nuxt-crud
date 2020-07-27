const state = () => ({
  show: false,
  message: '',
  type: 'success',
})
const mutations = {
  showMessage: (state, payload) => {
    state.show = true
    state.message = payload.message
    state.type = payload.type
    setTimeout(function() {
      state.show = false
    }, 10000)
  },
}
export default {
  state,
  mutations,
}
