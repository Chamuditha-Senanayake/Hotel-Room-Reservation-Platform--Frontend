import React, { useState, useEffect } from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ViewRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [roomIdToDelete, setRoomIdToDelete] = useState(null);
    const [editRoom, setEditRoom] = useState(null);
    const [editType, setEditType] = useState('');
    const [editNumber, setEditNumber] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCapacity, setEditCapacity] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editAvailability, setEditAvailability] = useState('');
    const [editImg, setEditImg] = useState('');
    const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
    const [newRoomDetails, setNewRoomDetails] = useState({
        type: '',
        roomNumber: '',
        description: '',
        capacity: '',
        price: '',
        availability: '',
        img: '',
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/rooms', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/rooms/${roomIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete room');
            }
            await fetchRooms();
            toast.success('Room deleted successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error deleting room:', error);
            toast.error('Failed to delete room', { position: "bottom-right" });
        } finally {
            setConfirmationOpen(false);
        }
    };

    const handleOpenConfirmation = (roomId) => {
        setRoomIdToDelete(roomId);
        setConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false);
    };

    const handleEdit = (room) => {
        setEditRoom(room);
        setEditType(room.type);
        setEditNumber(room.roomNumber);
        setEditDescription(room.description);
        setEditCapacity(room.capacity);
        setEditPrice(room.price);
        setEditAvailability(room.availability);
        setEditImg(room.img);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/rooms/${editRoom._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: editType,
                    roomNumber: editNumber,
                    description: editDescription,
                    capacity: editCapacity,
                    price: editPrice,
                    img: editImg,
                    availability: editAvailability
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update room');
            }
            await fetchRooms();
            toast.success('Room updated successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error updating room:', error);
            toast.error('Failed to update room', { position: "bottom-right" });
        } finally {
            setEditRoom(null);
        }
    };

    const handleOpenCreateRoomModal = () => {
        setCreateRoomModalOpen(true);
    };

    const handleCloseCreateRoomModal = () => {
        setCreateRoomModalOpen(false);
        // Reset new room details
        setNewRoomDetails({
            type: '',
            roomNumber: '',
            description: '',
            capacity: '',
            price: '',
            img: '',
            availability: '',
        });
    };

    const handleCreateRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/rooms`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRoomDetails)
            });
            if (!response.ok) {
                throw new Error('Failed to create room');
            }
            await fetchRooms();
            toast.success('Room created successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error creating room:', error);
            toast.error('Failed to create room', { position: "bottom-right" });
        } finally {
            handleCloseCreateRoomModal();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoomDetails({
            ...newRoomDetails,
            [name]: value
        });
    };

    return (
        <Container maxWidth="lg" style={{ minHeight: '75vh', marginTop: '2rem', position: 'relative' }}>
            <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '1rem' }}>Rooms List</Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenCreateRoomModal}
                style={{ position: 'absolute', top: '0.2rem', right: '1.5rem', padding: '5px', backgroundColor: '#051650' }}
            >
                Add
            </Button>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table aria-label="room table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Availability</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms.map(room => (
                            <TableRow key={room._id}>
                                <TableCell>{room.roomNumber}</TableCell>
                                <TableCell>{room.type}</TableCell>
                                <TableCell>{room.description}</TableCell>
                                <TableCell>{room.capacity}</TableCell>
                                <TableCell>{room.price}</TableCell>
                                <TableCell>{room.availability == "true" ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => handleEdit(room)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleOpenConfirmation(room._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Room Dialog */}
            <Dialog open={!!editRoom} onClose={() => setEditRoom(null)}>
                <DialogTitle>Edit Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="type"
                        name="type"
                        label="Type"
                        type="text"
                        fullWidth
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="number"
                        name="roomNumber"
                        label="Number"
                        type="text"
                        fullWidth
                        value={editNumber}
                        onChange={(e) => setEditNumber(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="capacity"
                        name="capacity"
                        label="Capacity"
                        type="text"
                        fullWidth
                        value={editCapacity}
                        onChange={(e) => setEditCapacity(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        name="price"
                        label="Price"
                        type="text"
                        fullWidth
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="img"
                        name="img"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={editImg}
                        onChange={(e) => setEditImg(e.target.value)}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={editAvailability === "true"}
                                onChange={(e) => setEditAvailability(e.target.checked ? "true" : "false")}
                            />
                        }
                        label="Availability"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditRoom(null)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmationOpen} onClose={handleCloseConfirmation}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this room?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Create Room Dialog */}
            <Dialog open={createRoomModalOpen} onClose={handleCloseCreateRoomModal}>
                <DialogTitle>Create New Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="type"
                        name="type"
                        label="Type"
                        type="text"
                        fullWidth
                        value={newRoomDetails.type}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="roomNumber"
                        name="roomNumber"
                        label="Number"
                        type="text"
                        fullWidth
                        value={newRoomDetails.roomNumber}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={newRoomDetails.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="capacity"
                        name="capacity"
                        label="Capacity"
                        type="text"
                        fullWidth
                        value={newRoomDetails.capacity}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        name="price"
                        label="Price"
                        type="text"
                        fullWidth
                        value={newRoomDetails.price}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="img"
                        name="img"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={newRoomDetails.img}
                        onChange={handleInputChange}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newRoomDetails.availability === "true"}
                                onChange={(e) => setNewRoomDetails({ ...newRoomDetails, availability: e.target.checked ? "true" : "false" })}
                            />
                        }
                        label="Availability"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateRoomModal}>Cancel</Button>
                    <Button onClick={handleCreateRoom} color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default ViewRooms;

