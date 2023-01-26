import React from 'react';

import styles from './SimplePlayerListGroupItem.module.scss';

export default function SimplePlayerListGroupItem({player, selected, handlePlayerClick}) {
    function handlePlayerListGroupItemClick() {
        handlePlayerClick(player.id);
    }

    if (handlePlayerClick) {
        return (
            <div className={selected ? `ListGroupItem Clickable ${styles.Selected}` : "ListGroupItem Clickable"} onClick={handlePlayerListGroupItemClick}>
                <div className="NameWrapper">
                    <p>{player.name}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="ListGroupItem">
                <div className="NameWrapper">
                    <p>{player.name}</p>
                </div>
            </div>
        )
    }
}
