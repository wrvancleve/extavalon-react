import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './components/home/Home';
import Login from './components/login/Login';
import Game from './components/game/Game';

function App() {
  const userToken = useSelector((state) => state.userToken);
  let loggedOut = true;
  if (userToken.firstName && userToken.lastName && userToken.userId) {
    loggedOut = false;
  }

  return (
    <Routes>
      <Route
        exact path="/"
        element={
          loggedOut ? (
            <Navigate to="/login" replace/>
          ) : (
            <Home />
          )
        }
      />
      <Route exact path="/login" element={<Login />} />
      <Route
        exact path="/game"
        element={
          loggedOut ? (
            <Navigate to="/login" replace/>
          ) : (
            <Game />
          )
        }
      />
    </Routes>
  );
}

export default App;
