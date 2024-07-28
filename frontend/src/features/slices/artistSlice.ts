import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Artist, PageableResponse, Song } from '../../models'
import { RootState } from '../store'
import { getArtistSongs, getArtists } from '../../apis/artistService'

interface ArtistState {
  artists: PageableResponse<Artist> | null
  artistDetails: {
    artistId: number | null
    songPage: PageableResponse<Song> | null
    isLoading: boolean
    pageNum: number
    pageSize: number
  }
  isLoading: boolean
}

const initialState: ArtistState = {
  artists: null,
  artistDetails: {
    artistId: null,
    songPage: null,
    isLoading: false,
    pageNum: 1,
    pageSize: 5,
  },
  isLoading: false,
}

export const fetchArtists = createAsyncThunk(
  'artist/fetchArtists',
  async () => {
    const data = await getArtists()
    return data
  }
)

export const fetchArtistSongs = createAsyncThunk(
  'artist/fetchArtistSongs',
  async ({
    artistId,
    pageNum,
    pageSize,
  }: {
    artistId: number
    pageNum: number
    pageSize: number
  }) => {
    const data = await getArtistSongs(artistId, pageNum, pageSize)
    return data
  }
)

const artistSlice = createSlice({
  name: 'artist',
  initialState,
  reducers: {
    setArtistDetailsId: (state, action) => {
      state.artistDetails.artistId = action.payload
    },
    changePageNum: (state, action) => {
      state.artistDetails.pageNum = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchArtists.fulfilled, (state, { payload }) => {
        state.artists = payload
        state.isLoading = false
      })
      .addCase(fetchArtists.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(fetchArtistSongs.pending, (state) => {
        state.artistDetails.isLoading = true
      })
      .addCase(fetchArtistSongs.fulfilled, (state, { payload }) => {
        state.artistDetails.songPage = payload
        state.artistDetails.isLoading = false
      })
      .addCase(fetchArtistSongs.rejected, (state) => {
        state.artistDetails.isLoading = false
      })
  },
})

export const { setArtistDetailsId, changePageNum } = artistSlice.actions
export const selectArtist = (state: RootState) => state.artist
export const selectArtistDetails = (state: RootState) =>
  state.artist.artistDetails
const artistReducer = artistSlice.reducer
export default artistReducer
