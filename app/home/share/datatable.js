'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";
import formatPrice from '@/app/utils/allfunctions';

const columns = [
    { name: 'ปี', selector: row => row.year_w_datetime },
    { name: 'เลขหุ้น', selector: row => row.u_number },
    { name: 'ชื่อ-สกุล', selector: row => row.u_title + '' + row.u_firstname + ' ' + row.u_lastname, width: '175px' },
    { name: 'จำนวนหุ้น', selector: row => formatPrice(row.u_share) },
    { name: 'เปอร์เซ็นหุ้น', selector: row => (row.percent) + '%' },
    { name: 'เงินปันผลหุ้น', selector: row => formatPrice(row.shareCount) },
    { name: 'น้หนักหัวตันรวม', selector: row => row.weightSum },
    { name: 'เปอร์เซ็นหัวตัน', selector: row => formatPrice(row.percent_yang) },
    { name: 'เงินปันผลหัวตัน', selector: row => formatPrice(row.weightPriceSum) },
    { name: 'รวมเงินทั้งหมด', selector: row => formatPrice(row.sumPrice) },
];


export default function Datatable() {
    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/sharepercent/share");

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
            title="เงินปันผลประจำปี"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
