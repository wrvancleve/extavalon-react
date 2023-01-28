import React, { useEffect, useState } from 'react';

import FutureButton from '../../common/futureButton/FutureButton';
import FutureHeader from '../../common/futureHeader/FutureHeader';
import SimplePlayerListGroupItem from '../simplePlayerListGroupItem/SimplePlayerListGroupItem';

export default function ConductRedemption({conductRedemptionInformation, handleConductRedemptionSubmit}) {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [playerSelections, setPlayerSelections] = useState([]);

    const players = conductRedemptionInformation.players;
    const requiredPlayerCount = conductRedemptionInformation.spyCount;

    useEffect(() => {
        setSubmitDisabled(playerSelections.length !== requiredPlayerCount);
    }, [playerSelections]);

    function handlePlayerClick(playerId) {
        const playerIndex = playerSelections.indexOf(playerId);
        if (playerIndex !== -1) {
            setPlayerSelections([...playerSelections.slice(0, playerIndex), ...playerSelections.slice(playerIndex+1, playerSelections.length)]);
        } else if (playerSelections.length !== requiredPlayerCount) {
            setPlayerSelections([...playerSelections, playerId]);
        }
    }

    function handleSubmitClick() {
        setSubmitDisabled(true);
        handleConductRedemptionSubmit({
            ids: playerSelections
        });
    }

    return (
        <>
            <FutureHeader headerType="h2" text={<>Select the players you think are the <span class="Spy">spies</span></>} />
            <div id="RedemptionPlayersContainer">
                <div id="RedemptionPlayersListGroup" className="ListGroup">
                    {players.map((player) => {
                        return <SimplePlayerListGroupItem key={player.id} player={player} selected={playerSelections.includes(player.id)} handlePlayerClick={handlePlayerClick} />
                    })}              
                </div>
            </div>
            <FutureButton onClick={handleSubmitClick} disabled={submitDisabled} text="Submit" />
        </>
    )
}
