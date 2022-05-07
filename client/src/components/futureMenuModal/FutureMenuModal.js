import React from 'react';

import FutureButton from '../futureButton/FutureButton';

import styles from './FutureMenuModal.module.scss';

export default function FutureMenuModal({setIsMenuModalOpened, handleViewHelpClick, handleViewLobbyClick, viewLobbyText,
    viewRoleEnabled, handleViewRoleClick, viewRoleText, viewGameEnabled, handleViewGameClick, viewGameText}) {
    /*
    <button class="future-button" type="button" id="view-lobby-button">Return To Lobby</button>
    <button class="future-button" type="button" id="view-role-button">View Role</button>
    <button class="future-button" type="button" id="view-game-button">Return To Game</button>
    */
    return (
        <div className={styles.FutureMenuModal} onClick={(e) => {if (e.target == this) {setIsMenuModalOpened(false);}}}>
            <div className={styles.FutureMenuModalContent}>
                <button class="close-modal-button" id="close-menu-modal-button" title="Close Menu">&times;</button>
                <div className={styles.FutureMenuModalBody}>
                    <FutureButton onClick={handleViewHelpClick} disabled={false} text="View Help" />
                    <FutureButton onClick={handleViewLobbyClick} disabled={false} text={viewLobbyText} />
                    {viewRoleEnabled &&
                        <FutureButton onClick={handleViewRoleClick} disabled={false} text={viewRoleText} />
                    }
                    {viewGameEnabled &&
                        <FutureButton onClick={handleViewGameClick} disabled={false} text={viewGameText} />
                    }
                </div>
            </div>
        </div>
    )
}
