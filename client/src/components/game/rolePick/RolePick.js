import React, { useEffect, useState } from 'react';

import FutureButton from '../../common/futureButton/FutureButton';
import FutureTitle from '../../common/futureTitle/FutureTitle';

export default function RolePick({possibleResistanceRoles, possibleSpyRoles, handleRolePickSubmit}) {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [roleSelected, setRoleSelected] = useState("none");

    useEffect(() => {
        setSubmitDisabled(roleSelected === "none");
    }, [roleSelected]);

    function handleSelectOnChange(e) {
        setRoleSelected(e.target.value);
    }

    function handleSubmitClick() {
        const rolePickInformation = {
            value: roleSelected
        }
        if (roleSelected === "Resistance" || roleSelected === "Spy") {
            rolePickInformation.type = "Team";
        } else {
            rolePickInformation.type = "Role";
        }
        handleRolePickSubmit(rolePickInformation);
    }

    if (possibleResistanceRoles) {
        return (
            <>
                <FutureTitle text="Congratulations, you may select your role/team for this game!" />
                <select onChange={handleSelectOnChange}>
                    <option value="none" selected disabled/>
                    <option value="Resistance">Resistance</option>
                    {possibleResistanceRoles.map((role, roleIndex) => {
                        return <option key={roleIndex} value={role}>(Resistance) {role}</option>
                    })}
                    <option value="Spy">Spy</option>
                    {possibleSpyRoles.map((role, roleIndex) => {
                        return <option key={roleIndex} value={role}>(Spy) {role}</option>
                    })}
                </select>
                <FutureButton onClick={handleSubmitClick} disabled={submitDisabled} text="Submit" />
            </>
        )
    }

    return (
        <FutureTitle text="Waiting for role information..." />
    )
}
