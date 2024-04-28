'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate, formatDateTime } from '../../utils/allfunctions';
import Select from 'react-select';
import { format } from 'date-fns';

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
    const [r_number, setRnumber] = useState('');
    const [u_number, setUnumber] = useState('');
    const [rubberprice, setRubberprice] = useState([]);
    const [users, serUsers] = useState([]);

    const fatchDta = useCallback(async () => {

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


    const handlerubberpriceChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice')
            if (response.status === 200) {


                setRubberprice(response.data.data)
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
                    label: item.username
                }
                ))

                serUsers(uers)
            }

        } catch (error) {
            console.log(error);
        }

    }, [api]);



    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

    }, [])

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
        setRnumber('')
    }



    const ChangeUsers = (e) => {
        const u_numbers = e.value;
        setUnumber(u_numbers)
        // handleInputChange({ target: { name: 'u_number', value: selectprovices } });

    }



    useEffect(() => {
        fatchDta();
        handlerubberpriceChange()
        handleUserschange()
    }, [fatchDta, handlerubberpriceChange, handleUserschange])

    return (

        <>
            <div className='col-md-7 text-end mb-3'>
                <form >
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">รอบขายยางพารา</label>
                        <div className="col-sm-6">
                            <select className="form-select" value={r_number} onChange={(e) => setRnumber(e.target.value)}>
                                <option value="">เลือกรอบขายยางพารา</option>
                                {rubberprice.map(item => (
                                    <option key={item.r_number} value={item.r_number}>{format(item.r_rubber_date, 'yyyy/MM/dd') + ' รอบ ' + item.r_around + ' ราคา ' + item.r_rubber_price}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* <option key={item.r_number} value={item.r_number}>{format(item.r_rubber_date, 'yyyy/MM/dd') + ' รอบ ' + item.r_around + ' ราคา ' + item.r_rubber_price}</option> */}
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">ชื่อสมาชิก</label>
                        <div className="col-sm-6">
                            <Select
                                value={users.find((option) => option.value === u_number)}
                                options={users}
                                onChange={ChangeUsers}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label">น้ำหนักยางพาราที่ช่างได้</label>
                        <div className="col-sm-6">
                            <input type="number" className="form-control" value={w_weigth} onChange={(e) => setWweight(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label className="col-sm-3 col-form-label"> </label>
                        <div className="col-sm-6 text-center">
                            <button type="submit" className='btn btn-primary' onClick={(e) => handleSubmit(e)}>{editID ? 'แก้ไข' : 'เพิ่ม'}</button> &nbsp;
                            {editID && <button type="submit" className='btn btn-info' onClick={handleReset}>คืนค่า</button>}
                        </div>
                    </div>
                </form >

                <hr />
            </div >

            <div className="col-md-11">
                <div className="card">
                    <div className="card-body">
                        <DataTable
                            title="น้ำหนักยางพารา/ราคาขาย"
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
