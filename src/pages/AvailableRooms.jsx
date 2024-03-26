import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent } from '@mui/material';
import room1Image from '../assets/images/img-1.jpg';

const AvailableRooms = () => {
    const [roomTypes, setRoomTypes] = useState({});

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/rooms', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const rooms = await response.json();
            const categorizedRooms = categorizeRooms(rooms);
            setRoomTypes(categorizedRooms);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        fetchRooms();

    }, []);

    const categorizeRooms = (rooms) => {
        const categorizedRooms = {};
        rooms.forEach(room => {
            if (!categorizedRooms[room.type]) {
                categorizedRooms[room.type] = { count: 0, rooms: [] };
            }
            categorizedRooms[room.type].rooms.push(room);
            if (room.availability === "true") {
                categorizedRooms[room.type].count++;
            }
        });
        return categorizedRooms;
    };

    return (
        <Container maxWidth="md" style={{ minHeight: '75vh', marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>Available Rooms</Typography>
            <Grid container spacing={4} justifyContent="center">
                {Object.keys(roomTypes).map(type => (
                    <Grid item xs={12} sm={6} md={4} key={type}>
                        <Card style={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{type}</Typography>
                                <img src={room1Image} alt={type} style={{ width: '100%', height: '100%', objectFit: 'cover', marginBottom: '1rem' }} />
                                <Typography variant="body1" color="textSecondary" gutterBottom>Available: {roomTypes[type].count}</Typography>
                                <Typography variant="h6" color="primary">LKR {roomTypes[type].rooms.length > 0 ? roomTypes[type].rooms[0].price : '-'}</Typography>
                                <Typography variant="body1" color="textSecondary" gutterBottom sx={{ mt: 1 }}>{roomTypes[type].rooms.length > 0 ? roomTypes[type].rooms[0].description : 'No rooms available'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>

    );
};

export default AvailableRooms;
