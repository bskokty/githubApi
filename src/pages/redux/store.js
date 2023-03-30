import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./users/userSlicer";
import userDetailReducer from "./users/userDetailSlicer";
import userFollowingReducer from "./users/userFallowSlicer";
import userUnfollowingReducer from "./users/userUnfallowSlicer";
import followReducer from "./followers/followerListSlicer";

const store = configureStore({
  reducer: {
    users: userReducer,
    user: userDetailReducer,
    userFollowing: userFollowingReducer,
    userUnfollowing: userUnfollowingReducer,
    follows: followReducer,
  },
});

export default store;
