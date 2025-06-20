import React from 'react';
import '../App.css';
import { cityList } from '../constants/list_city';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

function CampBlock({camp}) {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/campsite/${camp.id}`, { state: camp });
    };

    return (
        <Card 
            onClick={handleClick} 
            sx={{ 
                width: '100%',
                border: '1px solid #d4d4d8',
                borderRadius: 2,
                cursor: 'pointer',
                overflow: 'hidden',
                bgcolor: 'transparent',
            }}
        >
            <CardMedia
                component="img"
                image={camp.picture}
                alt={camp.name}
                sx={{ 
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 1
                }}
            />
            <CardContent sx=
                {{ 
                    backgroundColor: 'transparent',
                    pb: '16px !important',
                }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                    {cityList[camp.city].name}．{camp.county}．海拔 {camp.altitude}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                    {camp.name}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default CampBlock;