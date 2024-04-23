'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";

function formatPrice(price) {
    return Number(price).toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
    });
}

const columns = [
    { name: 'ID', selector: row => row.w_number },
    { name: 'ปี/เดือน', selector: row => format(row.r_rubber_date, 'yyyy/MM') },
    { name: 'รอบขาย', selector: row => row.r_around },
    { name: 'น้ำหนัก', selector: row => Number(row.w_weigth).toLocaleString() },
    { name: 'ราคาขาย', selector: row => formatPrice(row.r_rubber_price) },
    { name: 'จำนวนเงิน', selector: row => formatPrice(row.w_price) },
    { name: 'สมาชิก', selector: row => row.username, width: '175px' },
    { name: 'ผู้บันทึก', selector: row => row.uadmin, width: '175px' },
    { name: 'วันที่บันทึก', selector: row => format(row.w_datetime, 'yyyy/MM/dd HH:mm'), width: '175px' },
];

export default function Datatable() {
    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/weightprice/users/U10000001");

        if (response.status === 200) {

            setData(response.data.data);
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [api])

    useEffect(() => {
        showData();
    }, [showData])

    return (
        <DataTable
            title="ประวัติรายการขายยางประจำเดือน"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
