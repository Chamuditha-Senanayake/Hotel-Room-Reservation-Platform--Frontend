import React from 'react';
import { Container, Typography, Button, Grid, Slide } from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import room1Image from '../assets/images/img-1.jpg';
import room2Image from '../assets/images/img-2.jpg';
import room3Image from '../assets/images/img-3.jpg';

const LandingPage = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Slider {...settings} style={{ height: '100vh', overflow: 'hidden', }}>
                <div>
                    <img src={room1Image} alt="Room 1" style={{ width: '100%', height: 'auto', opacity: 0.6 }} />
                </div>
                <div>
                    <img src={room2Image} alt="Room 2" style={{ width: '100%', height: 'auto', opacity: 0.6 }} />
                </div>
                <div>
                    <img src={room3Image} alt="Room 3" style={{ width: '100%', height: 'auto', opacity: 0.6 }} />
                </div>
            </Slider>
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#fff' }}>
                <Typography variant="h1" gutterBottom style={{ color: '#00021E' }}>
                    <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '6rem' }}>Welcome to</span>
                    <br />
                    <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '6rem' }}>Hotel Lake Side</span>
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Link to="/reservations">
                            <Button variant="contained" color="primary">Book Now</Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link to="/rooms">
                            <Button variant="outlined" color="primary">Explore Rooms</Button>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default LandingPage;
