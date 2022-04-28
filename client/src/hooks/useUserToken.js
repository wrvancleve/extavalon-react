import { useState } from 'react';

export default function useUserToken() {
    const getUserToken = () => {
        const userTokenJson = localStorage.getItem('userToken');
        return JSON.parse(userTokenJson);
    };

    const [userToken, setUserToken] = useState(getUserToken());

    const saveUserToken = token => {
        localStorage.setItem('userToken', JSON.stringify(token));
        setUserToken(token);
    };

    return {
        setUserToken: saveUserToken,
        userToken
    }
}
