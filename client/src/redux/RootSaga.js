import { takeLatest } from 'redux-saga/effects';

import { getUserToken } from './userToken/UserTokenSlice';
import { handleGetUserToken } from './userToken/UserTokenSaga';

export function* watcherSaga() {
    yield takeLatest(getUserToken.type, handleGetUserToken);
}
