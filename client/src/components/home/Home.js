import React, {useState} from 'react';
import { useLocation, useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import FutureHeader from '../common/futureHeader/FutureHeader';
import FutureButton from '../common/futureButton/FutureButton';
import FutureInputButton from '../common/futureInputButton/FutureInputButton';
import FutureTextInput from '../common/futureTextInput/FutureTextInput';
import FutureTitleBoxed from '../common/futureTitleBoxed/FutureTitleBoxed';
import FutureSettingRow from '../common/futureSettingRow/FutureSettingRow';
import Error from './error/Error';

export default function Home() {
    const dispatch = useDispatch();
    let location = useLocation();
    const navigate = useNavigate();

    const userToken = useSelector((state) => state.userToken);
    //navigate("/draft", { state: { overallSets: overallSets, positionSets: positionSets } });

    const [searchParams] = useSearchParams();
    const [currenMenuName, setCurrentMenuName] = useState(searchParams.get('menu'));

    const [errors, setErrors] = useState(location?.state?.errors);

    const [enteredGameCode, setEnteredGameCode] = useState("");

    const [ectorLocalEnabled, setEctorLocalEnabled] = useState(false);
    const [kayLocalEnabled, setKayLocalEnabled] = useState(false);
    const [lamorakLocalEnabled, setLamorakLocalEnabled] = useState(false);
    const [titaniaLocalEnabled, setTitaniaLocalEnabled] = useState(false);
    const [accolonLocalEnabled, setAccolonLocalEnabled] = useState(true);

    const [ectorOnlineEnabled, setEctorOnlineEnabled] = useState(false);
    const [kayOnlineEnabled, setKayOnlineEnabled] = useState(false);
    const [lamorakOnlineEnabled, setLamorakOnlineEnabled] = useState(false);
    const [titaniaOnlineEnabled, setTitaniaOnlineEnabled] = useState(false);
    const [accolonOnlineEnabled, setAccolonOnlineEnabled] = useState(true);
    const [sirRobinOnlineEnabled, setSirRobinOnlineEnabled] = useState(false);
    const [resistanceBindOnlineEnabled, setResistanceBindOnlineEnabled] = useState(false);
    const [spyBindOnlineEnabled, setSpyBindOnlineEnabled] = useState(false);

    const [joinGameButtonDisabled, setJoinGameButtonDisabled] = useState(true);

    function handleProfileButtonClick() {
        navigate("/profile");
    }

    function handleStatsButtonClick() {
        navigate("/stats");
    }

    function handleNewGameButtonClick() {
        setCurrentMenuName("new");
    }

    function handleJoinGameButtonClick() {
        setCurrentMenuName("join");
    }

    function handleSignOutButtonClick() {
        navigate("/login");
    }

    function handleBackButtonClick(previousMenu) {
        if (errors) {
            setErrors(null);
        }
        setCurrentMenuName(previousMenu);
    }

    function handleGameCodeChange(e) {
        setEnteredGameCode(e.target.value);
        let p = e.target.selectionStart;
        const normalizedValue = e.target.value.toUpperCase();
        setEnteredGameCode(normalizedValue);
        e.target.setSelectionRange(p, p);
        setJoinGameButtonDisabled(normalizedValue.length !== 4);
    }

    function handleJoinGameSubmit(e) {
        e.preventDefault();
        navigate({
            pathname: "/game",
            search: createSearchParams({code: enteredGameCode}).toString()
        });
    }

    function handleNewLocalGameButtonClick() {
        setCurrentMenuName("newLocal");
    }

    function handleNewOnlineGameButtonClick() {
        setCurrentMenuName("newOnline");
    }

    function handleSettingClick(setting, value) {
        switch (setting) {
            case "ectorLocal":
                setEctorLocalEnabled(value);
                break;
            case "kayLocal":
                setKayLocalEnabled(value);
                break;
            case "lamorakLocal":
                setLamorakLocalEnabled(value);
                break;
            case "titaniaLocal":
                setTitaniaLocalEnabled(value);
                break;
            case "accolonLocal":
                setAccolonLocalEnabled(value);
                break;
            case "ectorOnline":
                setEctorOnlineEnabled(value);
                break;
            case "kayOnline":
                setKayOnlineEnabled(value);
                break;
            case "lamorakOnline":
                setLamorakOnlineEnabled(value);
                break;
            case "titaniaOnline":
                setTitaniaOnlineEnabled(value);
                break;
            case "accolonOnline":
                setAccolonOnlineEnabled(value);
                break;
            case "sirRobinOnline":
                setSirRobinOnlineEnabled(value);
                break;
            case "resistanceBindOnline":
                setResistanceBindOnlineEnabled(value);
                break;
            case "spyBindOnline":
                setSpyBindOnlineEnabled(value);
                break;
        }
    }

    function handleCreateLocalGameSubmit(e) {
        e.preventDefault();
        const gameSettings = {
            type: "local",
            ector: ectorLocalEnabled,
            kay: kayLocalEnabled,
            lamorak: lamorakLocalEnabled,
            titania: titaniaLocalEnabled,
            accolon: accolonLocalEnabled
        };
        const authorization = "Basic " + btoa(userToken.firstName+":"+userToken.lastName+":"+userToken.userId);
        axios.request({
            method: "post",
            url: "http://localhost:5000/api/game",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            data: JSON.stringify(gameSettings)
        }).then(response => {
            if (response.data.code) {
                navigate({
                    pathname: "/game",
                    search: createSearchParams({code: response.data.code}).toString()
                });
            }
        });
    }

    function handleCreateOnlineGameSubmit(e) {
        e.preventDefault();
        const gameSettings = {
            type: "online",
            ector: ectorOnlineEnabled,
            kay: kayOnlineEnabled,
            lamorak: lamorakOnlineEnabled,
            titania: titaniaOnlineEnabled,
            accolon: accolonOnlineEnabled
        };
        const authorization = "Basic " + btoa(userToken.firstName+":"+userToken.lastName+":"+userToken.userId);
        axios.request({
            method: "post",
            url: "http://localhost:5000/api/game",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            data: JSON.stringify(gameSettings)
        }).then(response => {
            if (response.data.code) {
                navigate({
                    pathname: "/game",
                    search: createSearchParams({code: response.data.code}).toString()
                });
            }
        });
    }

    switch (currenMenuName) {
        case 'new':
            return (
                <>
                    <FutureTitleBoxed />
                    <div className="FlexColumn">
                        <FutureButton onClick={handleNewLocalGameButtonClick} disabled={false} text="New Local Game" />
                        <FutureButton onClick={handleNewOnlineGameButtonClick} disabled={false} text="New Online Game" />
                        <FutureButton onClick={() => handleBackButtonClick("")} disabled={false} text="Back" />
                    </div>
                </>
            );
        case 'newLocal':
            return (
                <>
                    <FutureTitleBoxed />
                    <div className="FlexColumn">
                        <form className="FutureForm" onSubmit={handleCreateLocalGameSubmit}>
                            <div className="CenterFlexColumn">
                                <FutureSettingRow name="ectorLocal" text="Ector:" checked={ectorLocalEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="kayLocal" text="Kay:" checked={kayLocalEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="lamorakLocal" text="Lamorak:" checked={lamorakLocalEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="titaniaLocal" text="Titania:" checked={titaniaLocalEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="accolonLocal" text="Accolon:" checked={accolonLocalEnabled} handleSettingClick={handleSettingClick} />
                            </div>
                            <FutureInputButton text="Create Game" disabled={false}/>
                        </form>
                        <FutureButton onClick={() => handleBackButtonClick("new")} disabled={false} text="Back" />
                    </div>
                </>
            );
        case 'newOnline':
            return (
                <>
                    <FutureTitleBoxed />
                    <div className="FlexColumn">
                        <form className="FutureForm" onSubmit={handleCreateOnlineGameSubmit}>
                            <div className="CenterFlexColumn">
                                <FutureSettingRow name="ectorOnline" text="Ector:" checked={ectorOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="kayOnline" text="Kay:" checked={kayOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="lamorakOnline" text="Lamorak:" checked={lamorakOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="titaniaOnline" text="Titania:" checked={titaniaOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="accolonOnline" text="Accolon:" checked={accolonOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="sirRobinOnline" text="Sir Robin:" checked={sirRobinOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="resistanceBindOnline" text="Resistance Bind:" checked={resistanceBindOnlineEnabled} handleSettingClick={handleSettingClick} />
                                <FutureSettingRow name="spyBindOnline" text="Spy Bind:" checked={spyBindOnlineEnabled} handleSettingClick={handleSettingClick} />
                            </div>
                            <FutureInputButton text="Create Game" disabled={false}/>
                        </form>
                        <FutureButton onClick={() => handleBackButtonClick("new")} disabled={false} text="Back" />
                    </div>
                </>
            );
        case "join":
            return (
                <>
                    <FutureTitleBoxed />
                    {errors &&
                        <Error errors={errors} />
                    }
                    <div className="FlexColumn">
                        <form className="FutureForm" onSubmit={handleJoinGameSubmit}>
                            <FutureTextInput onChange={handleGameCodeChange} placeholder="Enter Game Code" maxLength="4" required={true} text={enteredGameCode} />
                            <FutureInputButton text="Join Game" disabled={joinGameButtonDisabled}/>
                        </form>
                        <FutureButton onClick={() => handleBackButtonClick("")} disabled={false} text="Back" />
                    </div>
                </>
            );
        default:
            /*
                        <FutureButton onClick={handleProfileButtonClick} disabled={false} text="Profile" />
                        <FutureButton onClick={handleStatsButtonClick} disabled={false} text="Stats" />
            */
            return (
                <>
                    <FutureTitleBoxed />
                    <div className="FlexColumn">
                        <FutureButton onClick={handleNewGameButtonClick} disabled={false} text="New Game" />
                        <FutureButton onClick={handleJoinGameButtonClick} disabled={false} text="Join Game" />
                        <FutureButton onClick={handleSignOutButtonClick} disabled={false} text="Sign Out" />
                    </div>
                </>
            );
    }
}
