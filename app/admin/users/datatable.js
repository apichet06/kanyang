'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";

export default function datatable() {


    const columns = [
        { name: 'เลขหุ้น', selector: row => row.u_number, width: '135px' },
        { name: 'ชื่อ-สกุล', selector: row => row.username, width: '175px' },
        { name: 'ที่อยู่', selector: row => row.u_address, width: '500px' },
        { name: 'จำนวนหุ้น', selector: row => Number(row.u_share).toLocaleString() },

    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/users");

        if (response.status === 200) {
            console.log(response.data.data);
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
            title="ข้อมูลสมาชิก"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
