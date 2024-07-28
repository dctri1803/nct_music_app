import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PageableResponse, Song } from '../../models'
import customFetch from '../../utils/customFetch'
import { Alert } from 'react-native'
import { RootState } from '../store'
import { getRecentSongs } from '../../apis/songService'

interface SongState {
  heading: string
  items: Song[] | null
  isLoading: boolean
  recentSongs: PageableResponse<Song> | null
}

const initialState: SongState = {
  heading: 'Songs',
  items: null,
  isLoading: false,
  recentSongs: null,
}

export const fetchRecentSongs = createAsyncThunk(
  'song/fetchRecentSongs',
  async () => {
    const data = await getRecentSongs()
    return data
  }
)

export const fetchSongs = createAsyncThunk(
  'song/fetchSongs',
  async ({ url, heading }: { url: string; heading: string }) => {
    try {
      const response = await customFetch.get(url)
      return { data: response.data, heading }
    } catch (error) {
      if (error.response.data.errors?.length > 0) {
        throw error.response.data.errors[0]
      } else {
        throw error
      }
    }
  }
)

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentSongs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchRecentSongs.fulfilled, (state, { payload }) => {
        state.recentSongs = payload
        state.isLoading = false
      })
      .addCase(fetchRecentSongs.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
      .addCase(fetchSongs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSongs.fulfilled, (state, { payload }) => {
        state.items = payload.data.items
        state.heading = payload.heading
        state.isLoading = false
      })
      .addCase(fetchSongs.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })
  },
})

export const selectSong = (state: RootState) => state.song
const songReducer = songSlice.reducer
export default songReducer
