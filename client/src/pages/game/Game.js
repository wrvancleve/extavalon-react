import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

import FutureButton from '../../components/futureButton/FutureButton';
import FutureLeftCircleButton from '../../components/futureLeftCircleButton/FutureLeftCircleButton';
import FutureRightCircleMenuButton from '../../components/futureRightCircleMenuButton/FutureRightCircleMenuButton';
import FutureMenuModal from '../../components/futureMenuModal/FutureMenuModal';
import FutureHeader from '../../components/futureHeader/FutureHeader';
import Lobby from '../../components/lobby/Lobby';
import Help from '../../components/help/Help';

const socket = io.connect("http://localhost:5000");

/*
let location = useLocation();
const gameCode = location.state.code;


const socket = io.connect("http://localhost:5000")
*/

export default function Game() {
    let location = useLocation();
    const gameCode = location.state.code;
    const isHost = location.state.isHost;
    const gameSettings = location.state.settings;

    const userToken = useSelector((state) => state.userToken);

    const [currentWindowName, setCurrentWindowName] = useState("");
    const [previousWindowName, setPreviousWindowName] = useState("");
    const [backButtonTitle, setBackButtonTitle] = useState("Return To Lobby");

    const [gamePlayers, setGamePlayers] = useState([]);
    const [isMenuModalOpened, setIsMenuModalOpened] = useState(false);

    useEffect(() => {
        socket.on('lobby:update-players', (lobbyPlayers) => {
            setGamePlayers(lobbyPlayers);
        });
    }, [socket]);

    socket.emit("join-game", gameCode, userToken);

    function handleBackButtonClick() {

    }

    function handleMenuButtonClick() {
        setIsMenuModalOpened(true);
    }

    function handleViewHelpClick() {
        setPreviousWindowName(currentWindowName);
        setCurrentWindowName("Help");
    }

    function handleViewLobbyClick() {
        setPreviousWindowName(currentWindowName);
        setCurrentWindowName("Lobby");
    }

    function handleRemovePlayerClick(playerIndex) {
        socket.emit('lobby:kick-player', playerIndex);
    }

    function handleStartGameButtonClick() {
        socket.emit('game:start');
    }

    function handleCloseLobbyButtonClick() {
        socket.emit('lobby:close');
    }

    switch (currentWindowName) {
        case "Help":
            return (
                <>
                    {previousWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={`Return To ${previousWindowName}`} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} />}
                    <Help settings={gameSettings} />
                </>
            );
        case "Role":
            return (
                <>
                    {previousWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={`Return To ${previousWindowName}`} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} />}
                    <Help settings={gameSettings} />
                </>
            );
        case "Game":
            return (
                <>
                    {previousWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={`Return To ${previousWindowName}`} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} />}
                    <Help settings={gameSettings} />
                </>
            );
        default: 
            return (
                <>
                    {previousWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={`Return To ${previousWindowName}`} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && 
                        <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} handleViewHelpClick={handleViewHelpClick}
                            handleViewLobbyClick={handleViewLobbyClick} viewLobbyText={} viewRoleEnabled={}
                            handleViewRoleClick={} viewRoleText={} viewGameEnabled={} handleViewGameClick={} viewGameText={}
                        />
                    }
                    <Lobby gameCode={gameCode} isHost={isHost} players={gamePlayers} handleRemovePlayerClick={handleRemovePlayerClick}
                        handleStartGameButtonClick={handleStartGameButtonClick} handleCloseLobbyButtonClick={handleCloseLobbyButtonClick} />
                </>
            )
    }
}
