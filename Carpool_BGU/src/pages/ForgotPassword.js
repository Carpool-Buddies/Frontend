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
                toast.success('Verification code sent to your email!');
                setStep(2);
            } else {
                toast.error(msg || 'Failed to request code');
            }
        } else if (step === 2) {
            // Enter code
            const { success, msg } = await enterCode(code);
            if (success) {
                toast.success('Code verified successfully!');
                setStep(3);
            } else {
                toast.error(msg || 'Invalid code');
            }
        } else if (step === 3) {
            // Reset password
            if (newPassword !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            const { success, msg } = await resetPassword(newPassword, confirmPassword);
            if (success) {
                toast.success('Password reset successfully!');
                setEmail('');
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                setStep(1);
            } else {
                toast.error(msg || 'Failed to reset password');
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
            <ToastContainer />
        </Container>
    );
};

export default ForgotPassword;
