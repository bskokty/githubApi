import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateUserUnfollow = {
  unfollowedUser: "",
  unfollowStatus: null,
  unfollowError: null,
};

export const unfollowUser = createAsyncThunk(
  "users/unfollowUser",
  async ({ userDetailName }, { rejectWithValue }) => {
    const response = await axios.delete(
      `https://api.github.com/user/following/${userDetailName}`,
      {
        headers: {
          Authorization: `token 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`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log(response);
    return response.status;
  }
);

export const userUnfollowSlice = createSlice({
  name: "userFollowing",
  initialState: initialStateUserUnfollow,
  reducers: {
    setUserUnfollowing: (state, action) => {
      state.unfollowedUser = action.payload;
    },
  },
  extraReducers: {
    [unfollowUser.pending]: (state) => {
      state.unfollowStatus = "loading";
    },
    [unfollowUser.fulfilled]: (state, action) => {
      state.unfollowStatus = "succeeded";
      state.unfollowedUser = action.payload;
      console.log(action.payload);
    },
    [unfollowUser.rejected]: (state, action) => {
      state.unfollowStatus = "failed";
      state.unfollowError = action.error.message;
    },
  },
});

export const { setUserUnfollowing } = userUnfollowSlice.actions;
export default userUnfollowSlice.reducer;
