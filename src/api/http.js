import axios from 'axios'
import get from 'lodash/get'

const http = axios.create({ baseURL: '/api/' })
const { LOGIN_PAGE_URL } = process.env

http.interceptors.response.use(
  response => response,
  error => {
    if (get(error, 'response.status') === 401) {
      const { pathname, search } = window.location
      let redirect = ''

      const query = new URLSearchParams(search)
      const ref = query.ref || ((pathname || '') + (search || ''))

      if (ref) {
        redirect = `?ref=${encodeURIComponent(ref)}`
      }

      window.location = `${LOGIN_PAGE_URL}${redirect}`
    }
    return Promise.reject(error)
  },
)

export default http
