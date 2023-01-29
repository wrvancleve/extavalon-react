import { call, put } from 'redux-saga/effects';

import axios from 'axios';

import { setUserToken } from './UserTokenSlice';

function requestGetUserToken(userInformation) {
    return axios.post(`/api/login`, userInformation);
}

export function* handleGetUserToken(action) {
    try {
        const {data} = yield call(requestGetUserToken, action.payload);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        localStorage.setItem('userId', data.userId);
        yield put(setUserToken(data));
    } catch (error) {
        console.log(error);
    }
}
