import React from 'react';

import FutureHeader from '../../common/futureHeader/FutureHeader';

import styles from './LobbyPlayers.module.scss';

export default function LobbyPlayers({isHost, players, handleRemovePlayerClick}) {
    return (
        <div className={styles.LobbyPlayers}>
            <FutureHeader headerType="h2" text={`Players [${players.length}]`} />
            <div className={styles.LobbyPlayerList}>
                {players.map((player, playerIndex) => {
                    return <div key={playerIndex}>
                        <span className={player.active ? styles.PlayerActive : styles.PlayerInactive}>
                            {player.name}
                        </span>
                        {isHost && !player.active &&
                            <span className={styles.RemovePlayerButton} onClick={() => handleRemovePlayerClick(playerIndex)}>&times;</span>
                        }
                    </div>
                })}
            </div>
        </div>
    )
}
