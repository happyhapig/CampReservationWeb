import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { cityList } from '../constants/list_city';
import Calendar from '../components/Calendar';
import api from '../api/axios';
import { Box, Button, Container, Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';

function Book() {

    const location = useLocation();
    const fromPath = location.state?.from || '/';
    const { campData, campsiteData } = location.state;
    const [reservationDatas, setReservation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/reservations?campId=${campData.id}`)
            .then(res => {
                setReservation(res.data.listReservation);
                setLoading(false);                
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            })
    }, []);

    // useEffect(() => {
    //     if(loading === true)
    //     {
    //         //在這裡才拿得到最新的資料
    //         setLoading(false);
    //     }
    // }, [loading]);

    
    const handleClick = (campId, campsiteData) => {
        // setLoading(true);

        // setReservation(res.data.listReservation);
        navigate(`/campsite/${campId}/${campsiteData.id}`, { 
            replace: true,
            state: { campData, campsiteData }});
    };
    

    if (!campData) return <p>無法取得營地資料</p>;
    if (loading) return <p>載入中...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Box>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Grid container columns={12} columnSpacing={2} rowSpacing={2} 
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                    }}>
                    {/* 標題 */}
                    <Grid sx={{ gridColumn: 'span 9', textAlign: 'left'}}>
                        <Typography variant="h4" fontWeight="bold">
                        {campData.name}
                        <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                            ({cityList[campData.city].name}{campData.county})
                        </Typography>
                        </Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: 'span 3', textAlign: 'right'}}>
                        <Button onClick={() => navigate(fromPath)} sx={{ fontWeight: 'bold', fontSize: '1rem'}}>
                            回上一頁
                        </Button>
                    </Grid>

                    {/* 營位列表 */}
                    <Grid sx={{ gridColumn: 'span 12'}}>
                        <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', px: 1, textAlign: 'left', scrollbarWidth: 'thin' }}>
                            {campData.campsites.map((data) => (
                                <Box
                                    key={data.id}
                                    sx={{
                                        display: 'inline-block',
                                        width: 90,
                                        mr: 2,
                                        verticalAlign: 'top',
                                        boxShadow: 'none',
                                        my: 0.5,
                                    }}
                                >
                                    <Card
                                        onClick={() => handleClick(campData.id, data)}
                                        sx={{                                            
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            bgcolor: 'transparent',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={data.picture}
                                            alt={data.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent 
                                            sx={{ 
                                                backgroundColor: 'transparent', 
                                                textAlign: 'center', 
                                                p: 0.5, 
                                                '&:last-child': {
                                                    pb: '4px', // 壓掉預設的 padding-bottom
                                                }, }}>
                                            <Typography fontSize={12} fontWeight="bold">
                                                {data.name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
            
                    {/* 所選營位資訊 */}
                    <Grid sx={{ gridColumn: 
                        {
                            xs: 'span 12',
                            sm: 'span 5',
                            md: 'span 6',
                        }}}>
                        <Box>
                            <Typography display="inline-block">
                                {campsiteData.name} (共 {campsiteData.amount}
                                {campsiteData.amount > 1 ? '帳' : '區'})
                            </Typography>
                            <Typography display="inline-block" sx={{ ml: 1 }}>
                                {campsiteData.amount > 1 ? '每帳' : '每區'} NT${campsiteData.price}
                            </Typography>
                        </Box>
                        <Box
                            component="img"
                            src={campsiteData.picture}
                            alt={campsiteData.name}
                            sx={{ mt: 1, width: '100%' }}
                        />
                    </Grid>
            
                    {/* 月曆 */}
                    <Grid sx={{ gridColumn: {
                            xs: 'span 12',
                            sm: 'span 7',
                            md: 'span 6',
                        }}}>
                        <Calendar
                            campsiteId={campsiteData.id}
                            reservations={reservationDatas}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
      );
}

export default Book;