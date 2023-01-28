import React, { useEffect, useState, useRef } from 'react';

import FutureButton from '../../common/futureButton/FutureButton';
import FutureHeader from '../../common/futureHeader/FutureHeader';
import SimplePlayerListGroupItem from '../simplePlayerListGroupItem/SimplePlayerListGroupItem';

export default function ConductAssassination({ectorEnabled, conductAssassinationInformation, handleConductAssassinationSubmit}) {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [playerSelections, setPlayerSelections] = useState([]);
    const [assassinationRole, setAssassinationRole] = useState("none");
    const requiredPlayerCountRef = useRef(1);

    const players = conductAssassinationInformation.players;

    useEffect(() => {
        setSubmitDisabled(playerSelections.length !== requiredPlayerCountRef.current || assassinationRole === "none");
    }, [playerSelections, assassinationRole]);

    function handlePlayerClick(playerId) {
        const playerIndex = playerSelections.indexOf(playerId);
        if (playerIndex !== -1) {
            setPlayerSelections([...playerSelections.slice(0, playerIndex), ...playerSelections.slice(playerIndex+1, playerSelections.length)]);
        } else if (playerSelections.length !== requiredPlayerCountRef.current) {
            setPlayerSelections([...playerSelections, playerId]);
        }
    }

    function handleRoleChange(e) {
        const newAssassinationRole = e.target.value;
        requiredPlayerCountRef.current = newAssassinationRole === "Lovers" ? 2 : 1;
        setAssassinationRole(newAssassinationRole);
    }

    function handleSubmitClick() {
        setSubmitDisabled(true);
        handleConductAssassinationSubmit({
            ids: playerSelections,
            role: assassinationRole
        });
    }

    return (
        <>
            <FutureHeader headerType="h2" text="Select role and player(s) to assassinate for:" />
            <div id="AssassinationRoleContainer" className="CenterFlexRow">
                <label for="AssassinationRoleSelect">Role:</label>
                <select id="AssassinationRoleSelect" onChange={handleRoleChange}>
                    <option value="none" selected disabled/>
                    <option value="Merlin">Merlin</option>
                    <option value="Arthur">Arthur</option>
                    <option value="Lovers">Tristan & Iseult</option>
                    {ectorEnabled &&
                        <option value="Ector">Ector</option>
                    }
                </select>
            </div>
            <div id="AssassinationPlayersContainer">
                <div id="AssassinationPlayersListGroup" className="ListGroup">
                    {players.map((player) => {
                        return <SimplePlayerListGroupItem key={player.id} player={player} selected={playerSelections.includes(player.id)} handlePlayerClick={handlePlayerClick} />
                    })}              
                </div>
            </div>
            <FutureButton onClick={handleSubmitClick} disabled={submitDisabled} text="Submit" />
        </>
    )
}
