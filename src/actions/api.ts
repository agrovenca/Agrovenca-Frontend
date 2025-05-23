import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const apiWithCredentials = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const apiWithOutCredentials = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
