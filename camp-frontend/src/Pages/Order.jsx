import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';
import dayjs from 'dayjs';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import api from '../api/axios';

const Order = () => {

    const navigate = useNavigate();
    const { cartItems, setCartItems, clearCart } = useCart();
    const { user } = useUser();

    const handleRemove = (index) => {
        const updated = [...cartItems];
        updated.splice(index, 1);
        setCartItems(updated);
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.amount * item.nights, 0);

    const handleSubmit = async () => {
        if (!user || !user.userId) {
            navigate('/login', { state: {from: '/order'} });
            return;
        }

        try {
            const payload = {
                userId: user.userId,
                items: cartItems
            };
            const res = await api.post('/order', payload);

            alert('訂單已送出！');
            clearCart();
            navigate('/'); // 或導向其他完成頁
        } catch (err) {
            console.error('訂單送出失敗:', err);
            alert('送出訂單時發生錯誤，請稍後再試。');
        }
    };

    return (
        <Box>
            <Navbar />
            <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{mb: 3}}>
                    訂購細項
                </Typography>

                <Table sx={{ tableLayout: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>入住營區</TableCell>
                            <TableCell align='center'>入住日期</TableCell>
                            <TableCell align='center'>拔營日期</TableCell>
                            <TableCell align='center'>天數</TableCell>                            
                            <TableCell align='center'>帳數</TableCell>
                            <TableCell align='center'>單價</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item, idx) => {
                            const endDate = dayjs(item.date).add(item.nights, 'day').format('YYYY.MM.DD');
                            return (
                                <TableRow key={idx}>
                                    <TableCell align='center'>
                                        {item.campName}
                                        <br />
                                        ( {item.campsiteName} )
                                    </TableCell>
                                    <TableCell align='center'>{dayjs(item.date).format('YYYY.MM.DD')}</TableCell>
                                    <TableCell align='center'>{endDate}</TableCell>
                                    <TableCell align='center'>{item.nights}</TableCell>                                
                                    <TableCell align='center'>{item.amount}</TableCell>
                                    <TableCell align='center'>{item.price}</TableCell>
                                    <TableCell align='right'>
                                        <IconButton onClick={() => handleRemove(idx)}>
                                            <CloseIcon sx={{ border: 1, borderRadius: 1, backgroundColor: 'grey', color: 'white'}} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <Box sx={{ backgroundColor: '#eee', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2, mb: 3 }}>
                    <Typography fontWeight="bold" sx={{ mr: 5 }}>總價</Typography>
                    <Typography fontWeight="bold">{total}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={() => navigate('/')} variant="contained" sx={{ mr: 2, backgroundColor: '#C9913E', color: 'white' }}>
                        {cartItems.length === 0 ? '前往購物' : '繼續購物'}
                    </Button>
                    <Button variant="contained" color="primary" disabled={cartItems.length === 0} onClick={handleSubmit}
                        sx={{
                            color: 'white',
                            opacity: cartItems.length === 0 ? 0.5 : 1,
                            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
                        }} 
                    >
                        確認訂位
                    </Button>
                </Box>
            </Box>
        </Box>        
    );
};

export default Order;