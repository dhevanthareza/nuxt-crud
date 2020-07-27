const config = {
  production: {
    gateway: 'https://lb-crud.herokuapp.com/',
  },
  local: {
    gateway: 'http://localhost:4000/',
  },
  development: {
    gateway: 'http://localhost:4000/',
  },
}
export default config
