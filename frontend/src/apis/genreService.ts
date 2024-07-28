import { Alert } from 'react-native'
import { PageableResponse, Song } from '../models'
import customFetch from '../utils/customFetch'
import { getErrorMsg, returnError } from '../utils/errorHelper'

export const getGenres = async () => {
  try {
    const response = await customFetch.get(`/genres`)
    return response.data
  } catch (error) {
    returnError(error)
  }
}

export const getGenreSongs = async (
  genreId: number,
  pageNum: number,
  pageSize: number
): Promise<PageableResponse<Song>> => {
  try {
    const response = await customFetch.get<PageableResponse<Song>>(
      `/genres/${genreId}/songs`,
      { params: { pageNum, pageSize } }
    )
    return response.data
  } catch (error: any) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}
