import {configureStore, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'
import userTokenSlice from './userToken/UserTokenSlice';
import { watcherSaga } from './RootSaga';

const reducer = combineReducers({
    userToken: userTokenSlice
});

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware({thunk: false}), sagaMiddleware]
});

sagaMiddleware.run(watcherSaga);

export default store;
