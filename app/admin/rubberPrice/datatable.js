'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice } from '../../utils/allfunctions';


export default function datatable() {


    const columns = [
        { name: 'ID', selector: row => row.autoID, width: '80px' },
        { name: 'รอบขายยางพารา', selector: row => row.r_around, width: '120px' },
        { name: 'เดือน', selector: row => format(row.r_rubber_date, 'yyyy/MM'), width: '130px' },
        { name: 'ราคาขายยางพารา', selector: row => formatPrice(row.r_rubber_price), width: '130px' },
        { name: 'ผู้บันทึก', selector: row => row.username, width: '190px' },
        { name: 'วันที่บันทึก', selector: row => format(row.r_rubber_date, 'yyyy/MM/dd'), width: '115px' },
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

        const response = await axios.get(api + "/rubberprice");

        if (response.status === 200) {
            const NewData = await response.data.data.map((item, index) => ({
                ...item, autoID: index + 1
            }))
            setData(NewData);
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
            title="ข้อมูลราคายางพารา"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
