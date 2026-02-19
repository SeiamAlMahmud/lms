import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (_state, action: PayloadAction<AuthState>) => action.payload,
    clearSession: () => initialState,
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
