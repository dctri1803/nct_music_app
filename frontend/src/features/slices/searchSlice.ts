import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Artist, PageableResponse, Song } from '../../models'
import { findArtists } from '../../apis/artistService'
import { findSongs } from '../../apis/songService'
import { RootState } from '../store'

interface SearchState {
  keyword: string
  artistsResult: PageableResponse<Artist>
  songsResult: PageableResponse<Song>
  isLoading: boolean
  isLoadingMore: boolean
}

const initialState: SearchState = {
  keyword: '',
  artistsResult: {
    items: [],
    pageNum: 1,
    pageSize: 5,
    totalItems: null,
    totalPages: null,
  },
  songsResult: {
    items: [],
    pageNum: 1,
    pageSize: 5,
    totalItems: null,
    totalPages: null,
  },
  isLoading: true,
  isLoadingMore: false,
}

export const searchArtists = createAsyncThunk(
  'search/searchArtists',
  async ({
    keyword,
    pageNum = 1,
    pageSize = 5,
  }: {
    keyword: string
    pageNum?: number
    pageSize?: number
  }) => {
    const data = await findArtists(keyword, pageNum, pageSize)
    return data
  }
)

export const searchSongs = createAsyncThunk(
  'search/searchSongs',
  async ({
    keyword,
    pageNum = 1,
    pageSize = 5,
  }: {
    keyword: string
    pageNum?: number
    pageSize?: number
  }) => {
    const data = await findSongs(keyword, pageNum, pageSize)
    return data
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeyword: (state, { payload }) => {
      state.keyword = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchArtists.pending, (state, action) => {
        if (action.meta.arg.pageNum > 1) {
          state.isLoadingMore = true
        } else {
          state.isLoading = true
          state.isLoadingMore = true
        }
      })
      .addCase(searchArtists.fulfilled, (state, action) => {
        if (action.meta.arg.pageNum > 1) {
          state.artistsResult.items = [
            ...state.artistsResult.items,
            ...action.payload.items,
          ]
        } else {
          state.artistsResult.items = action.payload.items
        }
        state.artistsResult.pageNum = action.payload.pageNum
        state.artistsResult.pageSize = action.payload.pageSize
        state.artistsResult.totalItems = action.payload.totalItems
        state.artistsResult.totalPages = action.payload.totalPages
        state.isLoading = false
        state.isLoadingMore = false
      })
      .addCase(searchArtists.rejected, (state) => {
        state.isLoading = false
        state.isLoadingMore = false
      })

      .addCase(searchSongs.pending, (state, action) => {
        if (action.meta.arg.pageNum > 1) {
          state.isLoadingMore = true
        } else {
          state.isLoading = true
          state.isLoadingMore = true
        }
      })
      .addCase(searchSongs.fulfilled, (state, action) => {
        if (action.meta.arg.pageNum > 1) {
          state.songsResult.items = [
            ...state.songsResult.items,
            ...action.payload.items,
          ]
        } else {
          state.songsResult.items = action.payload.items
        }
        state.songsResult.pageNum = action.payload.pageNum
        state.songsResult.pageSize = action.payload.pageSize
        state.songsResult.totalItems = action.payload.totalItems
        state.songsResult.totalPages = action.payload.totalPages
        state.isLoading = false
        state.isLoadingMore = false
      })
      .addCase(searchSongs.rejected, (state) => {
        state.isLoading = false
        state.isLoadingMore = false
      })
  },
})

export const { setKeyword } = searchSlice.actions
export const selectSearch = (state: RootState) => state.search
export default searchSlice.reducer
