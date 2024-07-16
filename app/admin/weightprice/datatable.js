'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate, formatDateTime } from '../../utils/allfunctions';
import Select from 'react-select';
import { format } from 'date-fns';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';
import Swal from 'sweetalert2';
import { decodeToken } from '../../utils/decodeToken';
import Cookie from 'js-cookie'

export default function datatable() {

    const token = Cookie.get('token');
    const userId = decodeToken(token)?.userId;

    const columns = [
        { name: 'ลำดับ', selector: row => row.autoID, width: '62px' },
        { name: 'ID', selector: row => row.w_number, width: '130px' },
        { name: 'เลขหุ้น', selector: row => row.u_share_id, width: '110px' },
        { name: 'สามชิก', selector: row => row.username, width: '175px' },
        { name: 'รอบขายยางพารา', selector: row => row.r_around, width: '120px' },
        { name: 'ราคาประมูลยางพารา', selector: row => formatPrice(row.r_rubber_price) },
        { name: 'น้ำหนัก/กิโลกรัม', selector: row => Number(row.w_weigth).toFixed(2).toLocaleString() },
        { name: 'จำนวนเงิน', selector: row => formatPrice(row.w_price) },
        { name: 'วันขาย', selector: row => formatDate(row.r_rubber_date), width: '110px' },
        { name: 'ผู้บันทึก', selector: row => row.uadmin, width: '180px' },
        { name: 'วันที่บันทึก', selector: row => formatDateTime(row.w_datetime), width: '150px' },
        {
            name: "จัดการ",
            cell: (row) => (
                <>
                    <button onClick={() => { handleEdit(row.w_number); }} className="btn btn-warning btn-sm">แก้ไข</button>
                    &nbsp;
                    <button onClick={() => handleDelete(row.w_number)} className="btn btn-danger btn-sm">ลบ</button>
                </>
            ), center: true, width: '140px'
        },
    ];

    const [data, setData] = useState([]);
    const [editID, setEditID] = useState('');
    const [pending, setPending] = useState(true);
    const [w_weigth, setWweight] = useState('');
    const [u_firstname, setUfirstname] = useState('')
    const [r_number, setRnumber] = useState('');
    const [u_number, setUnumber] = useState('');
    const [rubberprice, setRubberprice] = useState([]);
    const [users, serUsers] = useState([]);
    const [searchuser, setSearchuser] = useState([]);
    const [searchrubber, setSearchrubber] = useState([]);
    const [r_numberSearch, setRnumberSearch] = useState('');

    const fetchData = useCallback(async () => {

        const Data = {
            r_number: r_numberSearch, u_firstname
        }
        const response = await axios.post(api + "/weightprice/weight", Data);

        if (response.status === 200) {

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const newData = await response.data.data.map((item, index) => ({
                ...item, autoID: index + 1
            }))
            // .filter(item => {
            //     const itemDate = new Date(item.r_rubber_date);
            //     const itemYear = itemDate.getFullYear();
            //     const itemMonth = itemDate.getMonth() + 1;
            //     return itemYear === currentYear && itemMonth === currentMonth;
            // })
            setData(newData);
            setPending(false);
        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [api, u_firstname, r_numberSearch])


    const handlerubberpriceChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice')
            if (response.status === 200) {

                setRnumber(response.data.data[0].r_number)

                setRubberprice(response.data.data)

                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                const newData = await response.data.data.filter(item => {
                    const itemDate = new Date(item.r_rubber_date);
                    const itemYear = itemDate.getFullYear();
                    const itemMonth = itemDate.getMonth() + 1;
                    return itemYear === currentYear && itemMonth === currentMonth;
                })
                setSearchrubber(response.data.data)
                // setSearchrubber(newData)
            }

        } catch (error) {
            console.log(error);
        }
    }, [api])

    const handleUserschange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/users')
            if (response.status === 200) {

                const uers = response.data.data.map(item => ({
                    value: item.u_number,
                    label: item.username + ' - ' + item.u_share_id
                }))

                serUsers(uers)
                setSearchuser(response.data.data)
            }

        } catch (error) {
            console.log(error);
        }

    }, [api]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const Data = {
                w_weigth,
                r_number,
                u_number,
                w_admin: userId
            }

            const apiUrl = editID ? `${api}/weightprice/${editID}` : `${api}/weightprice`
            const response = await (editID ? axios.put(apiUrl, Data) : axios.post(apiUrl, Data));

            if (response.status === 200) {

                // showSuccessAlert(response.data.message);
                fetchData();
                handleReset()

            }

        } catch (error) {

            showErrorAlert(error.response.data.message)
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
                        const response = await axios.delete(`${api}/weightprice/${id}`, {
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
        const Data = await data.find(data => data.w_number === id);

        if (Data) {
            setWweight(Data.w_weigth)
            setUnumber(Data.u_number)
            setRnumber(Data.r_number)
        }
    }

    const handleReset = async () => {
        setEditID('')
        setWweight('')
        setUnumber('')
        // setUsers({ value: '' });

    }



    const ChangeUsers = (e) => {
        const u_numbers = e.value;
        setUnumber(u_numbers)

    }



    useEffect(() => {
        fetchData();
        handlerubberpriceChange()
        handleUserschange()
    }, [fetchData, handlerubberpriceChange, handleUserschange])

    return (

        <>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-7 text-end mb-3'>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">รอบขาย/ราคาประมูลยาง</label>
                                <div className="col-sm-6">
                                    <select className="form-select" value={r_number} onChange={(e) => setRnumber(e.target.value)} required>
                                        <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                                        {rubberprice.map(item => (
                                            <option key={item.r_number} value={item.r_number}>{format(item.r_rubber_date, 'yyyy/MM/dd') + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">ชื่อสมาชิก</label>
                                <div className="col-sm-6">
                                    <Select
                                        instanceId="instanceId"
                                        value={users.find((option) => option.value === u_number)}
                                        options={users}
                                        onChange={ChangeUsers}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row">

                                <label className="col-sm-3 col-form-label">น้ำหนักยางพาราที่ได้/กิโลกรัม</label>
                                <div className="col-sm-6">
                                    <input type="number" className="form-control" value={w_weigth} onChange={(e) => setWweight(e.target.value)} />
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
                </div>
                <div className="row justify-content-center mb-4">
                    <div className="col-md-3 ">
                        <select className="form-select" onChange={(e) => setRnumberSearch(e.target.value)} required>
                            <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                            {searchrubber.map(item => (
                                <option key={item.r_number} value={item.r_number}>{formatDate(item.r_rubber_date) + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3 ">
                        <input className="form-control" list="user" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                        <datalist id="user">
                            {searchuser.map(user => (
                                <option key={user.u_number} value={user.u_firstname}></option>
                            ))}
                        </datalist>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className="col-md-11 mb-5">
                        <div className="card">
                            <div className="card-body">
                                <h3>รายการน้ำหนักยางพาราของสมาชิกที่บันทึกแล้ว</h3>
                                <strong className='text-danger '>***การบันทึกน้ำหนักสามารถกรอกได้ 1 คนต่อ 1 รอบการขายไม่สามารถกรอกข้อมูลการขายซ้ำได้ กรณีกรอกน้ำหนักผิดพลาดสามารถแก้ไขข้อมูลได้ตามรายชื่อสามาชิกด่านล่าง</strong>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    pagination
                                    progressPending={pending}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
