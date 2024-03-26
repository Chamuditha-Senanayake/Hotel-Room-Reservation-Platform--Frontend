import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const RegisterSchema = yup.object().shape({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    phone: yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must contain exactly 10 digits')
        .required('Phone number is required'),
});

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(RegisterSchema)
    });

    const registerUser = async (data) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Registration failed', { position: "bottom-right" });
                throw new Error('Registration failed');
            }

            const responseData = await response.json();
            // Save token to local storage
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('name', responseData.name);
            localStorage.setItem('email', responseData.email);
            localStorage.setItem('isAdmin', responseData.isAdmin);
            toast.success('Registration successful', { position: "bottom-right" });
            window.location.href = '/'; // Redirect to the home

        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    const onSubmit = (data) => {
        registerUser(data);
    };

    return (
        <Container maxWidth="sm" style={{ minHeight: '75vh', marginTop: '2rem' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>Register</Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <TextField fullWidth label="Full Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Phone Number" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth type="password" label="Password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth type="password" label="Confirm Password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" align="center">
                                    Do you have an account? <Link to={'/login'}>Login</Link>
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

export default Register;
