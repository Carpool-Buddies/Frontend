import {BASE_API_URL} from "../../config/environment";

export const getServerStatus = async () => {
    // TODO: implement when available on backend
    // try {
    //     const response = await fetch(`${BASE_API_URL}/server_status`, {
    //         method: 'GET',
    //         headers: {'Content-Type': 'application/json', Accept: 'application/json'}
    //     });
    //     return await response.json();
    // } catch (error) {
    //     return false
    // }
    return 1
}

export const register = async (email, password, first_name, last_name, phone_number, birthday) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                phone_number: phone_number,
                birthday: birthday.format('YYYY-MM-DD')
            })
        });
        return await response.json();
    } catch (error) {
        return 'error'
    }
};

export const login = async (username, password) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            body: JSON.stringify({
                email: username,
                password: password
            })
        });
        return await response.json();
    } catch (error) {
        return error
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

export const getAddress = async (addressText) => {
    const apiKey = '663e40e401c53715963317sdt785944'
    try {
        const response = await fetch('https://geocode.maps.co/search?q=' + addressText + '&api_key=' + apiKey)
        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }
        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.error('Error fetching address:', error);
        // Handle error appropriately
        return null;
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