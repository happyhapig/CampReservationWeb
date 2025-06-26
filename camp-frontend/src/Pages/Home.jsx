import React, { useEffect, useState } from 'react';
import '../App.css';
import Navbar from '../components/Navbar';
import CampBlock from '../components/CampBlock';
import CampFilter from '../components/CampFilter';
import Footer from '../components/Footer';
import api from '../api/axios';
import { Container, Grid, Box, Typography } from '@mui/material';

const Home = () => {
    const [campList, setCampList] = useState([]);
    const [selectedAreas, setAreas] = useState([]);
    const [selectedTypes, setTypes] = useState([]);
    const [filteredList, setFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        api.get(`${baseURL}/camps`)
            .then(res => {
                setCampList(res.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result_filtered = (campList || []).filter((camp) => {
            const result_area = selectedAreas.length === 0 || selectedAreas.includes(Number(camp.area));
            const result_type = selectedTypes.length === 0 || selectedTypes.includes(Number(camp.type));
            return result_area && result_type;
        });
        
        setFilter(result_filtered);        
    }, [campList, selectedAreas, selectedTypes]);

    if (loading) return <p>載入中...</p>;
    if (error) return <p>載入錯誤</p>;

    return (
        <Box>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 2 }}>
                <Grid container direction="column" spacing={2}>
                    <Grid>
                        <Box display="flex" justifyContent="flex-start">
                            <CampFilter
                                selectedAreas={selectedAreas}
                                selectedTypes={selectedTypes}
                                setAreas={setAreas}
                                setTypes={setTypes}
                            />
                        </Box>
                    </Grid>
            
                    <Grid sx={{ mb: 3 }}>
                        {filteredList.length === 0 ? (
                            <Typography align="center">目前沒有資料</Typography>
                            ) : (
                            <Grid
                                container
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(12, 1fr)',
                                    gap: 3,
                                }}
                            >
                                {filteredList.map((camp) => (
                                    <Grid 
                                        key={camp._id}
                                        sx={{
                                            gridColumn: {
                                                xs: 'span 12',
                                                sm: 'span 6',
                                                md: 'span 3',
                                            },
                                        }}
                                    >
                                        <CampBlock camp={camp} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
}

export default Home;