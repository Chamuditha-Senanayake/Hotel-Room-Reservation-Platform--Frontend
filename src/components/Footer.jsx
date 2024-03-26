import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Typography, IconButton, useMediaQuery } from '@mui/material';
import { Facebook, Twitter, Instagram, MailOutline, Phone } from '@mui/icons-material';

const Footer = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <footer style={{ backgroundColor: '#00021E', color: '#fff', padding: '2rem 0', width: '100%', margin: '2rem 0 0 0' }}>
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Container style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>Hotel Lake Side</Typography>
                            <Typography variant="body2" gutterBottom>123 Lake Side Avenue</Typography>
                            <Typography variant="body2" gutterBottom>Colombo Rd, Kandy</Typography>
                            <Typography variant="body2" gutterBottom>Sri Lanka</Typography>
                        </Container>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Container style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>Contact Us</Typography>

                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item style={{ paddingRight: '1rem' }}><MailOutline /></Grid>
                                <Typography variant="body2" >Email: info@hotellakeside.com</Typography>
                            </Grid>
                            <Grid container spacing={0.5} alignItems="center" justifyContent="center">
                                <Grid item style={{ paddingRight: '1rem' }}><Phone /></Grid>
                                <Typography variant="body2" >Phone: +123456789</Typography>
                            </Grid>

                        </Container>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Container style={{ textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>Connect with Us</Typography>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <IconButton href="#" target="_blank">
                                    <Facebook style={{ color: '#fff' }} />
                                </IconButton>
                                <IconButton href="#" target="_blank">
                                    <Twitter style={{ color: '#fff' }} />
                                </IconButton>
                                <IconButton href="#" target="_blank">
                                    <Instagram style={{ color: '#fff' }} />
                                </IconButton>
                            </div>
                        </Container>
                    </Grid>

                </Grid>
            </Container>
        </footer >
    );
};

export default Footer;
