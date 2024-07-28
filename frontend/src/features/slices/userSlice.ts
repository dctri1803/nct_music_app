import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ChangePwdRequest, User } from '../../models'
import {
  changePassword,
  getUserProfile,
  updateProfile,
} from '../../apis/userService'
import { RootState } from '../store'

interface UserState {
  profile: User
  isLoading: boolean
}

const initialState: UserState = {
  profile: null,
  isLoading: true,
}

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async () => {
    const data = await getUserProfile()
    return data
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (formData: FormData) => {
    const data = await updateProfile(formData)
    return data
  }
)

export const changeUserPassword = createAsyncThunk(
  'user/changeUserPassword',
  async (request: ChangePwdRequest, thunkAPI) => {
    try {
      const data = await changePassword(request)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.profile = payload
        state.isLoading = false
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.profile = payload
        state.isLoading = false
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.isLoading = false
      })

      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false
      })
  },
})

export const selectUser = (state: RootState) => state.user
const userReducer = userSlice.reducer
export default userReducer
