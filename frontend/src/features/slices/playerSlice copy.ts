import { createSlice, current } from '@reduxjs/toolkit'
import { Song } from '../../models'
import { Alert } from 'react-native'

interface PlayerState {
  songs: Song[] | null
  currentSongIndex: number
}

const initialState: PlayerState = {
  songs: null,
  currentSongIndex: 0,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setSongsPlay: (state, { payload }) => {
      state.songs = payload.songs
      state.currentSongIndex = payload.currentIndex
    },
    setCurrentSongIndex: (state, { payload }) => {
      state.currentSongIndex = payload
    },
    nextSong: (state) => {
      if (state.currentSongIndex === state.songs.length - 1) {
        state.currentSongIndex = 0
      }
      state.currentSongIndex += 1
    },
    prevSong: (state) => {
      if (state.currentSongIndex === 0) {
        state.currentSongIndex = state.songs.length - 1
      }
      state.currentSongIndex -= 1
    },
  },
})

export const { setSongsPlay, setCurrentSongIndex, nextSong, prevSong } =
  playerSlice.actions
export default playerSlice.reducer
