import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PageableResponse, Playlist, Song } from '../../models'
import { RootState } from '../store'
import {
  addSongToPlaylistAPI,
  createPlaylistAPI,
  deletePlaylistAPI,
  getSongsInFavorite,
  getSongsInPlaylistAPI,
  getUserPlaylists,
  removeSongFromPlaylistAPI,
} from '../../apis/playlistService'

interface PlaylistState {
  userPlaylists: PageableResponse<Playlist>
  songsInPlaylist: PageableResponse<Song>
  isLoading: boolean
  isDetailsLoading: boolean
}

const initialState: PlaylistState = {
  userPlaylists: null,
  songsInPlaylist: null,
  isLoading: true,
  isDetailsLoading: true,
}

export const fetchUserPlaylists = createAsyncThunk(
  'playlist/fetchUserPlaylists',
  async ({
    pageNum = 1,
    pageSize = 5,
  }: {
    pageNum?: number
    pageSize?: number
  }) => {
    const data = await getUserPlaylists(pageNum, pageSize)
    return data
  }
)

export const createNewPlaylist = createAsyncThunk(
  'playlist/createNewPlaylist',
  async (name: string) => {
    const data = await createPlaylistAPI(name)
    return data
  }
)

export const deletePlaylist = createAsyncThunk(
  'playlist/deletePlaylist',
  async (id: number) => {
    const data = await deletePlaylistAPI(id)
    return data
  }
)

export const fetchSongsInPlaylist = createAsyncThunk(
  'playlist/fetchSongsInPlaylist',
  async ({
    playlistId,
    pageNum = 1,
    pageSize = 5,
  }: {
    playlistId: number
    pageNum?: number
    pageSize?: number
  }) => {
    if (playlistId === 0) {
      const data = await getSongsInFavorite(pageNum, pageSize)
      return data
    } else {
      const data = await getSongsInPlaylistAPI(playlistId, pageNum, pageSize)
      return data
    }
  }
)

export const addSongToPlaylist = createAsyncThunk(
  'playlist/addSongToPlaylist',
  async ({ playlistId, songId }: { playlistId: number; songId: number }) => {
    const data = await addSongToPlaylistAPI(songId, playlistId)
    return data
  }
)

export const removeSongFromPlaylist = createAsyncThunk(
  'playlist/removeSongFromPlaylist',
  async ({ playlistId, songId }: { playlistId: number; songId: number }) => {
    const data = await removeSongFromPlaylistAPI(songId, playlistId)
    return data
  }
)

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, { payload }) => {
        state.userPlaylists = payload
        state.isLoading = false
      })
      .addCase(fetchUserPlaylists.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(fetchSongsInPlaylist.pending, (state) => {
        state.isDetailsLoading = true
      })
      .addCase(fetchSongsInPlaylist.fulfilled, (state, { payload }) => {
        state.songsInPlaylist = payload
        state.isDetailsLoading = false
      })
      .addCase(fetchSongsInPlaylist.rejected, (state) => {
        state.isDetailsLoading = false
      })

      .addCase(addSongToPlaylist.fulfilled, (state, { payload }) => {
        const index = state.userPlaylists.items.findIndex(
          (p) => p.id === payload.id
        )
        state.userPlaylists.items[index].totalSongs += 1
      })
      .addCase(removeSongFromPlaylist.fulfilled, (state, { payload }) => {
        const index = state.userPlaylists.items.findIndex(
          (p) => p.id === payload.id
        )
        state.userPlaylists.items[index].totalSongs -= 1
      })
  },
})

export const selectPlaylist = (state: RootState) => state.playlist
const playlistReducer = playlistSlice.reducer
export default playlistReducer
