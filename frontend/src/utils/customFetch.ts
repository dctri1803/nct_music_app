import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { BasicIP } from '../constant/Constants'
import { StoreType } from '../features/store'
import { getTokenFromStorage, saveTokenToStorage } from './localStorage'
import { JWToken } from '../models'
import { AsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

let store: StoreType
let logoutUser: AsyncThunk<void, void, AsyncThunkConfig>

export const injectStore = (
  _store: StoreType,
  _logoutUser: AsyncThunk<void, void, AsyncThunkConfig>
) => {
  store = _store
  logoutUser = _logoutUser
}

const customFetch = axios.create({
  baseURL: BasicIP,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: AxiosError) => void
}> = []

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })

  failedQueue = []
}

customFetch.interceptors.request.use(
  async (config) => {
    const token = await getTokenFromStorage()
    if (token) {
      config.headers.Authorization = `Bearer ${token.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

customFetch.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            return axios(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const token = await getTokenFromStorage()
      if (token) {
        try {
          const response = await axios.post<JWToken>(
            `${BasicIP}/auth/refresh-token`,
            null,
            {
              headers: { Authorization: `${token.type} ${token.refreshToken}` },
            }
          )
          const newToken = response.data
          await saveTokenToStorage(newToken)
          customFetch.defaults.headers.common[
            'Authorization'
          ] = `${newToken.type} ${newToken.accessToken}`
          processQueue(null, newToken.accessToken)
          isRefreshing = false
          return customFetch(originalRequest)
        } catch (err: any) {
          processQueue(err as AxiosError, null)
          isRefreshing = false
          store.dispatch(logoutUser()) // Logout user on refresh token failure
          alert('You have been logged out!')
          return Promise.reject(err)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default customFetch
