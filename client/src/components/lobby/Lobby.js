import React from 'react';

import FutureButton from '../futureButton/FutureButton';
import FutureHeader from '../futureHeader/FutureHeader';
import LobbyPlayers from '../lobbyPlayers/LobbyPlayers';

import './Lobby.module.scss';

export default function Lobby({gameCode, isHost, players, handleRemovePlayerClick, handleStartGameButtonClick, handleCloseLobbyButtonClick}) {
    return (
        <div className="CenterFlexColumn" id="LobbyContent">
            <FutureHeader headerType="h1" text={`Game Code: ${gameCode}`} />
            <LobbyPlayers isHost={isHost} players={players} handleRemovePlayerClick={handleRemovePlayerClick} />
            {isHost &&
                <>
                    <FutureButton onClick={handleStartGameButtonClick} disabled={gamePlayers.length < 5} text="Start Game" />
                    <FutureButton onClick={handleCloseLobbyButtonClick} disabled={false} text="Close Lobby" />
                </>
            }
        </div>
    )
}
