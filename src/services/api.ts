import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/api/v1',
  headers: {
    email: 'jalxnd@gmail.com',
    password: 'jalxnda8acd'
  }
})
