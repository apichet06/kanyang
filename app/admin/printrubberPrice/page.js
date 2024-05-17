'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../../utils/config'
import axios from 'axios'
import { formatDate, formatPrice } from '../../utils/allfunctions'
import ComponentToPrint from './ComponentToPrint'
import { useReactToPrint } from 'react-to-print'

export default function page() {
    const searchParams = useSearchParams()
    const r_number = searchParams.get('r_number')
    const u_firstname = searchParams.get('u_firstname')
    const [data, setData] = useState([]);
    const [isPrinting, setIsPrinting] = useState(false);


    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onBeforeGetContent: () => {
            setIsPrinting(true); // เซ็ตสถานะเมื่อผู้ใช้กดปุ่ม "พิมพ์"
        },
        onAfterPrint: () => {
            setIsPrinting(false); // เซ็ตสถานะเมื่อพิมพ์เสร็จสิ้น
        }
    })


    const showData = useCallback(async () => {

        const Data = { r_number, u_firstname }
        const response = await axios.post(api + "/weightprice/weight", Data);

        if (response.status === 200) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const filteredData = response.data.data.filter(item => {
                const itemDate = new Date(item.r_rubber_date);
                const itemYear = itemDate.getFullYear();
                const itemMonth = itemDate.getMonth() + 1;
                return itemYear === currentYear && itemMonth === currentMonth;
            });

            setData(filteredData);


        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [api, r_number, u_firstname])


    useEffect(() => {
        showData()
    }, [showData])

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className='col-md-12 mt-5 mb-2 text-end'>
                    <button className='btn btn-sm btn-dark' onClick={handlePrint} >พิมพ์</button>
                </div>
                <div className="col-md-12 mb-5"  >
                    {data.map((item, index) => (<>
                        <hr key={index} />
                        <div className='fs-5 fw-bolder'>ชื่อ : {item.username}</div>
                        <div>ที่อยู่ : {item.Address}</div>
                        <div>วันที่ขาย : {formatDate(item.r_rubber_date)} รอบขายประจำเดือน : รอบที่ {item.r_around}</div>
                        <div className='fs-5'>ราคาประมูล : {formatPrice(item.r_rubber_price)} น้ำหนักรวม : {item.w_weigth} กิโลกรัม </div>
                        <h3 className='fw-bold'>รวมเป็นเงิน : {formatPrice(item.w_price)} </h3>
                    </>))}
                </div>
                <div style={{ display: 'none' }}>
                    {isPrinting && <ComponentToPrint data={data} ref={componentRef} />}
                </div>
            </div>
        </div>
    )
}
