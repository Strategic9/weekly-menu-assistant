import axios from 'axios'
import { localStorage } from './localstorage';

export const api = axios.create({
  baseURL: 'http://localhost:3001/'
});

export const HTTPHandler = {
  api,
  post: (url: string, values) => {
    const token = localStorage.get('token');
    const config = token ? {
      headers: {
        Authorization: `Bearer ${localStorage.get('token')}`
      }
    } : {};
    return api.post(url, {...values}, {...config});
  },
  patch: (url: string, values) => {
    const token = localStorage.get('token');
    const config = token ? {
      headers: {
        Authorization: `Bearer ${localStorage.get('token')}`
      }
    } : {};
    return api.patch(url, {...values}, {...config});
  },
  get: (url: string, params?) => {
    const token = localStorage.get('token');
    const config = token ? {
      headers: {
        Authorization: `Bearer ${localStorage.get('token')}`
      }
    } : {};
    return api.get(url, {...config, ...params});
  },
  delete: (url: string, params?) => {
    const token = localStorage.get('token');
    const config = token ? {
      headers: {
        Authorization: `Bearer ${localStorage.get('token')}`
      }
    } : {};
    return api.delete(url, {...config, ...params});
  }
}