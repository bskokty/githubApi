import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateUserList = {
  users: [],
  status: false,
  error: null,
};

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async ({ userName, perPage, page }, { rejectWithValue }) => {
    const response = await axios.get(
      `https://api.github.com/search/users?q=${userName}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token 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`,
        },
      }
    );
    return response.data.items;
    console.log(response.data.items);
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState: initialStateUserList,
  reducers: {
    setUserList: (state, action) => {
      state.users = action.payload;
    },
  },
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.status = "loading";
    },
    [getUsers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { setUserList } = userListSlice.actions;
export default userListSlice.reducer;
