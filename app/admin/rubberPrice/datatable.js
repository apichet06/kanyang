'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice } from '../../utils/allfunctions';
import Swal from 'sweetalert2';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

export default function datatable() {

    const [r_rubber_price, setRrubberPrice] = useState('')
    const [r_rubber_date, setRrubberDate] = useState('')


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
                    <button onClick={() => { handleEdit(row.r_number); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.r_number)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true
        },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);

    const showData = useCallback(async () => {

        try {
            const response = await axios.get(api + "/rubberprice");

            if (response.status === 200) {
                const NewData = await response.data.data.map((item, index) => ({
                    ...item, autoID: index + 1
                }))
                setData(NewData);
                setPending(false);
            }
        } catch (error) {
            console.log(error.message);
        }

    }, [api])

    const handleDelete = async (id) => {

        console.log(id);

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

                    try {
                        const response = await axios.delete(`${api}/rubberprice/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            console.log(response.data);
                            await showSuccessAlert(response.data.message)
                            // รีเฟรชข้อมูลหลังจากลบ
                            await fetchData();
                        }
                    } catch (error) {

                        showErrorAlert(error.message)
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const Data = {
            r_rubber_price: r_rubber_price,
            r_rubber_date: r_rubber_date
        }
    }










    useEffect(() => {
        showData();
    }, [showData])

    return (
        <>

            <div className='col-md-9 text-end mb-3'>
                <div>
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">ราคาประมูลยางพารา</label>
                        <div className="col-sm-6">
                            <input type="text" className="form-control" name="r_rubber_price" placeholder='ราคาประมูลยางพารา' onChange={(e) => setRrubberPrice(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label">วันที่ขาย</label>
                        <div className="col-sm-6">
                            <input type="date" className="form-control" name="r_rubber_date" onChange={(e) => setRrubberDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label"> </label>
                        <div className="col-sm-6 text-center">
                            <button type="submit" className='btn   btn-primary'>เพิ่ม</button>
                        </div>
                    </div>
                </div>

                <hr />
            </div>
            <div className="col-md-9">
                <div className="card">
                    <div className="card-body">
                        <DataTable
                            title="ข้อมูลราคายางพารา"
                            columns={columns}
                            data={data}
                            pagination
                            progressPending={pending}
                        />
                    </div>
                </div>
            </div>

        </>

    )
}
