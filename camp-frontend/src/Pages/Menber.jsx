import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';

const Member = () => {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get(`/order/${user.userId}`);
                setOrders(res.data.orders);
            } catch (err) {
                console.error('取得訂單失敗:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId) {
            fetchOrders();
        }
    }, [user]);

    return (
        <Box>
            <Navbar />
            <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 5 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{mb: 5}}>
                    會員訂單紀錄
                </Typography>

                {loading ? (
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : orders.length === 0 ? (
                    <Typography color="textSecondary">尚無訂單紀錄</Typography>
                ) : (
                    orders.map((order, index) => (
                        <Paper key={index} sx={{ p: 3, mb: 3 }}>
                            <Typography fontWeight="bold" sx={{ mb: 1 }}>
                                訂單時間：{dayjs(order.createdAt).format('YYYY.MM.DD HH:mm')}
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                <TableRow>
                                    <TableCell align='center'>營區</TableCell>
                                    <TableCell align='center'>入住日期</TableCell>
                                    <TableCell align='center'>拔營日期</TableCell>
                                    <TableCell align='center'>天數</TableCell>
                                    <TableCell align='center'>帳數</TableCell>
                                    <TableCell align='center'>單價</TableCell>
                                    <TableCell align='center'>小計</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items.map((item, i) => {
                                        const endDate = dayjs(item.date).add(item.nights, 'day').format('YYYY.MM.DD');
                                        const subtotal = item.price * item.amount * item.nights;
                                        return (
                                        <TableRow key={i}>
                                            <TableCell align='center'>{item.campName} <br />({item.campsiteName})</TableCell>
                                            <TableCell align='center'>{dayjs(item.date).format('YYYY.MM.DD')}</TableCell>
                                            <TableCell align='center'>{endDate}</TableCell>
                                            <TableCell align='center'>{item.nights}</TableCell>
                                            <TableCell align='center'>{item.amount}</TableCell>
                                            <TableCell align='center'>{item.price}</TableCell>
                                            <TableCell align='center'>{subtotal}</TableCell>
                                        </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Member;