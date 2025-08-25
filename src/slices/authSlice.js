import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  signupData: null,
  loading: false,
  // FIX: Don't use JSON.parse for token (it's a string, not JSON)
  token: localStorage.getItem("token") || null,  // ✅ Direct access, no JSON.parse
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
    setToken(state, value) {
      state.token = value.payload
    },
  },
})

export const { setSignupData, setLoading, setToken } = authSlice.actions

export default authSlice.reducer