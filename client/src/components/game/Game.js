import React, { useEffect, useState, useRef } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import axios from 'axios';
import io from 'socket.io-client';

import FutureButton from '../common/futureButton/FutureButton';
import FutureLeftCircleButton from '../common/futureLeftCircleButton/FutureLeftCircleButton';
import FutureRightCircleMenuButton from '../common/futureRightCircleMenuButton/FutureRightCircleMenuButton';
import FutureMenuModal from '../common/futureMenuModal/FutureMenuModal';
import FutureHeader from '../common/futureHeader/FutureHeader';
import Lobby from '../lobby/Lobby';
import Help from '../help/RoleHelp';
import Local from './local/Local';
import ConductRedemption from './conductRedemption/ConductRedemption';
import ConductAssassination from './conductAssassination/ConductAssassination';
import Result from './result/Result';
import RolePick from './rolePick/RolePick';

import './game.scss';

//const ROOT_URL = "http://localhost:5000";
const ROOT_URL = "https://www.extavalon.com";

/*
let location = useLocation();
const gameCode = location.state.code;


const socket = io.connect("http://localhost:5000")
*/

export default function Game() {
    const navigate = useNavigate();

    const userToken = useSelector((state) => state.userToken);

    const [searchParams] = useSearchParams();
    const gameCode = searchParams.get('code');

    const [isHost, setIsHost] = useState(undefined);
    const [gameType, setGameType] = useState(undefined);
    const [gameSettings, setGameSettings] = useState(undefined);

    const isHostRef = useRef(undefined);
    isHostRef.current = isHost;
    const gameTypeRef = useRef();
    gameTypeRef.current = gameType;

    const [currentWindowName, setCurrentWindowName] = useState("Lobby");
    const [currentPrimaryWindowName, setCurrentPrimaryWindowName] = useState("Lobby");
    const [isMenuModalOpened, setIsMenuModalOpened] = useState(false);

    const [backButtonTitle, setBackButtonTitle] = useState("Return To Lobby");
    const [viewLobbyText, setViewLobbyText] = useState("Return To Lobby");
    const [viewRoleText, setViewRoleText] = useState("View Role");
    const [viewGameText, setViewGameText] = useState("View Game");

    const [gamePlayers, setGamePlayers] = useState([]);
    const [roleContent, setRoleContent] = useState(null);
    const [gameContent, setGameContent] = useState(null);

    const gameSocketRef = useRef(null);

    function handleBackButtonClick() {
        setCurrentWindowName(currentPrimaryWindowName);
    }

    function handleMenuButtonClick() {
        setIsMenuModalOpened(true);
    }

    function handleViewHelpClick() {
        setIsMenuModalOpened(false);
        setCurrentWindowName("Help");
    }

    function handleViewLobbyClick() {
        setIsMenuModalOpened(false);
        setCurrentWindowName("Lobby");
    }

    function handleViewRoleClick() {
        setIsMenuModalOpened(false);
        setCurrentWindowName("Role");
    }

    function handleViewGameClick() {
        setIsMenuModalOpened(false);
        setCurrentWindowName("Game");
    }

    function handleRemovePlayerClick(playerIndex) {
        gameSocketRef.current.emit('lobby:kick-player', playerIndex);
    }

    function handleStartGameButtonClick() {
        gameSocketRef.current.emit('game:start');
    }

    function handleCloseLobbyButtonClick() {
        gameSocketRef.current.emit('lobby:close');
    }

    function handleRolePickSubmit(rolePickInformation) {
        gameSocketRef.current.emit('role:pick', rolePickInformation);
    }

    function handleResultSubmit(currentMissionResults) {
        gameSocketRef.current.emit('mission:results', currentMissionResults);
    }

    function handleConductRedemptionSubmit(conductRedemptionInformation) {
        gameSocketRef.current.emit('redemption:conduct', conductRedemptionInformation);
    }

    function handleConductAssassinationSubmit(conductAssassinationInformation) {
        gameSocketRef.current.emit('assassination:conduct', conductAssassinationInformation);
    }

    useEffect(() => {

        const authorization = "Basic " + btoa(userToken.firstName+":"+userToken.lastName+":"+userToken.userId);
        axios.request({
            method: "get",
            url: `/api/game`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            params: {
                code: gameCode
            }
        }).then(response => {
            setIsHost(response.data.host === userToken.userId);
            
            setGameType(response.data.type);
            setGameSettings(response.data.settings);

            const socket = io.connect(`${ROOT_URL}?code=${gameCode}&userId=${userToken.userId}&firstName=${userToken.firstName}&lastName=${userToken.lastName}`, {path: '/api/socket.io'});

            socket.on('lobby:update-players', (lobbyPlayers) => {
                setGamePlayers(lobbyPlayers);
            });

            socket.on('lobby:close', () => {
                if (isHostRef.current) {
                    if (gameTypeRef.current === 'online') {
                        navigate({
                            pathname: "/",
                            search: createSearchParams({menu: 'newOnline'}).toString()
                        });
                    } else {
                        navigate({
                            pathname: "/",
                            search: createSearchParams({menu: 'newLocal'}).toString()
                        });
                    }
                } else {
                    navigate({
                        pathname: "/",
                        search: createSearchParams({menu: 'join'}).toString()
                    });
                }
            });
    
            socket.on('role:setup', () => {
                setGameContent(
                    <RolePick/>
                );
                setCurrentPrimaryWindowName("Game");
                setCurrentWindowName("Game");
            });

            socket.on('role:pick', ({possibleResistanceRoles, possibleSpyRoles}) => {
                setGameContent(
                    <RolePick possibleResistanceRoles={possibleResistanceRoles} possibleSpyRoles={possibleSpyRoles} handleRolePickSubmit={handleRolePickSubmit}/>
                );
                setCurrentPrimaryWindowName("Game");
                setCurrentWindowName("Game");
            });

            socket.on('role:assign', (roleHTML) => {
                setGameContent(null);
                setRoleContent(roleHTML);
                if (gameTypeRef.current === "local") {
                    setCurrentPrimaryWindowName("Role");
                    setCurrentWindowName("Role");
                }
            });

            socket.on('game:setup', (firstLeaderName) => {
                setGameContent(
                    <Local firstLeaderName={firstLeaderName} handleResultSubmit={handleResultSubmit} />
                );
                setCurrentPrimaryWindowName("Game");
            });

            socket.on('redemption:conduct', (conductRedemptionInformation) => {
                setGameContent(
                    <ConductRedemption conductRedemptionInformation={conductRedemptionInformation} handleConductRedemptionSubmit={handleConductRedemptionSubmit}/>
                );
                setCurrentPrimaryWindowName("Game");
                setCurrentWindowName("Game");
            });

            socket.on('assassination:conduct', (conductAssassinationInformation) => {
                setGameContent(
                    <ConductAssassination conductAssassinationInformation={conductAssassinationInformation} handleConductAssassinationSubmit={handleConductAssassinationSubmit}/>
                );
                setCurrentPrimaryWindowName("Game");
                setCurrentWindowName("Game");
            });

            socket.on('game:result', (gameResultInformation) => {
                setGameContent(
                    <Result gameResultInformation={gameResultInformation}/>
                );
                setCurrentPrimaryWindowName("Game");
                setCurrentWindowName("Game");
            });

            gameSocketRef.current = socket;
        }).catch(error => {
            navigate(
                {
                    pathname: "/",
                    search: createSearchParams({menu: 'join'}).toString()                
                },
                {
                    state: { errors: [error.response.data.error] }
                }
            );
        });
    }, []);

    useEffect(() => {
        switch(currentPrimaryWindowName) {
            case "Role":
                setBackButtonTitle("Return To Role");
                setViewLobbyText("View Lobby");
                setViewRoleText("Return To Role");
                if (gameContent) {
                    setViewGameText("View Game");
                } else {
                    setViewGameText();
                }
                break;
            case "Game":
                setBackButtonTitle("Return To Game");
                setViewLobbyText("View Lobby");
                if (roleContent) {
                    setViewRoleText("View Role");
                } else {
                    setViewRoleText();
                }
                setViewGameText("Return To Game");
                break;
            default:
                setBackButtonTitle("Return To Lobby");
                setViewLobbyText("Return To Lobby");
                if (roleContent) {
                    setViewRoleText("View Role");
                } else {
                    setViewRoleText();
                }
                if (gameContent) {
                    setViewGameText("View Game");
                } else {
                    setViewGameText();
                }
                break;
        }
    }, [currentPrimaryWindowName]);

    switch (currentWindowName) {
        case "Help":
            return (
                <>
                    {currentWindowName !== currentPrimaryWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={backButtonTitle} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && 
                        <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} handleViewHelpClick={handleViewHelpClick}
                            handleViewLobbyClick={handleViewLobbyClick} viewLobbyText={viewLobbyText} handleViewRoleClick={handleViewRoleClick}
                            viewRoleText={viewRoleText} handleViewGameClick={handleViewGameClick} viewGameText={viewGameText}
                        />
                    }
                    <Help settings={gameSettings} />
                </>
            );
        case "Role":
            return (
                <>
                    {currentWindowName !== currentPrimaryWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={backButtonTitle} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && 
                        <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} handleViewHelpClick={handleViewHelpClick}
                            handleViewLobbyClick={handleViewLobbyClick} viewLobbyText={viewLobbyText} handleViewRoleClick={handleViewRoleClick}
                            viewRoleText={viewRoleText} handleViewGameClick={handleViewGameClick} viewGameText={viewGameText}
                        />
                    }
                    {roleContent != null &&
                        <div className="CenterFlexColumn" id="RoleContent" dangerouslySetInnerHTML={{ __html: roleContent }} />
                    }
                </>
            );
        case "Game":
            return (
                <>
                    {currentWindowName !== currentPrimaryWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={backButtonTitle} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && 
                        <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} handleViewHelpClick={handleViewHelpClick}
                            handleViewLobbyClick={handleViewLobbyClick} viewLobbyText={viewLobbyText} handleViewRoleClick={handleViewRoleClick}
                            viewRoleText={viewRoleText} handleViewGameClick={handleViewGameClick} viewGameText={viewGameText}
                        />
                    }
                    <div className="CenterFlexColumn" id="GameContent">
                        {gameContent}
                    </div>
                </>
            );
        default: 
            return (
                <>
                    {currentWindowName !== currentPrimaryWindowName &&
                        <FutureLeftCircleButton onClick={handleBackButtonClick} title={backButtonTitle} />
                    }
                    <FutureRightCircleMenuButton onClick={handleMenuButtonClick} title="Open Menu" />
                    {isMenuModalOpened && 
                        <FutureMenuModal setIsMenuModalOpened={setIsMenuModalOpened} handleViewHelpClick={handleViewHelpClick}
                            handleViewLobbyClick={handleViewLobbyClick} viewLobbyText={viewLobbyText} handleViewRoleClick={handleViewRoleClick}
                            viewRoleText={viewRoleText} handleViewGameClick={handleViewGameClick} viewGameText={viewGameText}
                        />
                    }
                    <Lobby gameCode={gameCode} isHost={isHost} players={gamePlayers} handleRemovePlayerClick={handleRemovePlayerClick}
                        handleStartGameButtonClick={handleStartGameButtonClick} handleCloseLobbyButtonClick={handleCloseLobbyButtonClick} />
                </>
            )
    }
}
