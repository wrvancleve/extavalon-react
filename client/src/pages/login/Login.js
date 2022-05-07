import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FutureInputButton from '../../components/futureInputButton/FutureInputButton';
import FutureTextInput from '../../components/futureTextInput/FutureTextInput';
import FutureTitleBoxed from '../../components/futureTitleBoxed/FutureTitleBoxed';
import { clearUserToken, getUserToken } from '../../redux/userToken/UserTokenSlice';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userToken = useSelector((state) => state.userToken);

    useEffect(() => {
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('userId');
        dispatch(clearUserToken());
    }, [dispatch]);

    useEffect(() => {
        if (userToken.firstName && userToken.lastName && userToken.userId) {
            navigate("/");
        }
    }, [userToken]);

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
        const firstNameCheck = firstName.trim().match(nameRegex);
        const lastNameCheck = lastName.trim().match(nameRegex);
        setDisableSubmit(!firstNameCheck || !lastNameCheck);
    }
 
    const handleLoginSubmit = async e => {
        e.preventDefault();
        if (!disableSubmit) {
            dispatch(getUserToken({firstName, lastName}));
        }
    }

    return (
        <>
            <FutureTitleBoxed />
            <form className="FutureForm" onSubmit={handleLoginSubmit}>
                <FutureTextInput onChange={handleFirstNameChange} placeholder="Enter First Name" maxLength="16" required={true} text={firstName} />
                <FutureTextInput onChange={handleLastNameChange} placeholder="Enter Last Name" maxLength="16" required={true} text={lastName} />
                <FutureInputButton text="Submit" disabled={disableSubmit}/>
            </form>
        </>
    )
}
