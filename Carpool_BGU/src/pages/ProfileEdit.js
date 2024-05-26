import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { getUserDetails, updateUserDetails } from '../common/fetchers';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ProfileEdit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        birthday: '',
        password: '',
    });
    useEffect(() => {
        getUserDetails(localStorage.getItem('access_token'))
            .then((ret) => {
                if (ret.success) {
                    setFormData({
                        firstName: ret.first_name,
                        lastName: ret.last_name,
                        phoneNumber: ret.phone_number,
                        birthday: dayjs(ret.birthday).format('YYYY-MM-DD'), // Convert date to the expected format
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
        const updatedData = {
            password: formData.password || undefined,
            first_name: formData.firstName || undefined,
            last_name: formData.lastName || undefined,
            phone_number: formData.phoneNumber || undefined,
            birthday: formData.birthday || undefined,
        };

        updateUserDetails(localStorage.getItem('access_token'), updatedData)
            .then((ret) => {
                if (ret.success) {
                    toast.success('User details updated successfully');
                    navigate('/'); // Navigate to the home page after successful update
                } else {
                    toast.error(ret.error);
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
                        type="date"
                        value={formData.birthday}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="סיסמה"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
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

export default ProfileEdit;