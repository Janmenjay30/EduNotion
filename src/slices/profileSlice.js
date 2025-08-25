// filepath: d:\E Drive\programming\webdev\MegaProject\StudyNotion\src\slices\profileSlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  // FIX: User IS JSON, so keep JSON.parse here
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,  // ✅ Keep this
  loading: false,
}

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
  },
})

export const { setUser, setLoading } = profileSlice.actions

export default profileSlice.reducer