'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import Modal from './modal';
import axios from 'axios';
import { api } from "../../utils/config";
import Swal from 'sweetalert2';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';


export default function datatable() {

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [editID, setEditID] = useState('');
    const [showModal, setshowModal] = useState(false)

    const [userData, setUserData] = useState({
        u_title: '',
        u_firstname: '',
        u_lastname: '',
        u_address: '',
        provinces_id: '',
        districts_id: '',
        subdistricts_id: '',
        u_share: '',
        u_status: ''
    });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    };


    const columns = [
        { name: 'ลำดับ', selector: row => row.autoID, width: '65px' },
        { name: 'เลขหุ้น', selector: row => row.u_number, width: '135px' },
        { name: 'ชื่อ-สกุล', selector: row => row.username, width: '175px' },
        { name: 'ที่อยู่', selector: row => row.u_addressfull, width: '470px' },
        { name: 'จำนวนหุ้น', selector: row => Number(row.u_share).toLocaleString() },
        { name: 'สถานะ', selector: row => row.u_status, width: '100px' },
        {
            name: "จัดการ",
            cell: (row) => (
                <>
                    <button onClick={() => { handleEdit(row.u_number) }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.u_number)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true, width: '130px'
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
            setEditID(id)
            setshowModal(true)
            const Data = await data.find(data => data.u_number === id);
            if (Data) {
                setUserData({
                    u_title: Data.u_title,
                    u_firstname: Data.u_firstname,
                    u_lastname: Data.u_lastname,
                    u_address: Data.u_address,
                    provinces_id: Data.provinces_id,
                    districts_id: Data.districts_id,
                    subdistricts_id: Data.subdistricts_id,
                    u_share: Data.u_share,
                    u_status: Data.u_status
                });
            }

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

                    try {
                        const response = await axios.delete(`${api}/users/${id}`, {
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.status === 200) {
                            console.log(response.data);
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


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {

            const apiUrl = editID ? `${api}/users/${editID}` : `${api}/users`
            const response = await (editID ? axios.put(apiUrl, userData) : axios.post(apiUrl, userData));

            if (response.status === 200) {

                showSuccessAlert(response.data.message);
                fetchData();
                setUserData({
                    u_title: '',
                    u_firstname: '',
                    u_lastname: '',
                    u_address: '',
                    provinces_id: '',
                    districts_id: '',
                    subdistricts_id: '',
                    u_share: '',
                    u_status: ''
                });
                setshowModal(false)

            }
        } catch (error) {
            console.log(error.message);
            showErrorAlert(error.message);
        }

    }, [api, fetchData, userData])


    useEffect(() => {
        fetchData();
    }, [fetchData])


    const AddForm = (() => {
        setEditID('')
        setshowModal(true)
        setUserData({
            u_title: '',
            u_firstname: '',
            u_lastname: '',
            u_address: '',
            provinces_id: '',
            districts_id: '',
            subdistricts_id: '',
            u_share: '',
            u_status: ''
        });
    })


    return (
        <>
            <div className='col-md-12 text-end mb-3'>
                <button type="button" className="btn btn-primary " onClick={() => { AddForm(); }}>
                    เพิ่ม
                </button>
                <hr />
            </div>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <DataTable
                            title="ข้อมูลสมาชิก"
                            columns={columns}
                            data={data}
                            pagination
                            progressPending={pending} />
                    </div>
                </div>
            </div>


            <Modal editID={editID} handleInputChange={handleInputChange} handleSubmit={handleSubmit}
                userData={userData} showModal={showModal} hideModal={() => setshowModal(false)} />
        </>

    )
}
