import React from 'react';
import { useLocation } from "react-router-dom";

import io from 'socket.io-client';

let location = useLocation();
const gameCode = location.state.code;

const socket = io.connect("http://localhost:3001")

export default function Game() {
    return (
        <>
            <h1 className="FutureTitleBoxed">extavalon</h1>
        </>
    )
}
