import { Alert } from 'react-native'
import customFetch from '../utils/customFetch'
import { getErrorMsg } from '../utils/errorHelper'
import { PageableResponse, Song } from '../models'

export const getUserPlaylists = async (pageNum: number, pageSize: number) => {
  try {
    const response = await customFetch.get(`/users/me/playlists`, {
      params: { pageNum, pageSize },
    })
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const createPlaylistAPI = async (name: string) => {
  try {
    const response = await customFetch.post(`/playlists`, { name })
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const deletePlaylistAPI = async (id: number) => {
  try {
    await customFetch.delete(`/playlists/${id}`)
    return 'Success'
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const getSongsInPlaylistAPI = async (
  id: number,
  pageNum: number,
  pageSize: number
): Promise<PageableResponse<Song>> => {
  try {
    const response = await customFetch.get<PageableResponse<Song>>(
      `/playlists/${id}/songs`,
      {
        params: { pageNum, pageSize },
      }
    )
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const getSongsInFavorite = async (
  pageNum: number,
  pageSize: number
): Promise<PageableResponse<Song>> => {
  try {
    const response = await customFetch.get<PageableResponse<Song>>(
      `/users/me/favorite-songs`,
      {
        params: { pageNum, pageSize },
      }
    )
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const checkSongInPlaylistAPI = async (
  songId: number,
  playlistIds: string
): Promise<Boolean[]> => {
  try {
    const response = await customFetch.get<Boolean[]>(
      '/playlists/checkSongInPlaylists',
      {
        params: { songId, playlistIds },
      }
    )
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const addSongToPlaylistAPI = async (
  songId: number,
  playlistId: number
) => {
  try {
    const response = await customFetch.post(`/playlists/${playlistId}/songs`, {
      songId: songId,
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}

export const removeSongFromPlaylistAPI = async (
  songId: number,
  playlistId: number
) => {
  try {
    const response = await customFetch.delete(
      `/playlists/${playlistId}/songs/${songId}`
    )
    return response.data
  } catch (error) {
    Alert.alert('Error', getErrorMsg(error))
    throw error
  }
}
