import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import 'react-toastify/dist/ReactToastify.css';

const specialRequirementsOptions = [,
    'Extra Bed',
    'Crib',
    'Minibar',
    'Freezer',
];

const Reservation = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const [roomTypes, setRoomTypes] = useState([]);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/rooms', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch room types');
            }
            const rooms = await response.json();
            const categorizedRooms = categorizeRooms(rooms);
            const availableRoomTypes = Object.keys(categorizedRooms).filter(roomType => categorizedRooms[roomType].availableCount > 0);
            setRoomTypes(availableRoomTypes.map(roomType => ({ type: roomType, roomId: categorizedRooms[roomType].roomId })));
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    const categorizeRooms = (rooms) => {
        const categorizedRooms = {};
        rooms.forEach(room => {
            if (!categorizedRooms[room.type]) {
                categorizedRooms[room.type] = {
                    total: 1,
                    availableCount: room.availability === 'true' ? 1 : 0,
                    roomId: room._id
                };
            } else {
                categorizedRooms[room.type].total++;
                categorizedRooms[room.type].availableCount += room.availability === 'true' ? 1 : 0;
            }
        });
        return categorizedRooms;
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // If user is not logged in, redirect to login page
                window.location.href = `/login?destination=reservation`;
                return;
            }

            data.userId = localStorage.getItem('userId');
            const selectedRoom = roomTypes.find(roomType => roomType.type === data.roomType);
            if (!selectedRoom) {
                throw new Error('Room type not found');
            }
            data.roomId = selectedRoom.roomId;

            // Create an array to store selected special requirements
            data.specialRequirements = specialRequirementsOptions
                .filter(option => data[option])
                .map(option => option); // Map checked options to a new array

            // Remove special requirements from the data object
            specialRequirementsOptions.forEach(option => delete data[option]);

            const response = await fetch('http://localhost:5000/api/reservations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Reservation failed');
            }

            toast.success('Reservation successful', { position: "bottom-right" });
            // Clear form fields
            reset();

        } catch (error) {
            // toast.error('Reservation failed', { position: "bottom-right" });
            console.error('Reservation failed:', error.message);
        }
    };


    return (
        <Container maxWidth="sm" style={{ minHeight: '75vh', marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '2rem' }}>Make Reservations</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Check-in Date"
                                    {...register('checkInDate', { required: true, min: today })}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ inputProps: { min: today } }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Check-out Date"
                                    {...register('checkOutDate', { required: true, min: watch('checkInDate', today) })}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ inputProps: { min: watch('checkInDate', today) } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Room Type</InputLabel>
                            <Select {...register('roomType', { required: true })} defaultValue="" error={!!errors.roomType}>
                                {roomTypes.map((type, index) => (
                                    <MenuItem key={index} value={type.type}>{type.type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" style={{ marginBottom: '1rem' }}>Special Requirements:</Typography>
                        <Grid container spacing={1}>
                            {specialRequirementsOptions.map((option, index) => (
                                <Grid item xs={6} key={index}>
                                    <FormControlLabel
                                        control={<Checkbox {...register(`specialRequirements.${index}`)} />}
                                        label={option}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows={4} label="Additional Requests" {...register('additionalRequests')} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>Make Reservetion</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <PayPalScriptProvider options={{ "client-id": "testID" }}>
                            <PayPalButtons />
                        </PayPalScriptProvider>
                    </Grid>
                </Grid>
            </form>
            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default Reservation;
