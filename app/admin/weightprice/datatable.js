'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate, formatDateTime } from '../../utils/allfunctions';

export default function datatable() {


    const columns = [
        { name: 'ลำดับ', selector: row => row.autoID, width: '62px' },
        { name: 'ID', selector: row => row.w_number, width: '120px' },
        { name: 'เลขหุ้น', selector: row => row.u_number, width: '110px' },
        { name: 'สามชิก', selector: row => row.username, width: '175px' },
        { name: 'รอบขายยางพารา', selector: row => row.r_around, width: '120px' },
        { name: 'ราคาขายยางพารา', selector: row => formatPrice(row.r_rubber_price) },
        { name: 'น้ำหนัก', selector: row => Number(row.w_weigth).toFixed(2).toLocaleString() },
        { name: 'จำนวนเงิน', selector: row => formatPrice(row.w_price) },
        { name: 'วันขาย', selector: row => formatDate(row.r_rubber_date), width: '110px' },
        { name: 'ผู้บันทึก', selector: row => row.uadmin, width: '180px' },
        { name: 'วันที่บันทึก', selector: row => formatDateTime(row.w_datetime), width: '150px' },
        {
            name: "จัดการ",
            cell: (row) => (
                <>
                    <button onClick={() => { handleEdit(row.id); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.id)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true, width: '140px'
        },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        const response = await axios.get(api + "/weightprice");

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
            title="น้ำหนักยางพารา/ราคาขาย"
            columns={columns}
            data={data}
            pagination
            progressPending={pending}
        />
    )
}
