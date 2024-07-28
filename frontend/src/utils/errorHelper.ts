import { isAxiosError } from 'axios'
import { ErrorResponse } from '../models/ErrorResponse'

export const getErrorMsg = (error: any): string => {
  if (isAxiosError(error)) {
    const errorReponese: ErrorResponse = error.response.data
    return errorReponese.errors[0]
  }
  return 'There was an error! Please try again.'
}

export const returnError = (error: any) => {
  if (error.response?.status === 401) {
    return
  }
  throw error
}
