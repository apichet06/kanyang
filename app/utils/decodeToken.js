const jwt = require('jsonwebtoken');
export function decodeToken(token) {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการถอดรหัส token:', error.message);
        return null;
    }
}
