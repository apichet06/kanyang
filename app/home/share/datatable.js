'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice } from '../../utils/allfunctions';
import { decodeToken } from '../../utils/decodeToken';
import Cookie from 'js-cookie'


export default function Datatable() {

    const token = Cookie.get('token');
    const userId = decodeToken(token)?.userId;

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);


    const columns = [
        { name: 'ปี', selector: row => row.r_rubber_year, width: '65px' },
        { name: 'เลขหุ้น', selector: row => row.u_number, width: '110px' },
        { name: 'ชื่อ-สกุล', selector: row => row.u_title + '' + row.u_firstname + ' ' + row.u_lastname, width: '175px' },
        { name: 'ที่อยู่', selector: row => row.u_address, width: '200px' },
        { name: 'จำนวนหุ้น', selector: row => formatPrice(row.u_share) },
        { name: 'เปอร์เซ็นหุ้น', selector: row => (row.percent) + '%' },
        { name: 'เงินปันผลหุ้น', selector: row => formatPrice(row.Sumpercentshare) },
        { name: 'น้ำหนักหัวตันรวม', selector: row => row.Sumweight },
        { name: 'เปอร์เซ็นหัวตัน', selector: row => (row.percent_yang) + '%' },
        { name: 'เงินปันผลหัวตัน', selector: row => formatPrice(row.sumhuatun) },
        { name: 'เงินปันผลรวม', selector: row => formatPrice(row.sumPrice) },
    ];




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
