import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PageableResponse, Playlist, Song } from '../../models'
import { RootState } from '../store'
import { shuffleSongs } from '../../utils/songHelper'
import {
  checkSongInFavoriteAPI,
  likeSongAPI,
  unlikeSongAPI,
} from '../../apis/songService'
import { checkSongInPlaylistAPI } from '../../apis/playlistService'

interface PlayerState {
  songPage: PageableResponse<Song>
  isLikedSongs: Boolean[]
  isInPlaylist: Boolean[]
  shuffledSongs: Song[]
  currentSongIndex: number
  loopingStatus: 'none' | 'song' | 'list'
  isShuffle: boolean
  progress: number
  duration: number
  isPlaying: boolean
  listenedSongs: Song[]
}

const initialState: PlayerState = {
  songPage: null,
  isLikedSongs: null,
  isInPlaylist: null,
  shuffledSongs: [],
  currentSongIndex: null,
  loopingStatus: 'none',
  isShuffle: false,
  progress: 0,
  duration: 0,
  isPlaying: true,
  listenedSongs: [],
}

export const checkLikedSongs = createAsyncThunk(
  'player/checkLikedSongs',
  async (songs: Song[]) => {
    const idsString: string = songs.map((song) => song.id.toString()).join(',')
    const data = await checkSongInFavoriteAPI(idsString)
    return data
  }
)

export const likeSong = createAsyncThunk(
  'player/likeSong',
  async ({ songId }: { songId: number }) => {
    const data = await likeSongAPI(songId)
    return data
  }
)

export const unlikeSong = createAsyncThunk(
  'player/unlikeSong',
  async ({ songId }: { songId: number }) => {
    const data = await unlikeSongAPI(songId)
    return data
  }
)

export const checkSongInPlaylists = createAsyncThunk(
  'player/checkSongInPlaylists',
  async ({ songId, playlists }: { songId: number; playlists: Playlist[] }) => {
    const playlistIds: string = playlists
      .map((playlist) => playlist.id.toString())
      .join(',')
    const data = await checkSongInPlaylistAPI(songId, playlistIds)
    return data
  }
)
  
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    resetState: (state) => {
      state.progress = initialState.progress
      // state.isShuffle = initialState.isShuffle
      // state.loopingStatus = initialState.loopingStatus
      state.isPlaying = initialState.isPlaying
    },
    setSongsPlay: (state, action) => {
      state.songPage = action.payload.songPage
      state.currentSongIndex = action.payload.currentSongIndex
      state.shuffledSongs = shuffleSongs(action.payload.songPage.items)
    },
    nextSong: (state) => {
      if (state.currentSongIndex === state.songPage.items.length - 1) {
        state.currentSongIndex = 0
      } else {
        state.currentSongIndex += 1
      }
    },
    prevSong: (state) => {
      if (state.currentSongIndex === 0) {
        state.currentSongIndex = state.songPage.items.length - 1
      } else {
        state.currentSongIndex -= 1
      }
    },
    setCurrentIndex: (state, action) => {
      state.currentSongIndex = action.payload
    },
    setLoopingStatus: (state, action) => {
      const currentStatus = action.payload
      if (currentStatus === 'none') {
        state.loopingStatus = 'song'
      } else if (currentStatus === 'song') {
        state.loopingStatus = 'list'
      } else {
        state.loopingStatus = 'none'
      }
    },
    setShuffleStatus: (state, action) => {
      state.isShuffle = action.payload
      if (state.isShuffle) {
        state.shuffledSongs = shuffleSongs(state.songPage.items)
      }
    },
    setProgress: (state, action) => {
      state.progress = action.payload
    },
    setDuration: (state, action) => {
      state.duration = action.payload
    },
    setPlayingState: (state, action) => {
      state.isPlaying = action.payload
    },
    addListenedSong: (state, action) => {
      state.listenedSongs.push(action.payload)
    },
    clearListenedSongs: (state) => {
      state.listenedSongs = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLikedSongs.fulfilled, (state, { payload }) => {
      state.isLikedSongs = payload
    })
    builder.addCase(checkLikedSongs.pending, (state, { payload }) => {})
    builder.addCase(checkLikedSongs.rejected, (state, { payload }) => {})
    builder.addCase(likeSong.fulfilled, (state, { payload }) => {
      const currentIndex = state.currentSongIndex
      state.isLikedSongs[currentIndex] = true
      state.songPage.items[currentIndex].numberLikes += 1
    })
    builder.addCase(unlikeSong.fulfilled, (state, { payload }) => {
      const currentIndex = state.currentSongIndex
      state.isLikedSongs[currentIndex] = false
      state.songPage.items[currentIndex].numberLikes -= 1
    })
    builder.addCase(checkSongInPlaylists.fulfilled, (state, { payload }) => {
      state.isInPlaylist = payload
    })
  },
})

export const {
  setSongsPlay,
  nextSong,
  prevSong,
  setLoopingStatus,
  setShuffleStatus,
  setProgress,
  setDuration,
  setPlayingState,
  setCurrentIndex,
  addListenedSong,
  clearListenedSongs,
  resetState,
} = playerSlice.actions
export const selectPlayer = (state: RootState) => state.player
const playerReducer = playerSlice.reducer
export default playerReducer
