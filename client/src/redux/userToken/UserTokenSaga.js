import { call, put } from 'redux-saga/effects';
import { setUserToken } from './UserTokenSlice';

function requestGetUserToken(userInformation) {
    return fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userInformation)
    });
}

export function* handleGetUserToken(action) {
    try {
        const response = yield call(requestGetUserToken, action.payload);
        const {data} = response;
        yield put(setUserToken({...data}));
    } catch (error) {
        console.log(error);
    }
}


