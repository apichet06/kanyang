'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import { api } from "../../utils/config";
import Swal from 'sweetalert2';
import { showErrorAlert, showSuccessAlert } from '@/app/utils/alertUtils';

export default function datatable() {

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const columns = [
        { name: 'ลำดับ', selector: row => row.autoID, width: '65px' },
        { name: 'เลขหุ้น', selector: row => row.u_number, width: '135px' },
        { name: 'ชื่อ-สกุล', selector: row => row.username, width: '175px' },
        { name: 'ที่อยู่', selector: row => row.u_address, width: '470px' },
        { name: 'จำนวนหุ้น', selector: row => Number(row.u_share).toLocaleString() },
        { name: 'สถานะ', selector: row => row.u_status, width: '100px' },
        {
            name: "จัดการ",
            cell: (row) => (
                <>
                    <button onClick={() => { handleEdit(row.u_number); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.u_number)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true
        },
    ];

    const fetchData = useCallback(async () => {

        const response = await axios.get(api + "/users");

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


    const handleEdit = async (id) => {
        try {
            console.log(id);
        } catch (error) {
            console.log(error);
        }
    }


    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: "ยืนยันการลบ",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ลบ!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    console.log(id);
                    try {
                        const response = await axios.delete(`${api}/users/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            await showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            await fetchData();
                        }
                    } catch (error) {
                        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
                        showErrorAlert(error.response.data.message)
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        fetchData();
    }, [fetchData])

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
