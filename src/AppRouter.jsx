import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import AvailableRooms from './pages/AvailableRooms';
import Reservation from './pages/Reservation';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ReservationHistory from './pages/ReservationHistory';
import ViewUsers from './pages/ViewUsers';
import ViewReservations from './pages/ViewReservations';
import ViewRooms from './pages/ViewRooms';
import Dashboard from './pages/Dashboard';

const AppRouter = () => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        <Router>
            <Header />
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: '1 0 auto' }}>
                    <Routes>
                        {!isAdmin && (
                            <>
                                {/* Route for home - only for customers*/}
                                <Route path="/" element={<LandingPage />} />
                            </>)}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        {/* Route for user profile */}
                        <Route
                            path="/profile/:id"
                            element={isAuthenticated ? <UserProfile user={{}} /> : <Navigate to="/" />}
                        />
                        <Route path="/rooms" element={<AvailableRooms />} />
                        <Route path="/reservations" element={<Reservation />} />
                        {/* Route for reservation history */}
                        <Route
                            path="/history/:id"
                            element={isAuthenticated ? <ReservationHistory /> : <Navigate to="/" />}
                        />
                        {isAdmin && (
                            <>
                                {/* Routes only for admins*/}
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/users" element={<ViewUsers />} />
                                <Route path="/show-reservations" element={<ViewReservations />} />
                                <Route path="/show-rooms" element={<ViewRooms />} />
                            </>)}

                        {/* Catch-all other routes */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default AppRouter;
