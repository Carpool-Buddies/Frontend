import {BASE_API_URL} from "../../config/environment";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from "react-toastify";


// ---------- default ----------

export const getServerStatus = async () => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/ping`);
        return await response.json();
    } catch (error) {
        return false
    }
}

// ---------- auth ----------

export const enterCode = async (code) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/EnterCode`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error entering code:', error);
        return { success: false, msg: 'Failed to enter code' };
    }
};

export const resetPassword = async (password, confirmPassword) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/ForgetPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ password, confirmPassword }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, msg: 'Failed to reset password' };
    }
};

export const getCode = async (email) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/GetCode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 400) {
                toast.error('Bad request: ' + (data.msg || 'Invalid request'));
            } else if (response.status === 503) {
                toast.error('Service is temporarily unavailable. Please try again later.');
            } else {
                toast.error('Failed to get code: ' + (data.msg || 'Unknown error'));
            }
            return { success: false, msg: data.msg || 'Failed to get code' };
        }
        return data;
    } catch (error) {
        console.error('Error getting code:', error);
        toast.error('Failed to get code');
        return { success: false, msg: 'Failed to get code' };
    }
};

export const fetchHome = async (token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/home`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
        if (!response.ok)
            throw new Error('Network response was not ok');
        const data = await response.json();
        return data
    } catch (error) {
        return false
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
                return { success: false, error: data.msg, user: null };
            } else {
                return { success: false, error: 'Login failed', user: null };
            }
        }

        const user = data.user ? data.user : null;
        return { success: true, data, user };

    } catch (error) {
        console.log(error);
        return { success: false, error: 'Login failed', user: null };
    }
};

export const logout = async (accessToken) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        return error
    }
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

export const getUserDetails = async (token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/auth/userDetails`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
        if (!response.ok)
            throw new Error('Network response was not ok');
        const data = await response.json();
        return data
    } catch (error) {
        return false
    }
};

// ---------- driver ----------

export const postFutureRide = async (rideDetails, token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/drivers/post-future-rides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                departure_location: rideDetails.origin.coords.lat + ',' + rideDetails.origin.coords.long,
                pickup_radius: Number(rideDetails.origin.radius),
                destination: rideDetails.destination.coords.lat + ',' + rideDetails.destination.coords.long,
                drop_radius: Number(rideDetails.destination.radius),
                departure_datetime: rideDetails.dateTime,
                available_seats: Number(rideDetails.avSeats),
                notes: rideDetails.notes
            })
        });
        return await response.json();
    } catch (error) {
        return error
    }
}

export const fetchRides = async (userId, token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/drivers/${userId}/rides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
        return await response.json();
    } catch (error) {
        return error
    }
}

export const manageRequests = async (userId, rideId, token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/drivers/${userId}/rides/manage_requests/${rideId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
        return await response.json();
    } catch (error) {
        return error
    }
}

// ---------- passengers ----------

export const joinRide = async (rideId, requestedSeats, token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/passengers/rides/${rideId}/join-ride`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                ride_id: rideId,
                requested_seats: requestedSeats
            })
        });
        return await response.json();
    } catch (error) {
        return error
    }
}

export const findRide = async (rideDetails, token) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/passengers/search-rides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                departure_location: rideDetails.origin.coords.lat + ',' + rideDetails.origin.coords.long,
                pickup_radius: Number(rideDetails.origin.radius),
                destination: rideDetails.destination.coords.lat + ',' + rideDetails.destination.coords.long,
                drop_radius: Number(rideDetails.destination.radius),
                departure_datetime: rideDetails.dateTime,
                available_seats: Number(rideDetails.avSeats),
                delta_hours: Number(rideDetails.deltaHours)
            })
        });
        return await response.json();
    } catch (error) {
        return error
    }
}

// ---------- other APIs ----------

export const getCoordsFromAddress = async (addressText) => {
    const apiKey = '663e40e401c53715963317sdt785944'
    try {
        const response = await fetch('https://geocode.maps.co/search?q=' + addressText + '&api_key=' + apiKey)
        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }
        const data = await response.json();
    } catch (error) {
        console.error('Error fetching address:', error);
        // Handle error appropriately
        return null;
    }
}

export const getAddressFromCoords = async (addressText) => {
    const coords = addressText.split(',')
    const apiKey = '663e40e401c53715963317sdt785944'
    try {
        const response = await fetch(
            'https://geocode.maps.co/reverse?' +
            'lat=' + coords[0] +
            '&lon=' + coords[1] +
            '&api_key=' + apiKey)
        if (!response.ok) {
            throw new Error('Failed to fetch address');
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error fetching address:', error);
        // Handle error appropriately
        return null;
    }
}

// ---------- not yet implemented ----------

export const postRideJoinRequest = async (rideDetails, token) => { //TODO: wait for API to support!
    try {
        const response = await fetch(`${BASE_API_URL}/api/drivers/post-ride-join-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                departure_location: rideDetails.origin.coords.lat + ',' + rideDetails.origin.coords.long,
                pickup_radius: Number(rideDetails.origin.radius),
                destination: rideDetails.destination.coords.lat + ',' + rideDetails.destination.coords.long,
                drop_radius: Number(rideDetails.destination.radius),
                departure_datetime: rideDetails.dateTime,
                available_seats: Number(rideDetails.avSeats),
                notes: rideDetails.notes
            })
        });
        return await response.json();
    } catch (error) {
        return error
    }
}