import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Drawer,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';

const HeaderAppBar = styled(AppBar)({
    backgroundColor: '#00021E',
    borderBottom: '1px solid #ddd',
    height: '80px', // Fixed height for the header
});

const HeaderToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
    height: '100%', // Ensure Toolbar takes up full height of AppBar
});

const HeaderLogo = styled(Typography)({
    fontFamily: 'Arial, sans-serif',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#fff',
    '&:hover': {
        color: '#ccc',
    },
    '@media (max-width: 600px)': {
        fontSize: '1.5rem',
    },
});

const NavLinkButton = styled(Button)({
    color: '#fff',
    marginLeft: '12px',
    '&:hover': {
        color: '#ccc',
    },
    '@media (max-width: 600px)': {
        display: 'none',
    },
});

const LoginButton = styled(Button)({
    color: '#fff',
    marginLeft: 'auto',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '@media (max-width: 600px)': {
        marginLeft: '8px',
    },
});

const MenuIconButton = styled(IconButton)({
    '@media (min-width: 601px)': {
        display: 'none',
    },
});

const Header = () => {
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isLoggedIn = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if user is admin

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        window.location.href = `/`;
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
    };

    return (
        <HeaderAppBar position="sticky">
            <HeaderToolbar>
                <MenuIconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                    <MenuIcon />
                </MenuIconButton>
                <HeaderLogo variant="h6" component={Link} to="/" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    Lake Side
                </HeaderLogo>
                <List sx={{ display: 'flex' }}>
                    {!isAdmin && (
                        <>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/" color="inherit">
                                    Home
                                </NavLinkButton>
                            </ListItem>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/rooms" color="inherit">
                                    Rooms
                                </NavLinkButton>
                            </ListItem>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/reservations" color="inherit">
                                    Accommodation
                                </NavLinkButton>
                            </ListItem>
                        </>)}

                    {/* Conditionally render admin navs if user is admin */}
                    {isAdmin && (
                        <>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/dashboard" color="inherit">
                                    Dashboard
                                </NavLinkButton>
                            </ListItem>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/users" color="inherit">
                                    Users
                                </NavLinkButton>
                            </ListItem>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/show-rooms" color="inherit">
                                    Rooms
                                </NavLinkButton>
                            </ListItem>
                            <ListItem sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <NavLinkButton component={Link} to="/show-reservations" color="inherit">
                                    Reservations
                                </NavLinkButton>
                            </ListItem>
                        </>
                    )}

                    {/* Render user profile and login/logout button */}
                    {isLoggedIn ? (
                        <ListItem>
                            <IconButton color="inherit" onClick={handleMenuOpen}>
                                <Avatar />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                onClick={handleMenuClose}
                            >
                                <MenuItem component={Link} to={`/profile/${localStorage.getItem('userId')}`}>
                                    View Profile
                                </MenuItem>
                                {!isAdmin && (
                                    <>
                                        <MenuItem component={Link} to={`/history/${localStorage.getItem('userId')}`}>
                                            Reservations
                                        </MenuItem>
                                    </>)}

                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </ListItem>
                    ) : (
                        <ListItem>
                            <LoginButton component={Link} to="/login" variant="outlined" color="inherit">
                                Login
                            </LoginButton>
                        </ListItem>
                    )}
                </List>
            </HeaderToolbar>
            <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
                <List>
                    {!isAdmin && (
                        <>
                            <ListItem button component={Link} to="/">
                                <ListItemText primary="Home" />
                            </ListItem>
                            <ListItem button component={Link} to="/rooms">
                                <ListItemText primary="Rooms" />
                            </ListItem>
                            <ListItem button component={Link} to="/reservations">
                                <ListItemText primary="Accommodation" />
                            </ListItem>
                        </>)}
                    {isAdmin && (
                        <>
                            <ListItem button component={Link} to="/dashboard">
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                            <ListItem button component={Link} to="/users">
                                <ListItemText primary="Users" />
                            </ListItem>
                            <ListItem button component={Link} to="/show-rooms">
                                <ListItemText primary="Rooms" />
                            </ListItem>
                            <ListItem button component={Link} to="/show-reservations">
                                <ListItemText primary="Reservations" />
                            </ListItem>
                        </>)}


                </List>
            </Drawer>
        </HeaderAppBar>
    );
};

export default Header;
