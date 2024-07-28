import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { JWToken, LoginRequest, RegisterRequest } from '../../models'
import { login, logout, register } from '../../apis/authService'
import {
  getTokenFromStorage,
  removeTokenFromStorage,
  saveTokenToStorage,
} from '../../utils/localStorage'
import { RootState } from '../store'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

interface AuthState {
  token: JWToken | null
  isLoading: boolean
}

const initialState: AuthState = {
  token: null,
  isLoading: false,
}

export const fetchTokenFromStorage = createAsyncThunk(
  'auth/fetchTokenFromStorage',
  async () => {
    const token = await getTokenFromStorage()
    return token
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (request: RegisterRequest) => {
    const token = await register(request)
    return token
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (request: LoginRequest) => {
    const token = await login(request)
    return token
  }
)

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    await logout()
    thunkAPI.dispatch(removeToken())
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    removeToken: (state) => {
      state.token = initialState.token
      removeTokenFromStorage()
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenFromStorage.fulfilled, (state, { payload }) => {
        state.token = payload
        state.isLoading = false
      })

      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.token = payload
        saveTokenToStorage(payload)
        state.isLoading = false
      })

      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.token = payload
        saveTokenToStorage(payload)
        state.isLoading = false
      })

      // .addCase(logoutUser.fulfilled, (state) => {
      //   state.token = initialState.token
      //   removeTokenFromStorage()
      //   state.isLoading = false
      // })
      .addCase(logoutUser.rejected, (state) => {
        state.token = initialState.token
        removeTokenFromStorage()
        state.isLoading = false
      })

      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith('/rejected'),
        (state) => {
          state.isLoading = false
        }
      )
  },
})

export const { removeToken } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
const authReducer = authSlice.reducer
export default authReducer
