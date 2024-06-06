'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import Modal from './modal';
import axios from 'axios';
import { api } from "../../utils/config";
import Swal from 'sweetalert2';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import { decodeToken } from '../../utils/decodeToken';
import Cookie from 'js-cookie';
import Select from 'react-select';

export default function Datatable() {

    const token = Cookie.get('token');
    const userId = decodeToken(token)?.userId;

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [editID, setEditID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([])
    const [u_number, setUnumber] = useState('');


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
        { name: 'ID', selector: row => row.u_number, width: '135px' },
        { name: 'เลขหุ้น', selector: row => row.u_share_id, width: '65px' },
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
            ), center: 'true', width: '130px'
        },
    ];

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                let newData = response.data.data.map((item, index) => ({
                    ...item, autoID: index + 1
                }))

                if (u_number)
                    newData = newData.filter(item => item.u_number === u_number);

                setData(newData);
                setPending(false);
            } else {
                throw new Error("ไม่พบข้อมูล");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
    }, [api, u_number]);

    const usersData = useCallback(async () => {

        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                const users = [{ value: '', label: '--- เลือกสมาชิก ---' }, ...response.data.data.map(item => ({
                    value: item.u_number,
                    label: item.u_share_id + ' - ' + item.username
                }))];
                setUsers(users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [api]);

    const ChangeUsers = (e) => {
        setUnumber(e ? e.value : '');
    };


    const handleEdit = async (id) => {
        try {
            setEditID(id);
            setShowModal(true);
            const Data = data.find(data => data.u_number === id);
            if (Data) {
                setUserData({
                    u_title: Data.u_title,
                    u_firstname: Data.u_firstname,
                    u_lastname: Data.u_lastname,
                    u_address: Data.u_address,
                    provinces_id: Data.id_prov,
                    districts_id: Data.id_dis,
                    subdistricts_id: Data.id_subdis,
                    u_share: Data.u_share,
                    u_status: Data.u_status
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                            await showSuccessAlert(response.data.message);
                            // รีเฟรชข้อมูลหลังจากลบ
                            await fetchData();
                        }
                    } catch (error) {
                        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
                        showErrorAlert(error.response.data.message);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const apiUrl = editID ? `${api}/users/${editID}` : `${api}/users`;
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
                setShowModal(false);
            }
        } catch (error) {
            console.log(error.message);
            showErrorAlert(error.response.data.message);
        }
    }, [editID, fetchData, userData]);


    useEffect(() => {
        fetchData()
        usersData()
    }, [fetchData, usersData]);

    const AddForm = () => {
        setEditID('');
        setShowModal(true);
        setUserData({
            u_title: '',
            u_firstname: '',
            u_lastname: '',
            u_address: '',
            provinces_id: '',
            districts_id: '',
            subdistricts_id: '',
            u_share: '',
            u_status: '',
            u_admin: userId
        });
    };

    return (
        <>
            <div className='col-md-12 text-end mb-3'>
                <button type="button" className="btn btn-primary" onClick={AddForm}>
                    เพิ่ม
                </button>
                <hr />
            </div>
            <div className="col-md-4">
                <Select
                    instanceId="user-select"
                    value={users.find(option => option.value === u_number)}
                    options={users}
                    onChange={ChangeUsers}
                    required
                />
                <hr />
            </div>
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <h3>ข้อมูลสมาชิก</h3>
                        <strong className='text-danger'>*** กรณีต้องการให้มีข้อมูลสามาชิกแต่ไม่มีหุ้น สามารถเพิ่มรายชื่อได้ แต่เลขหุ้นให้กรอกเป็น 0 หุ้น</strong>
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            progressPending={pending} />
                    </div>
                </div>
            </div>
            <Modal editID={editID} handleInputChange={handleInputChange} handleSubmit={handleSubmit}
                userData={userData} showModal={showModal} hideModal={() => setShowModal(false)} />
        </>
    );
}
