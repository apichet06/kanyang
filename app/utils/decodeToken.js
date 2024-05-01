// นำเข้าโมดูล cookies จาก next/headers
import { cookies } from "next/headers";

// สร้างฟังก์ชันสำหรับถอดรหัส Token
export function decodeToken(token) {
    // ใช้ฟังก์ชัน split() เพื่อแบ่ง Token ตาม "." เพื่อนำไปถอดรหัส
    const parts = token.split('.');
    // ถ้ามีส่วนของ Token น้อยกว่า 3 ส่วน หรือส่วนใดส่วนหนึ่งเป็นค่าว่าง ให้คืนค่า null
    if (parts.length !== 3 || !parts[1]) {
        return null;
    }
    // ทำการถอดรหัสส่วนข้อมูลจาก Base64 เพื่อให้ได้ส่วนข้อมูลที่ถูกเข้ารหัส
    const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
    // คืนค่าข้อมูลในรูปแบบ JSON ที่ถอดรหัสแล้ว
    return JSON.parse(decoded);
}
