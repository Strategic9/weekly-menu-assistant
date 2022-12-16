import axios from 'axios'
import { localStorage } from './localstorage'

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

export const getHeadersForBlob = (fileType: string) => {
  const headers = getHeaders()
  return {
    headers: {
      ...headers.headers,
      'Content-Type': 'Multipart/formData',
      Accept: fileType
    }
  }
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
    return api.post(url, values, { ...getHeaders() })
  },
  patch: (url: string, values) => {
    return api.patch(url, { ...values }, { ...getHeaders() })
  },
  get: (url: string, params?) => {
    return api.get(url, { ...getHeaders(), ...params })
  },
  delete: (url: string, params?) => {
    return api.delete(url, { ...getHeaders(), ...params })
  },
  postBlob: (url: string, values, fileType: string) => {
    return api.post(url, values, { ...getHeadersForBlob(fileType) })
  }
}
