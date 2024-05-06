'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../utils/config";
import { formatPrice, formatDate } from '../utils/allfunctions';
import { decodeToken } from '../utils/decodeToken';
import Cookie from 'js-cookie'




export default function Datatable() {

    const token = Cookie.get('token');
    const userId = decodeToken(token)?.userId;

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);


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


    const showData = useCallback(async () => {

        const response = await axios.get(api + "/weightprice/users/" + userId);

        if (response.status === 200) {

            setData(response.data.data);
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [api, userId])

    useEffect(() => {
        showData();
    }, [showData])


    return (
        <DataTable
            title="รายการขายยางพาราประจำเดือน"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
