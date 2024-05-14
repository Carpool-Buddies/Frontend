import {BASE_API_URL} from "../../config/environment";

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
        const data = await response.json();
        if (!response.ok) {
            if (data && data.msg) {
                return { success: false, error: data.msg };
            } else {
                return { success: false, error: 'Registration failed' };
            }
        }

        return { success: true, data };
    } catch (error) {
        console.log(error);
        return { success: false, error: 'Registration failed' };
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
        const data = await response.json();
        if (!response.ok) {
            if (data && data.msg) {
                console.log("here1");
                return { success: false, error: data.msg };
            } else {
                console.log("here2");
                return { success: false, error: 'Login failed' };
            }
        }

        return { success: true, data };
    } catch (error) {
        console.log("error");
        return { success: false, error: 'Login failed' };
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