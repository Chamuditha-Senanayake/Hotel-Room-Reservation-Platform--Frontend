import React, { useState, useEffect } from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const specialRequirementsOptions = [
    'Extra Bed',
    'Crib',
    'Minibar',
    'Freezer',
];

const ViewReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [reservationIdToDelete, setReservationIdToDelete] = useState(null);
    const [editReservation, setEditReservation] = useState(null);
    const [editCheckInDate, setEditCheckInDate] = useState('');
    const [editCheckOutDate, setEditCheckOutDate] = useState('');
    const [editCustomer, setEditCustomer] = useState('');
    const [editRoomType, setEditRoomType] = useState('');
    const [editRoomNumber, setEditRoomNumber] = useState('');
    const [editAdditionalRequests, setEditAdditionalRequests] = useState('');
    const [editSpecialRequirements, setEditSpecialRequirements] = useState(new Array(specialRequirementsOptions.length).fill(false));

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to home page if user is not logged in
                window.location.href = '/';
                return;
            }
            const response = await fetch('http://localhost:5000/api/reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }
            const data = await response.json();
            setReservations(data.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/reservations/${reservationIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete reservation');
            }
            await fetchReservations();
            toast.success('Reservation deleted successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error deleting reservation:', error);
            toast.error('Failed to delete reservation', { position: "bottom-right" });
        } finally {
            setConfirmationOpen(false);
        }
    };

    const handleOpenConfirmation = (reservationId) => {
        setReservationIdToDelete(reservationId);
        setConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false);
    };

    const handleEdit = (reservation) => {
        setEditReservation(reservation);
        setEditCheckInDate(reservation.checkInDate);
        setEditCheckOutDate(reservation.checkOutDate);
        setEditCustomer(reservation.user.name);
        setEditRoomType(reservation.room.type);
        setEditRoomNumber(reservation.room.roomNumber);
        setEditAdditionalRequests(reservation.additionalRequests);
        // Set initial state for special requirements checkboxes
        const specialRequirementsState = new Array(specialRequirementsOptions.length).fill(false);
        reservation.specialRequirements.forEach((value, index) => {
            if (value === "true") {
                specialRequirementsState[index] = true;
            }
        });
        setEditSpecialRequirements(specialRequirementsState);
    };


    const handleSpecialRequirementChange = (index, isChecked) => {
        const updatedSpecialRequirements = [...editSpecialRequirements];
        updatedSpecialRequirements[index] = isChecked;
        setEditSpecialRequirements(updatedSpecialRequirements);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/reservations/${editReservation._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    checkInDate: editCheckInDate,
                    checkOutDate: editCheckOutDate,
                    roomType: editRoomType,
                    roomNumber: editRoomNumber,
                    additionalRequests: editAdditionalRequests,
                    specialRequirements: editSpecialRequirements.map(value => value.toString())
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update reservation');
            }
            await fetchReservations();
            toast.success('Reservation updated successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error updating reservation:', error);
            toast.error('Failed to update reservation', { position: "bottom-right" });
        } finally {
            setEditReservation(null);
        }
    };

    return (
        <Container maxWidth="lg" style={{ minHeight: '75vh', marginTop: '2rem', position: 'relative' }}>
            <Typography variant="h4" align="center" gutterBottom>Reservations List</Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    window.location.href = '/reservations';
                    return;
                }}
                style={{ position: 'absolute', top: '0.2rem', right: '1.5rem', padding: '5px', backgroundColor: '#051650' }}
            >
                Add
            </Button>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table aria-label="reservation table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ textAlign: 'center' }}>Check-In Date</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>Check-Out Date</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>Customer</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>Room Type</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>Room Number</TableCell>
                            <TableCell style={{ textAlign: 'center' }}> Special Requirements</TableCell >
                            <TableCell style={{ textAlign: 'center' }}> Additional Requests</TableCell >
                            <TableCell style={{ textAlign: 'center' }}> Actions</TableCell >
                        </TableRow >
                    </TableHead >
                    <TableBody>
                        {reservations.map(reservation => (
                            <TableRow key={reservation._id}>
                                <TableCell style={{ textAlign: 'center' }}>{new Date(reservation.checkInDate).toLocaleDateString()}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{new Date(reservation.checkOutDate).toLocaleDateString()}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{reservation.user.name}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{reservation.room.type}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{reservation.room.roomNumber}</TableCell>
                                <TableCell >
                                    {reservation.specialRequirements.some(req => req === "true") ? (
                                        <ul style={{ marginLeft: "2rem" }}>
                                            {specialRequirementsOptions
                                                .filter((option, index) => reservation.specialRequirements[index] === "true")
                                                .map((option, index) => (
                                                    <li key={index}>{option}</li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    {reservation.additionalRequests ? (
                                        <p>{reservation.additionalRequests}</p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </TableCell>

                                <TableCell>
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => handleEdit(reservation)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleOpenConfirmation(reservation._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table >
            </TableContainer >
            {/* Edit Reservation Dialog */}
            < Dialog open={!!editReservation} onClose={() => setEditReservation(null)}>
                <DialogTitle>Edit Reservation</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="checkInDate"
                        label="Check-In Date"
                        type="date"
                        fullWidth
                        value={editCheckInDate}
                        onChange={(e) => setEditCheckInDate(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="checkOutDate"
                        label="Check-Out Date"
                        type="date"
                        fullWidth
                        value={editCheckOutDate}
                        onChange={(e) => setEditCheckOutDate(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="customer"
                        label="Customer"
                        type="text"
                        fullWidth
                        value={editCustomer}
                        onChange={(e) => setEditCustomer(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="roomType"
                        label="Room Type"
                        type="text"
                        fullWidth
                        value={editRoomType}
                        onChange={(e) => setEditRoomType(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="roomNumber"
                        label="Room Number"
                        type="text"
                        fullWidth
                        value={editRoomNumber}
                        onChange={(e) => setEditRoomNumber(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="additionalRequests"
                        label="Additional Requests"
                        type="text"
                        fullWidth
                        value={editAdditionalRequests}
                        onChange={(e) => setEditAdditionalRequests(e.target.value)}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                        Special Requirements:
                    </Typography>
                    {specialRequirementsOptions.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={editSpecialRequirements[index]}
                                    onChange={(e) => handleSpecialRequirementChange(index, e.target.checked)}
                                />
                            }
                            label={option}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditReservation(null)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary">Save</Button>
                </DialogActions>
            </Dialog >

            {/* Confirmation Dialog */}
            < Dialog open={confirmationOpen} onClose={handleCloseConfirmation} >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this reservation?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog >
            < ToastContainer position="bottom-right" />
        </Container >
    );
};

export default ViewReservations;

