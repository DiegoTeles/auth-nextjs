import http from 'api/http'

const signup = payload => http.post('/signup', payload)
.then(({ data }) => data)
.catch(({ response }) => Promise.reject(response.data))

const login = payload => http.post('/login', payload)
.then(({ data }) => data)
.catch(({ response }) => Promise.reject(response.data))

const logout = () => http.get('/logout')
.then(({ data }) => data)
.catch(({ response }) => Promise.reject(response.data))

export default {
  signup, login, logout
}
