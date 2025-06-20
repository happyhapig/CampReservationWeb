import Navbar from '../components/Navbar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { cityList } from '../constants/list_city';
import { Box, Container, Grid, Typography, Button, Card, CardMedia, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../api/axios'; // 你自己的 axios instance

function Campsite() {
    
    const location = useLocation();
    const { id } = useParams();
    const [campData, setCampData] = useState(location.state || null);
    const [loading, setLoading] = useState(!campData);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleClick = (campId, campsiteData) => {
        navigate(`/campsite/${campId}/${campsiteData.id}`, { 
            replace: true,
            state: { campData, campsiteData, from: location.pathname }});
    };
    
    useEffect(() => {
        // 如果 location.state 沒有資料，就從後端撈
        if (!location.state) {
        api.get(`/camps/${id}`)
            .then((res) => {
                setCampData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading camp:", err);
                setError("無法取得營地資料");
                setLoading(false);
            });
        }
    }, [id, location.state]);

    if (loading) return <p>載入中...</p>;
    if (error) return <p>{error}</p>;
    if (!campData) return <p>無法取得營地資料</p>;    

    return (
        <Box>
            <Navbar />
            <Container maxWidth="lg" sx={{ my: 5 }}>
                <Grid container columns={12} columnSpacing={2} rowSpacing={2} 
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                    }}>
                    {/* 標題 */}
                    <Grid sx={{ gridColumn: 'span 9', textAlign: 'left' }}>
                        <Typography variant="h4" fontWeight="bold">
                            {campData.name}
                            <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                                ({cityList[campData.city].name}{campData.county})
                            </Typography>
                        </Typography>
                    </Grid>
            
                    {/* 返回按鈕 */}
                    <Grid sx={{ gridColumn: 'span 3', textAlign: 'right' }}>
                        <Button href="/" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                            回上一頁
                        </Button>
                    </Grid>
                    {/* 圖片 */}
                    <Grid sx={{ gridColumn: {md: 'span 6', sm: 'span 12', xs: 'span 12'}, }}>
                        <Box
                            component="img"
                            src={campData.picture}
                            alt={campData.name}
                            sx={{ width: '100%', objectFit: 'cover' }}
                        />
                    </Grid>
                    <Grid sx={{ gridColumn: {md: 'span 6', sm: 'span 12', xs: 'span 12'}, }}>
                        <Box
                            component="img"
                            src={campData.campImg}
                            alt={campData.name}
                            sx={{ width: '100%', objectFit: 'cover' }}
                        />
                    </Grid>
            
                    {/* 營位列表 */}
                    <Grid sx={{ gridColumn: 'span 12' }}>
                        <Grid container sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(12, 1fr)',
                            columnGap: 2,
                            rowGap: 2,
                            mt: 4 
                        }}>
                        {campData.campsites.map((data) => (
                            <Grid key={data.id} sx={{ 
                                gridColumn: {
                                    xs: 'span 12',
                                    sm: 'span 6',
                                    md: 'span 3',
                            }, }}>
                                <Card
                                    onClick={() => handleClick(campData.id, data)}
                                    sx={{
                                        border: '1px solid #d4d4d8',
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        bgcolor: 'transparent',
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={data.picture}
                                        alt={data.name}
                                        sx={{ width: '100%', objectFit: 'cover', borderRadius: 2 }}
                                    />
                                    <CardContent sx=
                                        {{
                                            backgroundColor: 'transparent',
                                            pb: '16px !important',
                                        }}>
                                        <Typography fontWeight="bold">{data.name}</Typography>
                                        <Typography fontWeight="bold">
                                            {data.amount > 1 ? `共${data.amount}帳` : '包區'}
                                        </Typography>
                                        <Typography fontWeight="bold">
                                            {data.amount > 1 ? `每帳 NT$${data.price}` : `每區 NT$${data.price}`}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Campsite;