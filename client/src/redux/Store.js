import {configureStore, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'
import userTokenSlice from './userToken/UserTokenSlice';
import { watcherSaga } from './RootSaga';

const reducer = combineReducers({
    userToken: userTokenSlice
});

const sagaMiddleware = createSagaMiddleware();

const preloadedState = {
    userToken: {
        firstName: localStorage.getItem('firstName') || undefined,
        lastName: localStorage.getItem('lastName') || undefined,
        userId: localStorage.getItem('userId') || undefined
    }
};

const store = configureStore({
    reducer,
    preloadedState,
    middleware: [...getDefaultMiddleware({thunk: false}), sagaMiddleware]
});

sagaMiddleware.run(watcherSaga);

export default store;
