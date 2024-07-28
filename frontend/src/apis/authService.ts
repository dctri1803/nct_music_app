import { Alert } from 'react-native'
import { RegisterRequest, JWToken, LoginRequest } from '../models'
import customFetch from '../utils/customFetch'
import { getErrorMsg } from '../utils/errorHelper'

export const register = async (request: RegisterRequest): Promise<JWToken> => {
  try {
    const response = await customFetch.post<JWToken>('/auth/register', request)
    return response.data
  } catch (error: any) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const login = async (request: LoginRequest): Promise<JWToken> => {
  try {
    const response = await customFetch.post<JWToken>(
      `/auth/authenticate`,
      request
    )
    return response.data
  } catch (error: any) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const logout = async () => {
  try {
    await customFetch.post('/auth/logout')
  } catch (error: any) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}
