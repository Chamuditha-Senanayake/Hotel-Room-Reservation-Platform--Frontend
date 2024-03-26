import React, { useState, useEffect } from 'react';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editAdmin, setEditAdmin] = useState(false);
    const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [newUserDetails, setNewUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to home page if user is not logged in
                window.location.href = '/';
                return;
            }

            const response = await fetch('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user/${userIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            await fetchUsers();
            toast.success('User deleted successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user', { position: "bottom-right" });
        } finally {
            setConfirmationOpen(false);
        }
    };

    const handleOpenConfirmation = (userId) => {
        setUserIdToDelete(userId);
        setConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false);
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditPhone(user.phone);
        setEditAdmin(user.isAdmin);
    };

    const validateEmail = (email) => {
        // Regular expression for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        // Regular expression for phone number validation (basic example)
        const regex = /^\d{10}$/;
        return regex.test(phone);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user/${editUser._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: editName,
                    email: editEmail,
                    phone: editPhone,
                    isAdmin: editAdmin
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            await fetchUsers();
            toast.success('User updated successfully', { position: "bottom-right" });
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user', { position: "bottom-right" });
        } finally {
            setEditUser(null);
        }
    };

    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserDetails)
            });
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            await fetchUsers();
            toast.success('User created successfully', { position: "bottom-right" });
            setCreateUserModalOpen(false);
            setNewUserDetails({
                name: '',
                email: '',
                phone: '',
                isAdmin: false
            });
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Failed to create user', { position: "bottom-right" });
        }
    };

    return (
        <Container maxWidth="md" style={{ minHeight: '75vh', marginTop: '2rem', position: 'relative' }}>
            <Typography variant="h4" align="center" gutterBottom>Users List</Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setCreateUserModalOpen(true)}
                style={{ position: 'absolute', top: '0.2rem', right: '1.5rem', padding: '5px', backgroundColor: '#051650' }}
            >
                Add
            </Button>

            {/* User Creation Dialog */}
            <Dialog open={createUserModalOpen} onClose={() => setCreateUserModalOpen(false)}>
                <DialogTitle>Create New User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={newUserDetails.name}
                        onChange={(e) => setNewUserDetails({ ...newUserDetails, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newUserDetails.email}
                        onChange={(e) => setNewUserDetails({ ...newUserDetails, email: e.target.value })}
                        error={!validateEmail(newUserDetails.email)}
                        helperText={!validateEmail(newUserDetails.email) ? 'Invalid email format' : ''}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        value={newUserDetails.phone}
                        onChange={(e) => setNewUserDetails({ ...newUserDetails, phone: e.target.value })}
                        error={!validatePhone(newUserDetails.phone)}
                        helperText={!validatePhone(newUserDetails.phone) ? 'Invalid phone number format' : ''}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={newUserDetails.password}
                        onChange={(e) => setNewUserDetails({ ...newUserDetails, password: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={newUserDetails.confirmPassword}
                        onChange={(e) => setNewUserDetails({ ...newUserDetails, confirmPassword: e.target.value })}
                        error={newUserDetails.password !== newUserDetails.confirmPassword}
                        helperText={newUserDetails.password !== newUserDetails.confirmPassword ? 'Passwords do not match' : ''}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newUserDetails.isAdmin}
                                onChange={(e) => setNewUserDetails({ ...newUserDetails, isAdmin: e.target.checked })}
                            />
                        }
                        label="Admin"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateUserModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateUser} color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell >Name</TableCell>
                            <TableCell >Email</TableCell>
                            <TableCell >Phone</TableCell>
                            <TableCell >Admin</TableCell>
                            <TableCell >Created</TableCell>
                            <TableCell >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{new Date(user.created).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton
                                        aria-label="edit"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleOpenConfirmation(user._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit User Dialog */}
            <Dialog open={!!editUser} onClose={() => setEditUser(null)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        error={!validateEmail(editEmail)}
                        helperText={!validateEmail(editEmail) ? 'Invalid email format' : ''}
                    />

                    <TextField
                        margin="dense"
                        id="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        error={!validatePhone(editPhone)}
                        helperText={!validatePhone(editPhone) ? 'Invalid phone number format' : ''}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={editAdmin}
                                onChange={(e) => setEditAdmin(!editAdmin)}
                            />
                        }
                        label="Admin"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditUser(null)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmationOpen} onClose={handleCloseConfirmation}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="bottom-right" />
        </Container>
    );
};

export default ViewUsers;


