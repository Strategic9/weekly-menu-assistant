import axios from 'axios'
import { localStorage } from './localstorage';

export const getHeaders = () => {
  const token = localStorage.get('token')
  return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      : {}
}

export const api = axios.create({
  baseURL: 'http://localhost:3001/'
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const errorResponse = { ...error }
    if (errorResponse?.response?.status === 403) {
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const HTTPHandler = {
  api,
  post: (url: string, values) => {
    return api.post(url, { ...values }, { ...getHeaders() })
  },
  patch: (url: string, values) => {
    return api.patch(url, { ...values }, { ...getHeaders() })
  },
  get: (url: string, params?) => {
    return api.get(url, { ...getHeaders(), ...params })
  },
  delete: (url: string, params?) => {
    return api.delete(url, { ...getHeaders(), ...params })
  }
}
