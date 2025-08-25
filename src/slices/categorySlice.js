// You likely need to create this file:

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  categories: [],
  loading: false,
}

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    setCategories(state, value) {
      state.categories = value.payload
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
    addCategory(state, value) {
      state.categories.push(value.payload)
    },
    removeCategory(state, value) {
      state.categories = state.categories.filter(cat => cat._id !== value.payload)
    }
  },
})

export const { setCategories, setLoading, addCategory, removeCategory } = categorySlice.actions
export default categorySlice.reducer