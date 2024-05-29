'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import { api } from "../../utils/config";
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import Swal from 'sweetalert2';
export default function datatable() {


    const columns = [
        { name: 'ลำดับ', selector: row => row.autoID, width: '135px' },
        { name: 'ปี', selector: row => row.s_year, width: '105px' },
        { name: 'เปอร์เซ็นที่ปันผลหุ้น', selector: row => row.s_percent + '%', width: '140px' },
        { name: 'ปันผลเปอร์เซ็นหัวตัน', selector: row => Number(row.s_huatun).toLocaleString() + '%' },
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
    const [s_year, setSyear] = useState('')
    const [s_percent, setSpercent] = useState('')
    const [s_huatun, setShuatun] = useState('')
    const [editID, setEditID] = useState('');


    const fetchData = useCallback(async () => {

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const Data = {
                s_year: s_year, s_percent, s_huatun
            }


            const apiUrl = editID ? `${api}/sharepercent/${editID}` : `${api}/sharepercent`
            const response = await (editID ? axios.put(apiUrl, Data) : axios.post(apiUrl, Data));

            if (response.status === 200) {

                showSuccessAlert(response.data.message);
                fetchData();
                handleReset()

            }
        } catch (error) {
            console.log(error.response.data.message);
            showErrorAlert(error.response.data.message);
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

                    try {
                        const response = await axios.delete(`${api}/sharepercent/${id}`, {
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

    const handleEdit = async (id) => {

        setEditID(id)
        const Data = await data.find(data => data.id === id);

        if (Data) {
            setSyear(Data.s_year)
            setSpercent(Data.s_percent)
            setShuatun(Data.s_huatun)
        }
    }


    const handleReset = async () => {
        setEditID('')
        setSpercent('')
        setSyear('')
        setShuatun('')
    }


    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <>
            <div className='col-md-7 text-end mb-3'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">ปีปันผลหุ้น</label>
                        <div className="col-sm-6">
                            <select className="form-select" value={s_year} name="s_year" onChange={(e) => setSyear(e.target.value)} required>
                                <option value="">เลือกปี</option>
                                {Array.from({ length: 4 }, (_, index) => {
                                    const year = new Date().getFullYear() - 2 + index;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">แบ่งเปอร์เซ็นหุ้น</label>
                        <div className="col-sm-6">
                            <input type="number" className="form-control" value={s_percent} name="s_percent" onChange={(e) => setSpercent(e.target.value)} required />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">แบ่งเปอร์เซ็นหัวตัน</label>
                        <div className="col-sm-6">
                            <input type="number" className="form-control" value={s_huatun} name="s_huatun" onChange={(e) => setShuatun(e.target.value)} required />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label"> </label>
                        <div className="col-sm-6 text-center">
                            <button type="submit" className='btn btn-primary' >{editID ? 'แก้ไข' : 'เพิ่ม'}</button> &nbsp;
                            {editID && <button type="submit" className='btn btn-info' onClick={handleReset}>คืนค่า</button>}
                        </div>
                    </div>
                </form >

                <hr />
            </div >

            <div className="col-md-7 mb-5">
                <div className="card">
                    <div className="card-body mb-5">
                        <h3>ข้อมูลเปอร์เซ็นปันผลหุ้น/หัวตันประจำปี</h3>
                        <strong className='text-danger'>***การจัดการข้อมูลการเปอร์เซ็นต์ปันผลหุ้น/เปอร์เซ็นต์หัวตันในแต่ละปี</strong>
                        <DataTable
                            title=""
                            columns={columns}
                            data={data}
                            pagination
                            progressPending={pending}
                        />
                    </div>
                </div>
                <hr />

            </div>
        </>

    )
}
