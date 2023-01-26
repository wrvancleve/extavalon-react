import React from 'react';

import FutureButton from '../futureButton/FutureButton';

import styles from './FutureMenuModal.module.scss';

export default function FutureMenuModal({setIsMenuModalOpened, handleViewHelpClick, handleViewLobbyClick, viewLobbyText,
    handleViewRoleClick, viewRoleText, handleViewGameClick, viewGameText}) {
    /*
    <button class="future-button" type="button" id="view-lobby-button">Return To Lobby</button>
    <button class="future-button" type="button" id="view-role-button">View Role</button>
    <button class="future-button" type="button" id="view-game-button">Return To Game</button>
    */
    
    function handleCloseModalButtonClick() {
        setIsMenuModalOpened(false);
    }

    return (
        <div className={styles.FutureMenuModal} onClick={(e) => {if (e.target == this) {setIsMenuModalOpened(false);}}}>
            <div className={styles.FutureMenuModalContent}>
                <button className={styles.FutureCloseModalButton} onClick={handleCloseModalButtonClick} title="Close Menu">&times;</button>
                <div className={styles.FutureMenuModalBody}>
                    <FutureButton onClick={handleViewHelpClick} disabled={false} text="View Help" />
                    {viewLobbyText &&
                        <FutureButton onClick={handleViewLobbyClick} disabled={false} text={viewLobbyText} />
                    }
                    {viewRoleText &&
                        <FutureButton onClick={handleViewRoleClick} disabled={false} text={viewRoleText} />
                    }
                    {viewGameText &&
                        <FutureButton onClick={handleViewGameClick} disabled={false} text={viewGameText} />
                    }
                </div>
            </div>
        </div>
    )
}
