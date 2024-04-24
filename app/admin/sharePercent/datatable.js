'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";

export default function datatable() {


    const columns = [
        { name: 'ลำดับ', selector: row => row.autoID, width: '135px' },
        { name: 'ปี', selector: row => row.s_year, width: '105px' },
        { name: 'เปอร์เซ็นที่ปันผลหุ้น', selector: row => row.s_percent + '%', width: '140px' },
        { name: 'ปันผลเปอร์เซ็นหัวตัน', selector: row => Number(row.s_money).toLocaleString() + '%' },
        {
            name: "จัดการ",
            cell: (row) => (
                <>
                    <button onClick={() => { handleEdit(row.id); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.id)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true
        },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/sharepercent");

        if (response.status === 200) {
            const newData = await response.data.data.map((item, index) => ({
                ...item, autoID: index + 1
            }))
            setData(newData);
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
            title="ข้อมูลเปอร์เซ็นปันผลหุ้น/หัวตันประจำปี"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
