import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import searchReducer from './slices/searchSlice'
import songReducer from './slices/songSlice'
import playerReducer from './slices/playerSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import artistReducer from './slices/artistSlice'
import genreReducer from './slices/genreSlice'
import userReducer from './slices/userSlice'
import playlistReducer from './slices/playlistSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    song: songReducer,
    player: playerReducer,
    artist: artistReducer,
    genre: genreReducer,
    user: userReducer,
    playlist: playlistReducer,
  },
})

export type StoreType = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
