import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TextInput from '../../components/TextInput';
import { getUserToken } from './redux/userToken/UserTokenSlice';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);

    function handleFirstNameChange(e) {
        setFirstName(e.target.value);
        handleNameCheck();
    }

    function handleLastNameChange(e) {
        setLastName(e.target.value);
        handleNameCheck();
    }

    function handleNameCheck() {
        const nameRegex = /^[a-z ,.'-]{2,16}$/i;
        const firstNameCheck = firstNameInput.trim().match(nameRegex);
        const lastNameCheck = lastNameInput.trim().match(nameRegex);
        setDisableSubmit(!firstNameCheck || !lastNameCheck);
    }
 
    const handleLoginSubmit = async e => {
        e.preventDefault();
        if (!disableSubmit) {
            dispatch(getUserToken({firstName, lastName}));
            navigate("/");
        }
    }

    return (
        <>
            <form onSubmit={handleLoginSubmit}>
                <TextInput className="FutureInput" onChange={handleFirstNameChange} placeholder="Enter First Name" maxlength="16" required={true} text={firstName} />
                <TextInput className="FutureInput" onChange={handleLastNameChange} placeholder="Enter Last Name" maxlength="16" required={true} text={lastName} />
                {disableSubmit
                    ?
                        <input className="FutureButton FutureButtonDisabled" type="submit" disabled>Submit</input>
                    :
                        <input className="FutureButton" type="submit">Submit</input>
                }
            </form>
        </>
    )
}
