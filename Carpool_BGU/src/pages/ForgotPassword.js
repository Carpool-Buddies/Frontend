import React, { useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCode, enterCode, resetPassword } from '../common/fetchers';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 1) {
            // Request code
            const { success, msg } = await getCode(email);
            if (success) {
                toast.success(
                    <Typography responsive variant="body1">
                        קוד אימות נשלח לדוא"ל שלך!
                    </Typography>
                );
                setStep(2);
            } else {
                toast.error(
                    <Typography responsive variant="body1">
                        {msg || 'ארעה שגיאה בבקשת קוד האימות'}
                    </Typography>
                );
            }
        } else if (step === 2) {
            const { success, msg } = await enterCode(code);
            if (success) {
                toast.success(
                    <Typography responsive variant="body1">
                        הקוד אומת בהצלחה!
                    </Typography>
                );
                setStep(3);
            } else {
                toast.error(
                    <Typography responsive variant="body1">
                        {msg || 'הקוד שהוזן אינו תקין'}
                    </Typography>
                );
            }
        } else if (step === 3) {
            // Reset password
            if (newPassword !== confirmPassword) {
                toast.error(
                    <Typography responsive variant="body1">
                        הסיסמאות אינן תואמות
                    </Typography>
                );
                return;
            }
            const { success, msg } = await resetPassword(newPassword, confirmPassword);
            if (success) {
                toast.success(
                    <Typography responsive variant="body1">
                        הסיסמה אופסה בהצלחה!
                    </Typography>
                );                setEmail('');
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                setStep(1);
            } else {
                toast.error(
                    <Typography responsive variant="body1">
                        {msg || 'ארעה שגיאה באיפוס הסיסמה'}
                    </Typography>
                );
            }
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    שכחתי סיסמה
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {step === 1 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label='כתובת דוא"ל'
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}
                    {step === 2 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="קוד אימות"
                            name="code"
                            autoFocus
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    )}
                    {step === 3 && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="סיסמה חדשה"
                                name="newPassword"
                                type="password"
                                autoFocus
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="אשר סיסמה חדשה"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </>
                    )}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {step === 1 ? 'בקש קוד אימות' : step === 2 ? 'אמת קוד' : 'אפס סיסמה'}
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
        </Container>
    );
};

export default ForgotPassword;
