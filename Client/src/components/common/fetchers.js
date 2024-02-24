import {BASE_API_URL} from "../../../config/environment";

export const login = async (username, password) => {
    try {
        const response = await fetch(`${BASE_API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            body: JSON.stringify({username: username, password: password})
        });
        return await response.json();
    } catch (error) {
        return 'error'
    }
};

export const logout = async (accessToken) => {
    try {
        const response = await fetch(`${BASE_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        return 'error'
    }
}

export const mystery = async (accessToken) => {
    try {
        const response = await fetch(`${BASE_API_URL}/protected`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        return 'error'
    }
};

export const argsUser = async (arg1, arg2, arg3, arg4) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/use_args?arg1=${arg1}&arg2=${arg2}&arg3=${arg3}&arg4=${arg4}`,
            {
                headers: {"Content-Type": "application/json"}
            })
        return await response.json()
    } catch (e) {
        console.log(e);
        return null
    }
};