import React from 'react';

import MenuButton from '../../components/MenuButton';

export default function MainMenu() {
    //const navigate = useNavigate();
    //navigate("/draft", { state: { overallSets: overallSets, positionSets: positionSets } });

    function handleProfileButtonClick() {
        
    }

    function handleStatsButtonClick() {
        
    }

    function handleNewGameButtonClick() {
        
    }

    function handleJoinGameButtonClick() {
        
    }

    function handleSignOutButtonClick() {

    }

    return (
        <>
            <h1 className="FutureTitleBoxed">extavalon</h1>
            <MenuButton className="future-button" onClick={handleProfileButtonClick} disabled={false} text="Profile" />
            <MenuButton className="future-button" onClick={handleStatsButtonClick} disabled={false} text="Stats" />
            <MenuButton className="future-button" onClick={handleNewGameButtonClick} disabled={false} text="New Game" />
            <MenuButton className="future-button" onClick={handleJoinGameButtonClick} disabled={false} text="Join Game" />
            <MenuButton className="future-button" onClick={handleSignOutButtonClick} disabled={false} text="Sign Out" />
        </>
    )
}
