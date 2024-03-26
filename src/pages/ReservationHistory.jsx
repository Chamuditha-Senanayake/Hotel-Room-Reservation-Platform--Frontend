import React, { useState, useEffect } from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const ReservationHistory = () => {
    const [reservations, setReservations] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetchReservationHistory();
    }, []);

    const fetchReservationHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to home page if user is not logged in
                window.location.href = '/';
                return;
            }

            const response = await fetch(`http://localhost:5000/api/reservations/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reservation history');
            }

            const data = await response.json();
            setReservations(data.data);
        } catch (error) {
            console.error('Error fetching reservation history:', error);
        }
    };

    return (
        <Container maxWidth="md" style={{ minHeight: '75vh', marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>Reservation History</Typography>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table aria-label="reservation history table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Check-in Date</TableCell>
                            <TableCell>Check-out Date</TableCell>
                            <TableCell>Room Type</TableCell>
                            <TableCell>Room No</TableCell>
                            <TableCell>Additional Requests</TableCell>
                            <TableCell>Payment</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map(reservation => (
                            <TableRow key={reservation._id}>
                                <TableCell>{new Date(reservation.checkInDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(reservation.checkOutDate).toLocaleDateString()}</TableCell>
                                <TableCell>{reservation.room.type}</TableCell>
                                <TableCell>{reservation.room.roomNumber}</TableCell>
                                <TableCell>{reservation.additionalRequests}</TableCell>
                                <TableCell>done</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ReservationHistory;
