import {configureStore, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'
import userTokenSlice from './userToken/UserTokenSlice';
import { watcherSaga } from './RootSaga';

const reducer = combineReducers({
    userToken: userTokenSlice
});

const sagaMiddleware = createSagaMiddleware();

const storedFirstName = localStorage.getItem('firstName');
const storedLastName = localStorage.getItem('lastName');
const storedUserId = localStorage.getItem('userId');
const preloadedState = {
    userToken: {
        firstName: storedFirstName || undefined,
        lastName: storedLastName || undefined,
        userId: storedUserId != null ? Number(storedUserId) : undefined
    }
};

const store = configureStore({
    reducer,
    preloadedState,
    middleware: [...getDefaultMiddleware({thunk: false}), sagaMiddleware]
});

sagaMiddleware.run(watcherSaga);

export default store;
