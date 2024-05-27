import React, { useState } from 'react';
import { updateUserDetails } from '../common/fetchers';

const EditProfilePage = () => {
    const [formData, setFormData] = useState({
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        birthday: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUserDetails(formData, localStorage.getItem('access_token'));
            // Handle the response from the server
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>ערוך פרופיל</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">סיסמה חדשה:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="firstName">שם פרטי:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="lastName">שם משפחה:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phoneNumber">מספר טלפון:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="birthday">תאריך לידה:</label>
                    <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">עדכן פרטים</button>
            </form>
        </div>
    );
};

export default EditProfilePage;