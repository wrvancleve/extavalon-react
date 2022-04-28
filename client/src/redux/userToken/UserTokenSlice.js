import { createSlice } from "@reduxjs/toolkit";

const userTokenSlice = createSlice({
    name: "userToken",
    initialState: {},
    reducers: {
        getUserToken() {},
        setUserToken(state, action) {
            return {...state, ...action.payload};
        },
        clearUserToken(state) {
            return {};
        }
    }
});

export const {getUserToken, setUserToken, clearUserToken } = userTokenSlice.actions;

export default userTokenSlice.reducer;
