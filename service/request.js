import axios from 'axios'
import config from './config'
const environment = process.env.NODE_ENV
let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}
const request = axios.create({
  baseURL: config[environment].gateway,
})
const errorHandler = error => {
  const errorMessage = error.response.data.error
    ? error.response.data.error.message
    : error.response.data.status.message
  console.log(errorMessage)
  if (!error.response) {
    store.commit('showMessage', {
      type: 'error',
      message: 'Tidak bisa terkoneksi dengan API',
    })
    throw new Error('Tidak bisa terkoneksi dengan API')
  }
  if (error.response.status == 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location = '/'
  }
  store.commit('showMessage', {
    type: 'error',
    message: errorMessage,
  })
  throw new Error(errorMessage)
}

const successHandler = response => {
  response = response.data
  return response
}
const requestHandler = request => {
  // request.headers.Authorization = `Bearer ${
  //   localStorage.token ? localStorage.token : ''
  // }`
  return request
}
request.interceptors.request.use(request => requestHandler(request))
request.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error),
)

export default request
