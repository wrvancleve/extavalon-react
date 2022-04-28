import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Game from './pages/game/Game';
import { useSelector } from 'react-redux';

function App() {
  const userToken = useSelector((state) => state.userToken);

  if (!userToken) {
    return <Login />
  }

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
