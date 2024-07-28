import { Alert } from 'react-native'
import { PageableResponse, Song } from '../models'
import customFetch from '../utils/customFetch'
import { getErrorMsg, returnError } from '../utils/errorHelper'

export const getRecentSongs = async () => {
  try {
    const response = await customFetch.get(`/songs/recently`)
    return response.data
  } catch (error) {
    returnError(error)
  }
}

export const findSongs = async (
  keyword: string,
  pageNum: number,
  pageSize: number
): Promise<PageableResponse<Song>> => {
  try {
    const response = await customFetch.get<PageableResponse<Song>>(
      `/songs/search`,
      { params: { keyword, pageNum, pageSize } }
    )
    return response.data
  } catch (error: any) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const checkSongInFavoriteAPI = async (
  songIds: string
): Promise<Boolean[]> => {
  try {
    const response = await customFetch.get<Boolean[]>(
      '/users/checkUserLikedSongs',
      {
        params: { songIds },
      }
    )
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const likeSongAPI = async (songId: number) => {
  try {
    const response = await customFetch.post(`/users/like/${songId}`)
    return 'Success'
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const unlikeSongAPI = async (songId: number) => {
  try {
    const response = await customFetch.delete(`/users/unlike/${songId}`)
    return 'Success'
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}
