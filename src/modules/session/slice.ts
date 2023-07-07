import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { SessionState } from "./types";
import { handleSuccessfulAuthentication } from "./utils";

const initialState: SessionState = {
  // if refresh token is present, user is logged in or can refresh session
  isLoggedIn: !!Cookies.get("refreshToken"),
  verificationPingStartedAt: undefined,
};

const sessionSlice = createSlice({
  initialState,
  name: "session",
  reducers: {
    setIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    receiveRefreshToken: handleSuccessfulAuthentication,
    receiveSuccessfullAuthentication: handleSuccessfulAuthentication,
    startVerificationTimer: (state) => {
      state.verificationPingStartedAt = new Date().getTime();
    },
    removeVerificationTimer: (state) => {
      state.verificationPingStartedAt = undefined;
    },
  },
});

export const {
  setIsLoggedIn,
  receiveRefreshToken,
  receiveSuccessfullAuthentication,
  startVerificationTimer,
  removeVerificationTimer,
} = sessionSlice.actions;

export default sessionSlice.reducer;
