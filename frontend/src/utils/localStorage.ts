import AsyncStorage from '@react-native-async-storage/async-storage'
import { JWToken } from '../models'

export const saveTokenToStorage = async (token: JWToken) => {
  removeTokenFromStorage()
  try {
    await AsyncStorage.setItem('token', JSON.stringify(token))
  } catch (error) {
    console.log('Error saving token to AsyncStorage:', error)
  }
}

export const getTokenFromStorage = async (): Promise<JWToken | null> => {
  try {
    const data = await AsyncStorage.getItem('token')
    if (data) {
      const token = JSON.parse(data)
      return token
    }
    return null
  } catch (error) {
    console.log('Error checking token in AsyncStorage:', error)
    return null
  }
}

export const removeTokenFromStorage = async () => {
  await AsyncStorage.removeItem('token')
}
