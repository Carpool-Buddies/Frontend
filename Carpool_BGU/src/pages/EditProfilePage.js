import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { getUserDetails, updateUserDetails } from '../common/fetchers';
import { toast } from 'react-toastify';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        birthday: '',
    });

    useEffect(() => {
        getUserDetails(localStorage.getItem('access_token'))
            .then((ret) => {
                if (ret.success) {
                    setFormData({
                        password: '',
                        first_name: ret.first_name,
                        last_name: ret.last_name,
                        phone_number: ret.phone_number,
                        birthday: ret.birthday,
                    });
                } else {
                    toast.error('Failed to fetch user details');
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
                toast.error('Failed to fetch user details');
            });
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const requestData = {
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            birthday: formData.birthday,
        };


        updateUserDetails(localStorage.getItem('access_token'), requestData)
            .then((ret) => {
                if (ret.success) {
                    toast.success('User details updated successfully');
                    navigate('/'); // Navigate to the home page after successful update
                } else {
                    console.error('Failed to update user details:', ret); // Debug
                    toast.error('Failed to update user details');
                }
            })
            .catch((error) => {
                console.error('Error updating user details:', error);
                toast.error('Failed to update user details');
            });
    };
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    ערוך פרופיל
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="סיסמה"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="שם פרטי"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="שם משפחה"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="מספר טלפון"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="תאריך לידה"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        InputProps={{
                            placeholder: 'YYYY-MM-DD', // Show a placeholder with the expected format
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        שמור שינויים
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditProfilePage;