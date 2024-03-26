import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';

const validationSchema = yup.object().shape({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters'),
    confirmNewPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    phone: yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must contain exactly 10 digits')
        .required('Phone number is required'),
});

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to home page if user is not logged in
                window.location.href = '/';
                return;
            }

            const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const updatedUserData = await response.json();
            setUserData(updatedUserData);
            toast.success('Profile updated ', { position: "bottom-right" });
            console.log('User data updated successfully:', updatedUserData);
        } catch (error) {
            console.error('Error updating user data:', error);
            toast.error('Failed to update', { position: "bottom-right" });
        }
    };

    // Render form only if userData is not null
    if (!userData) {
        //TODO:add loader 
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="sm" style={{ minHeight: '75vh', marginTop: '2rem' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" gutterBottom>Edit Profile</Typography>
                </Grid>
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Full Name" defaultValue={userData.name} {...register('name')} error={errors.name ? true : false} helperText={errors.name?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" defaultValue={userData.email} {...register('email')} error={errors.email ? true : false} helperText={errors.email?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Phone" defaultValue={userData.phone} {...register('phone')} error={errors.phone ? true : false} helperText={errors.phone?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="New Password" type="password" {...register('password')} error={errors.password ? true : false} helperText={errors.password?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Confirm New Password" type="password" {...register('confirmNewPassword')} error={errors.confirmNewPassword ? true : false} helperText={errors.confirmNewPassword?.message} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>Save Changes</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default UserProfile;
