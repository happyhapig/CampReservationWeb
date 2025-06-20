import dayjs from 'dayjs';

export default function generateCalendarData(currentMonth) {

  const firstDay = currentMonth.startOf('month');
  const startWeekday = firstDay.day(); // 0 = Sunday
  const daysInMonth = currentMonth.daysInMonth();

  const days = [];

  // 上一個月補空格
  const prevMonth = currentMonth.subtract(1, 'month');
  const prevDays = prevMonth.daysInMonth();
  for (let i = startWeekday - 1; i >= 0; i--) {
    const date = prevMonth.date(prevDays - i);
    days.push({
      day: date.date(),
      dayOfWeek: date.day(),
      isToday: dayjs().isSame(date, 'day'),
      isOtherMonth: true,
      fullDate: date.format('YYYY-MM-DD'),
    });
  }

  // 當月日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = currentMonth.date(i);
    days.push({
      day: i,
      dayOfWeek: date.day(),
      isToday: dayjs().isSame(date, 'day'),
      isOtherMonth: false,
      fullDate: date.format('YYYY-MM-DD'),
    });
  }

  // 下個月補到滿 6 行
  const totalCells = Math.ceil(days.length / 7) * 7;
  const nextMonth = currentMonth.add(1, 'month');
  for (let i = 1; days.length < totalCells; i++) {
    const date = nextMonth.date(i);
    days.push({
      day: i,
      dayOfWeek: date.day(),
      isToday: dayjs().isSame(date, 'day'),
      isOtherMonth: true,
      fullDate: date.format('YYYY-MM-DD'),
    });
  }

  return days;
}