import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateUserFollow = {
  followedUser: "",
  followStatus: null,
  followError: null,
};

export const followUser = createAsyncThunk(
  "users/followUser",
  async ({ userDetailName }, { rejectWithValue }) => {
    const response = await axios.put(
      `https://api.github.com/user/following/${userDetailName}`,
      {},
      {
        headers: {
          Authorization: `token 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`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    //console.log(response);
    return response.status;
  }
);

export const userFollowSlice = createSlice({
  name: "userFollowing",
  initialState: initialStateUserFollow,
  reducers: {
    setUserFollowing: (state, action) => {
      state.followedUser = action.payload;
    },
  },
  extraReducers: {
    [followUser.pending]: (state) => {
      state.followStatus = "loading";
    },
    [followUser.fulfilled]: (state, action) => {
      state.followStatus = "succeeded";
      state.followedUser = action.payload;
      //console.log(action.payload);
    },
    [followUser.rejected]: (state, action) => {
      state.followStatus = "failed";
      state.followError = action.error.message;
    },
  },
});

export const { setUserFollowing } = userFollowSlice.actions;
export default userFollowSlice.reducer;
