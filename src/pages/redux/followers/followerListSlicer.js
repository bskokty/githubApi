import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateUserList = {
  followList: [],
  followListStatus: false,
  followListError: null,
};

export const getFollows = createAsyncThunk("followers/getFollows", async () => {
  //console.log("response.data.items");
  const response = await axios.get(`https://api.github.com/user/following`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token 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`,
    },
  });
  //console.log(response.data);
  return response.data;
});

const followerListSlice = createSlice({
  name: "getFollows",
  initialState: initialStateUserList,
  reducers: {
    setFollowList: (state, action) => {
      state.followList = action.payload;
    },
  },
  extraReducers: {
    [getFollows.pending]: (state) => {
      state.followListStatus = "loading";
    },
    [getFollows.fulfilled]: (state, action) => {
      state.followListStatus = "succeeded";
      state.followList = action.payload;
    },
    [getFollows.rejected]: (state, action) => {
      state.followListStatus = "failed";
      state.followListError = action.error.message;
    },
  },
});

export const { setFollowList } = followerListSlice.actions;
export default followerListSlice.reducer;
