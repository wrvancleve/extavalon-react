import React, {useState} from 'react';

import FutureButton from '../../common/futureButton/FutureButton';
import FutureHeader from '../../common/futureHeader/FutureHeader';

export default function Local({firstLeaderName, handleResultSubmit}) {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [currentMissionResults, setCurrentMissionResults] = useState([null, null, null, null, null]);

    useEffect(() => {
        setSubmitDisabled(getMissionsWinner() === null);
        if (getMissionsWinner() !== null) {

            submitMissionResultsButton.onclick = function () {
                socket.emit('mission:results', currentMissionResults);
            };
            setButtonDisabled(submitMissionResultsButton, false);
        } else {
            submitMissionResultsButton.removeAttribute("onclick");
            setButtonDisabled(submitMissionResultsButton, true);
        }
    }, [currentMissionResults]);

    function handleMissionResultChange(mission, result) {
        const newMissionResults = [...currentMissionResults];
        newMissionResults[mission] = result;
        setCurrentMissionResults(newMissionResults);
    }

    function getMissionsWinner() {
        let resistanceWins = 0;
        let spyWins = 0;
        for (let missionWinner of currentMissionResults) {
            if (missionWinner === "Resistance") {
                if (resistanceWins === 3 || spyWins === 3) {
                    return null;
                } else {
                    resistanceWins += 1;
                }
            } else if (missionWinner === "Spies") {
                if (resistanceWins === 3 || spyWins === 3) {
                    return null;
                } else {
                    spyWins += 1;
                }
            } else if (resistanceWins !== 3 && spyWins !== 3) {
                return null;
            }
        }
        return resistanceWins === 3 ? "Resistance" : "Spies";
    }

    function handleSubmitClick() {
        setSubmitDisabled(true);
        handleResultSubmit(currentMissionResults);
    }

    return (
        <>
            <FutureHeader headerType="h2" text={`First Leader: ${firstLeaderName}`} />
            <div className="CenterFlexRow">
                <label for="MissionOneResultSelect">Mission 1 Winner:</label>
                <select id="MissionOneResultSelect" onChange={(e) => handleMissionResultChange(0, e.target.value)}>
                    <option value="none" disabled />
                    <option value="Resistance">Resistance</option>
                    <option value="Spies">Spies</option>
                </select>
            </div>
            <div className="CenterFlexRow">
                <label for="MissionTwoResultSelect">Mission 2 Winner:</label>
                <select id="MissionTwoResultSelect" onChange={(e) => handleMissionResultChange(1, e.target.value)}>
                    <option value="none" disabled />
                    <option value="Resistance">Resistance</option>
                    <option value="Spies">Spies</option>
                </select>
            </div>
            <div className="CenterFlexRow">
                <label for="MissionThreeResultSelect">Mission 3 Winner:</label>
                <select id="MissionThreeResultSelect" onChange={(e) => handleMissionResultChange(2, e.target.value)}>
                    <option value="none" disabled />
                    <option value="Resistance">Resistance</option>
                    <option value="Spies">Spies</option>
                </select>
            </div>
            <div className="CenterFlexRow">
                <label for="MissionFourResultSelect">Mission 4 Winner:</label>
                <select id="MissionFourResultSelect" onChange={(e) => handleMissionResultChange(3, e.target.value)}>
                    <option value="none" />
                    <option value="Resistance">Resistance</option>
                    <option value="Spies">Spies</option>
                </select>
            </div>
            <div className="CenterFlexRow">
                <label for="MissionFiveResultSelect">Mission 5 Winner:</label>
                <select id="MissionFiveResultSelect" onChange={(e) => handleMissionResultChange(4, e.target.value)}>
                    <option value="none" />
                    <option value="Resistance">Resistance</option>
                    <option value="Spies">Spies</option>
                </select>
            </div>
            <FutureButton onClick={handleSubmitClick} disabled={submitDisabled} text="Submit" />
        </>
    )
}
