import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const LoginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(LoginSchema)
    });
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect') || '/';

    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                toast.error('Login failed', { position: "bottom-right" });
                throw new Error('Failed to login');
            }

            const responseData = await response.json();

            //TODO:implement useReducer instead of localstorage
            // Save token to local storage
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('userId', responseData._id);
            localStorage.setItem('name', responseData.name);
            localStorage.setItem('isAdmin', responseData.isAdmin);
            toast.success('Login successful', { position: "bottom-right" });

            // Redirect to the home 
            window.location.href = redirect;

        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <Container maxWidth="sm" style={{ minHeight: '75vh', marginTop: '2rem' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>Login</Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth type="password" label="Password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" align="center">
                                    Don't have an account? <Link to={'/register'}>Register</Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default Login;
