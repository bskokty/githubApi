import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateUser = {
  user: null,
  detailStatus: false,
  detailError: null,
};

export const getUser = createAsyncThunk(
  "users/getUser",
  async ({ userDetailName }, { rejectWithValue }) => {
    const response = await axios.get(
      `https://api.github.com/users/${userDetailName}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token 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`,
          // Authorization: `token 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`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: initialStateUser,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [getUser.pending]: (state) => {
      state.detailStatus = "loading";
    },
    [getUser.fulfilled]: (state, action) => {
      state.detailStatus = "succeeded";
      state.user = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.detailStatus = "failed";
      state.detailError = action.error.message;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
