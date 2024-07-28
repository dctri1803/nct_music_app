import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Genre, PageableResponse, Song } from '../../models'
import { Alert } from 'react-native'
import { RootState } from '../store'
import { getGenreSongs, getGenres } from '../../apis/genreService'

interface GenreState {
  genres: Genre[] | null
  isLoading: boolean
  genreDetails: {
    genreId: number | null
    genreName: string | null
    songPage: PageableResponse<Song> | null
    pageNum: number
    pageSize: number
    isLoading: boolean
  }
}

const initialState: GenreState = {
  genres: null,
  isLoading: false,
  genreDetails: {
    genreId: null,
    genreName: null,
    songPage: null,
    pageNum: 1,
    pageSize: 5,
    isLoading: false,
  },
}

export const fetchGenres = createAsyncThunk('genre/fetchGenres', async () => {
  const data = await getGenres()
  return data
})

export const fetchGenreSongs = createAsyncThunk(
  'genre/fetchGenreSongs',
  async ({
    genreId,
    pageNum,
    pageSize,
  }: {
    genreId: number
    pageNum: number
    pageSize: number
  }) => {
    const data = getGenreSongs(genreId, pageNum, pageSize)
    return data
  }
)

const genreSlice = createSlice({
  name: 'genre',
  initialState,
  reducers: {
    setGenreDetails: (state, action) => {
      state.genreDetails.genreId = action.payload.genreId
      state.genreDetails.genreName = action.payload.genreName
    },
    changePageNum: (state, action) => {
      state.genreDetails.pageNum = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchGenres.fulfilled, (state, { payload }) => {
        state.genres = payload
        state.isLoading = false
      })
      .addCase(fetchGenres.rejected, (state, { error }) => {
        state.isLoading = false
        Alert.alert('Error', error.message || 'There was an error')
      })

      .addCase(fetchGenreSongs.pending, (state) => {
        state.genreDetails.isLoading = true
      })
      .addCase(fetchGenreSongs.fulfilled, (state, { payload }) => {
        state.genreDetails.songPage = payload
        state.genreDetails.isLoading = false
      })
      .addCase(fetchGenreSongs.rejected, (state) => {
        state.genreDetails.isLoading = false
      })
  },
})

export const { setGenreDetails, changePageNum } = genreSlice.actions
export const selectGenreDetails = (state: RootState) => state.genre.genreDetails
export const selectGenre = (state: RootState) => state.genre
const genreReducer = genreSlice.reducer
export default genreReducer
