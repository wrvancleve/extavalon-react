import { createSlice } from "@reduxjs/toolkit";

const userTokenSlice = createSlice({
    name: "userToken",
    initialState: {
        firstName: undefined,
        lastName: undefined,
        userId: undefined
    },
    reducers: {
        getUserToken() {},
        setUserToken(state, action) {
            return {...state, ...action.payload};
        },
        clearUserToken(state) {
            return {firstName: undefined, lastName: undefined, userId: undefined};
        }
    }
});

export const {getUserToken, setUserToken, clearUserToken } = userTokenSlice.actions;

export default userTokenSlice.reducer;
