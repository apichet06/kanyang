import { api } from "../utils/config";
import axios from "axios";
import { format } from 'date-fns';

async function getWeightPrice() {
    const response = await axios.get(api + "/weightprice");

    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error("ไม่พบข้อมูล");
    }
}

function formatPrice(price) {
    return Number(price).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
    });
}

export default async function page() {
    try {
        const WeightPrice = await getWeightPrice();
        return (
            <div className="container">
                <div className='row'>
                    {WeightPrice.map((item, index) => (
                        <div className='col-md-3 mt-5' key={index}>
                            <div className="card" >
                                <div className="card-body">
                                    <h5 className="card-title">เดือน {new Date(item.w_datetime).getMonth() + 1}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">ID: {item.w_number}</h6>
                                    <div className="card-text text-success">รอบที่: {item.r_around}</div>
                                    <div className="card-text text-success">น้ำหนักช่าง: {Number(item.w_weigth).toLocaleString()}</div>
                                    <div className="card-text text-success">ราคาขาย: {formatPrice(item.r_rubber_price)}</div>
                                    <div className="card-text text-success">จำนวนเงิน: {formatPrice(item.w_price)}</div>
                                    <div className="card-text text-success">วันที่: {format(item.w_datetime, 'yyyy/MM/dd HH:mm')}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error(error.message);
        return (
            <div className="container">
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className="mt-5">ไม่พบข้อมูล สมาชิก</h1>
                    </div>
                </div>
            </div>
        );
    }
}
