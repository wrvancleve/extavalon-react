import React from 'react';

import FutureButton from '../common/futureButton/FutureButton';
import FutureHeader from '../common/futureHeader/FutureHeader';
import LobbyPlayers from './lobbyPlayers/LobbyPlayers';

import './lobby.scss';

export default function Lobby({gameCode, isHost, players, handleRemovePlayerClick, handleStartGameButtonClick, handleCloseLobbyButtonClick}) {
    return (
        <div className="CenterFlexColumn" id="LobbyContent">
            <FutureHeader headerType="h1" text={`Game Code: ${gameCode}`} />
            <LobbyPlayers isHost={isHost} players={players} handleRemovePlayerClick={handleRemovePlayerClick} />
            {isHost &&
                <>
                    <FutureButton onClick={handleStartGameButtonClick} disabled={players.length < 5} text="New Game" />
                    <FutureButton onClick={handleCloseLobbyButtonClick} disabled={false} text="Close Lobby" />
                </>
            }
        </div>
    )
}
