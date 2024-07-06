import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import { getProfile, getUserDetails, updateUserDetails } from '../common/fetchers';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
                    console.log(ret)
                    getProfile(ret.id, localStorage.getItem('access_token'))
                        .then((ret) => {
                            if (ret.success) {
                                console.log(ret)
                                setFormData({
                                    password: '',
                                    first_name: ret.profile.first_name,
                                    last_name: ret.profile.last_name,
                                    phone_number: ret.profile.phone_number.replace('+972',''),
                                    birthday: ret.profile.birthday,
                                });
                            } else {
                                toast.error(
                                    <Typography responsive variant="body1">
                                        {ret.message || 'ארעה שגיאה בטעינת פרטי המשתמש'}
                                    </Typography>
                                );
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching user details:', error);
                            toast.error(
                                <Typography responsive variant="body1">
                                    {error.message || 'ארעה שגיאה בטעינת פרטי המשתמש'}
                                </Typography>
                            );
                        });
                } else {
                    toast.error(
                        <Typography responsive variant="body1">
                            {ret.message ||'ארעה שגיאה בטעינת פרטי המשתמש'}
                        </Typography>
                    );
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
                toast.error(
                    <Typography responsive variant="body1">
                        {error.message ||'ארעה שגיאה בטעינת פרטי המשתמש'}
                    </Typography>
                );
            });
    }, []);

    const phoneNumberAutoFormat = (phoneNumber) => {
        const number = phoneNumber.trim().replace(/[^0-9]/g, "");
        if (number.length < 4) return number;
        if (number.length < 7) return number.replace(/(\d{3})(\d)/, "$1-$2");
        if (number.length < 11) return number.replace(/(\d{3})(\d{3})(\d)/, "$1-$2-$3");
        return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    const handleChange = (event) => {
        try {
            if (event.target.name === 'phone_number')
                setFormData({...formData, [event.target.name]: phoneNumberAutoFormat(event.target.value)});
            else
                setFormData({ ...formData, [event.target.name]: event.target.value });
        }
        catch(e){
            setFormData({...formData, birthday: event})
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const requestData = {
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: '+972 ' + formData.phone_number,
            birthday: formData.birthday.format('YYYY-MM-DD'),
        };

        updateUserDetails(localStorage.getItem('access_token'), requestData)
            .then((ret) => {
                if (ret.success) {
                    toast.success(
                        <Typography responsive variant="body1">
                            {'פרטי המשתמש עודכנו בהצלחה'}
                        </Typography>
                    );
                    setTimeout(() => {
                        navigate('/');
                    }, 2000); // Delay navigation by 2 seconds (2000 milliseconds)
                } else {
                    console.error('Failed to update user details:', ret);
                    toast.error(
                        <Typography responsive variant="body1">
                            {ret.msg || 'ארעה שגיאה בעדכון פרטי המשתמש'}
                        </Typography>
                    );
                }
            })
            .catch((error) => {
                console.error('Error updating user details:', error);
                toast.error(
                    <Typography responsive variant="body1">
                        {error.message || 'ארעה שגיאה בעדכון פרטי המשתמש'}
                    </Typography>
                );
            });
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={() => navigate('/')}>
                        <ArrowForwardIcon sx={{mr: 1}}/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        הפרטים האישיים של {formData.first_name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{p: 3}}>
                <Typography component="h1" variant="h5">
                    ערוך פרופיל
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
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
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="שם משפחה"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="מספר טלפון"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        inputProps={{ maxLength: 12 }}
                    />
                    <DatePicker
                        margin="normal"
                        required
                        label="תאריך לידה"
                        name="birthday"
                        onChange={handleChange}
                        openTo="year"
                        defaultValue={dayjs(formData.birthday)}
                        maxDate={dayjs().subtract(16, 'year')}
                        views={['year', 'month', 'day']}
                        slotProps={{ textField: { fullWidth: true } }}
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
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Box>
    );
};

export default EditProfilePage;