import { format } from 'date-fns';

export function formatPrice(price) {
    return Number(price).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
    });
}

export function formatDate(date) {
    return format(date, 'yyyy/MM/dd')
}

export function formatDateTime(date) {
    return format(date, 'yyyy/MM/dd HH:mm')
}


export function isLeapYear(year) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeap ? 29 : 28;
}
