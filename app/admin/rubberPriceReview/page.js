'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate } from '../../utils/allfunctions';

export default function page() {


    const columns = [
        { name: 'ID', selector: row => row.w_number },
        { name: 'ปี/เดือน', selector: row => format(row.r_rubber_date, 'yyyy/MM') },
        { name: 'รอบขาย', selector: row => row.r_around },
        { name: 'น้ำหนัก', selector: row => Number(row.w_weigth).toLocaleString() },
        { name: 'ราคาขาย', selector: row => formatPrice(row.r_rubber_price) },
        { name: 'จำนวนเงิน', selector: row => formatPrice(row.w_price) },
        { name: 'สมาชิก', selector: row => row.username, width: '175px' },
        { name: 'ผู้บันทึก', selector: row => row.uadmin, width: '175px' },
        { name: 'วันที่บันทึก', selector: row => formatDate(row.w_datetime), width: '175px' },
    ];


    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/weightprice");

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
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [api])

    useEffect(() => {
        showData();
    }, [showData])


    return (
        <>
            <div className="container">
                <div className="row ">
                    <div className='col-md-12 mt-5'>
                        <div className='row justify-content-center'>
                            <h4>รายการขายยางพาราประจำเดือน</h4>
                            <hr />
                            <DataTable

                                columns={columns}
                                data={data}
                                pagination
                                progressPending={pending}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
