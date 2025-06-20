import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import generateCalendarData from '../utils/generateCalendarData';
import { useLocation } from "react-router-dom";
import { useCart } from '../context/CartContext';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

const Calendar = ({campsiteId, reservations}) => {

    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [currentReservation, setReservation] = useState([]);
    const [isAvaliable, setAvaliable] = useState(false);
    const [reservationMonthList, setReservationMonthList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [maxAvailableSlots, setMaxAvailableSlots] = useState(0);
    const [maxStayNights, setMaxStayNights] = useState(0);
    const [selectedAmount, setSelectedAmount] = useState('');
    const [selectedNights, setSelectedNights] = useState('');
    const [nextMonthReservation, setNextMonthReservation] = useState([]);
    const [prevMonthReservation, setPrevMonthReservation] = useState([]);
    
    const location = useLocation();
    const { campData, campsiteData } = location.state;

    const { addToCart, cartItems } = useCart();

    // 計算目前月份數字 (年 × 12 + 月)
    const getMonthNumber = (dateStr) => {
        const [year, month] = dateStr.split('-');
        return parseInt(year) * 12 + parseInt(month);
    };

    const year = currentMonth.year();
    const month = currentMonth.month() + 1;
    const currentMonthStr = `${year}-${month}`;
    const nextMonth = currentMonth.clone().add(1, 'month');
    const nextMonthStr = `${nextMonth.year()}-${nextMonth.month() + 1}`;
    const prevMonth = currentMonth.clone().subtract(1, 'month');
    const prevMonthStr = `${prevMonth.year()}-${prevMonth.month() + 1}`;

    const currentMonthNum = getMonthNumber(currentMonthStr);
    const availableMonthNums = reservationMonthList.map(getMonthNumber).sort((a, b) => a - b);
    const minMonthNum = availableMonthNums[0] || 0;
    const maxMonthNum = availableMonthNums[availableMonthNums.length - 1] || 0;

    const today = dayjs();
    const thisYear = today.year();
    const thisMonth = today.month() + 1;
    const todayStr = `${thisYear}-${thisMonth}`;
    const todayNum = getMonthNumber(todayStr);
    const isThisMonth = currentMonthNum === todayNum;

    const isPrevDisabled = isThisMonth || currentMonthNum <= minMonthNum;
    const isNextDisabled = currentMonthNum >= maxMonthNum;    

    useEffect(() => {

        const months = reservations.map(r => r.date);
        const uniqueMonths = Array.from(new Set(months)).sort();
        setReservationMonthList((prev) => {
            const isSame =
            prev.length === uniqueMonths.length &&
            prev.every((val, idx) => val === uniqueMonths[idx]);

            return isSame ? prev : uniqueMonths;
        });

        const monthData = reservations.find(r => r.date === currentMonthStr && r.campsiteId === campsiteId);

        if (!monthData || !monthData.availability) {
            setAvaliable(false);
            setReservation([]);
            return;
        }

        const currentAvailability = Object.entries(monthData.availability).map(
            ([day, remaining]) => ({
                day: Number(day),
                remaining,
            })
        );

        setReservation(currentAvailability);
        setAvaliable(true);

        // 找出次月的資料
        const nextMonthData = reservations.find(r => r.date === nextMonthStr && r.campsiteId === campsiteId);
        
        if (nextMonthData && nextMonthData.availability) {
            const nextAvailability = Object.entries(nextMonthData.availability).map(
            ([day, remaining]) => ({
                day: Number(day),
                remaining,
            }));
            
            setNextMonthReservation(nextAvailability);
        } else {
            setNextMonthReservation([]);
        }

        // 找出上個月的資料
        const prevMonthData = reservations.find(r => r.date === prevMonthStr && r.campsiteId === campsiteId);
        
        if (prevMonthData && prevMonthData.availability) {
            const prevAvailability = Object.entries(prevMonthData.availability).map(
            ([day, remaining]) => ({
                day: Number(day),
                remaining,
            }));
            
            setPrevMonthReservation(prevAvailability);
        } else {
            setPrevMonthReservation([]);
        }

    }, [currentMonth, reservations, campsiteId]);

    useEffect(() => {
        if (reservationMonthList.length > 0) {
            const today = dayjs();
            const todayStr = today.format("YYYY-M");

            if (reservationMonthList.includes(todayStr)) {
                // ✅ 若今天的月份有資料，優先顯示今天
                setCurrentMonth(dayjs(todayStr + '-01'));
            } else {
                // 否則 fallback 用最早的那一個月份
                const initialMonth = reservationMonthList[0];
                setCurrentMonth(dayjs(initialMonth + '-01'));
            }
        }
    }, [reservationMonthList]);

    // 計算帳數最大值 (只根據選取日)
    useEffect(() => {
        const baseDay = dayjs(selectedDate).date();
        const todayData = currentReservation.find(r => r.day === baseDay);
        const available = todayData ? Number(todayData.remaining) : 0;
        setMaxAvailableSlots(available);
        setSelectedAmount('');
        setSelectedNights('');
        setMaxStayNights(0);
    }, [selectedDate, currentReservation]);

    // 使用者選擇帳數後，判斷連續幾晚夠用
    useEffect(() => {
        if (!selectedAmount) return;

        const baseDay = selectedDate.date();
        const baseMonth = selectedDate.month(); // 0-based
        const baseYear = selectedDate.year();

        let maxNight = 0;

        for (let i = 0; i < 4; i++) {
            const checkDate = dayjs(selectedDate).add(i, 'day');
            const checkDay = checkDate.date();
            const checkMonth = checkDate.month();
            const checkYear = checkDate.year();

            let dayData = null;

            if (checkYear === baseYear && checkMonth === baseMonth) {
                dayData = currentReservation.find(r => r.day === checkDay);
            } else if (checkDate.format('YYYY-MM') === nextMonth.format('YYYY-MM')) {
                dayData = nextMonthReservation.find(r => r.day === checkDay);
            }

            if (dayData && Number(dayData.remaining) >= Number(selectedAmount)) {
                maxNight++;
            } else {
                break;
            }
        }

        setMaxStayNights(maxNight);
        setSelectedNights('');
    }, [selectedAmount, currentReservation, nextMonthReservation, selectedDate]);

    useEffect(() => {
        const todayDay = dayjs().date();
        const updatedDate = currentMonth.date(todayDay);
        setSelectedDate(updatedDate);
    }, [currentMonth]);

    const handlePrev = () => {
        if (!isPrevDisabled) setCurrentMonth(prev => prev.subtract(1, 'month'));
    };
    const handleNext = () => {
        if (!isNextDisabled) setCurrentMonth(prev => prev.add(1, 'month'));
    };
    const handleToday = () => {
        const now = dayjs();
        const nowStr = `${now.year()}-${now.month() + 1}`;
        if (reservationMonthList.includes(nowStr)) {
            setCurrentMonth(dayjs(nowStr + '-01'));
        }
    };

    // 畫月曆
    const calendarData = generateCalendarData(currentMonth);
    const lastDayIndex = calendarData.findLastIndex((item) => !item.isOtherMonth);
    const rowsToRender = Math.ceil((lastDayIndex + 1) / 7);    
    const visibleData = calendarData.slice(0, rowsToRender * 7);

    const handleAddToCart = () => {
        if (!selectedDate || !selectedAmount || !selectedNights) {
            alert("請選擇日期、帳數與天數");
            return;
        }

        const newItem = {
            campId: campData.id,
            campName: campData.name,
            campsiteId: campsiteData.id,
            campsiteName: campsiteData.name,
            date: selectedDate.format('YYYY-MM-DD'),
            nights: selectedNights,
            amount: selectedAmount,
            price: campsiteData.price,
        };

        addToCart(newItem);

        alert("已加入購物車");
    };

    const getAdjustedAvailability = (date, day) => {        
        
        const dateStr = switchDateStr(date);
        const isNextMonth = dateStr === nextMonthStr;
        const isPrevMonth = dateStr === prevMonthStr;

        const result = (isNextMonth ? nextMonthReservation : isPrevMonth ? prevMonthReservation : currentReservation)
            .find(r => r.day === day);
        
        const used = cartItems
            .filter(item =>
                item.campsiteId === campsiteId
            )
            .reduce((sum, item) => {
                const startDate = new Date(item.date);
                for (let i = 0; i < item.nights; i++) {
                    const current = new Date(startDate);
                    current.setDate(current.getDate() + i);
                    const yyyyMMdd = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
                    if (yyyyMMdd === `${date}-${String(day).padStart(2, '0')}`) {
                        return sum + Number(item.amount);
                    }
                }
                return sum;
            }, 0);
        
        return result ? Math.max(result.remaining - used, 0) : null;
    };

    const switchDateStr = (date) => {
        const [year, month] = date.split('-');
        return `${year}-${parseInt(month)}`;
    };

    return (
        <Box textAlign="center">
            {/* 標題月份 */}
            <Typography sx={{ mb: 1 }}>
                {currentMonth.format('M月 YYYY')}
            </Typography>
        
            {/* 控制按鈕 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handlePrev} disabled={isPrevDisabled}
                    sx={{ fontWeight: 'bold', color: 'white', borderRadius: 0, boxShadow: 3 }}
                >
                    ≪ 上個月
                </Button>
                <Button variant="contained" color="primary" onClick={handleToday}
                    sx={{ fontWeight: 'bold', color: 'white', borderRadius: 0, boxShadow: 3 }}
                >
                    今天
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext} disabled={isNextDisabled}
                    sx={{ fontWeight: 'bold', color: 'white', borderRadius: 0, boxShadow: 3 }}
                >
                    下個月 ≫
                </Button>
            </Box>
        
            {/* 星期標題 */}
            <Grid
                container
                sx={{
                    textAlign: 'center',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    mb: 1,
                }}
            >
                {WEEKDAYS.map((day, i) => (
                <Grid
                    key={day}
                    sx={{
                    color:
                        i === 0
                        ? 'red'
                        : i === 6
                        ? '#5a55e0'
                        : 'text.primary',                    
                    fontSize: 14,
                    }}
                >
                    {day}
                </Grid>
                ))}
            </Grid>
        
            {/* 日期格子區 or 尚未開放 */}
            {isAvaliable ? (
            <>
                <Grid
                    container
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                    }}
                >
                { visibleData.map((date, idx) => {
                    
                    const fullDate = date.fullDate;
                    const dateStr = dayjs(date.fullDate).format('YYYY-MM');
                    const remaining = getAdjustedAvailability(dateStr, date.day);

                    const today = dayjs();
                    const isPast = !date.isOtherMonth &&
                        dayjs(fullDate).isBefore(today, 'day') &&
                        dayjs(fullDate).isSame(today, 'month');
                    
                    const isSelected = remaining && dayjs(selectedDate).format('YYYY-MM-DD') === fullDate;

                    return (
                    <Grid
                        key={idx}
                        onClick={() => {
                            if (!isPast) setSelectedDate(dayjs(fullDate));
                        }}
                        sx={{
                            height: 50,
                            border: isSelected ? '2px solid #7c3aed' : '1px solid #e0e0e0',
                            backgroundColor: isSelected ? '#f3f0fc' : 'inherit',
                            gridColumn: 'span 1',
                            cursor: (date.isOtherMonth || isPast) ? 'default' : 'pointer',
                            
                        }}
                    >
                        <Typography
                            sx={{
                                color: date.isOtherMonth
                                ? '#d4d4d4'
                                : date.dayOfWeek === 0 || date.dayOfWeek === 6
                                ? '#d49450'
                                : 'text.primary',
                                fontSize: 12,
                                mt: 0.5,
                                opacity: isPast ? 0.5 : 1
                            }}
                        >
                            {date.day}
                        </Typography>
                            
                        { remaining !== null ? (
                            <Typography
                                variant="caption"
                                sx={{ fontSize: 13, color: (remaining === 0) ? '#F06449' : '#9872fc', fontWeight: 'bold', opacity: isPast ? 0.5 : 1 }}
                            >
                                { remaining === 0
                                    ? '已滿'
                                    : `剩 ${remaining}`
                                }
                            </Typography>
                        ) : ('')}
                    </Grid>
                    );
                })}
                </Grid>
                <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <Typography fontSize={16} sx={{ textAlign: 'center' }}>帳數</Typography>
                        <FormControl size="small" sx={{ minWidth: 100, ml: 1 }}>
                            <Select
                                value={selectedAmount}
                                displayEmpty
                                onChange={(e) => setSelectedAmount(e.target.value)}
                            >
                                {Array.from({ length: maxAvailableSlots }, (_, i) => i + 1).map((num) => (
                                    <MenuItem key={num} value={num}>{num}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <Typography fontSize={16} sx={{ textAlign: 'center' }}>天數</Typography>
                        <FormControl size="small" sx={{ minWidth: 150, ml: 1}}>
                            <Select
                                value={selectedNights}
                                displayEmpty
                                onChange={(e) => setSelectedNights(e.target.value)}
                            >
                                {[1, 2, 3, 4].map((n) => {
                                    const isDisabled = n > maxStayNights;
                                    return (
                                    <MenuItem
                                        key={n}
                                        value={n}
                                        disabled={isDisabled}
                                        sx={isDisabled ? { color: '#949494' } : {}}
                                    >
                                        {isDisabled
                                        ? `${['一', '二', '三', '四'][n - 1]}晚（數量不足）`
                                        : `${['一', '二', '三', '四'][n - 1]}晚`}
                                    </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', color: 'white' }}
                        onClick={handleAddToCart}
                    >
                        加入購物車
                    </Button>
                </Box >                
            </>
            ) : (
                <Typography align="center" sx={{ mt: 4, color: '#999' }}>尚未開放訂位</Typography>
            )}
            
        </Box>
    );
};

export default Calendar;