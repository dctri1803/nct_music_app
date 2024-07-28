import customFetch from '../utils/customFetch'
import { ChangePwdRequest, User } from '../models'
import { Alert } from 'react-native'
import { getErrorMsg, returnError } from '../utils/errorHelper'

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await customFetch.get<User>('/users/profile')
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    returnError(error)
  }
}

export const updateProfile = async (formData: FormData): Promise<User> => {
  try {
    const response = await customFetch.patch(
      `/users/profile/update`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const changePassword = async (request: ChangePwdRequest) => {
  try {
    await customFetch.patch('/users/change-password', request)
    return 'Success'
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}
