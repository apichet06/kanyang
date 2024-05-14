'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate } from '../../utils/allfunctions';

export default function page() {


    const columns = [
        { name: 'ID', selector: row => row.w_number, width: '130px' },
        { name: 'งวด-ปี/เดือน/วัน', selector: row => row.r_around + '-' + formatDate(row.r_rubber_date), width: '150px' },
        { name: 'น้ำหนักรวม', selector: row => Number(row.w_weigth).toLocaleString() },
        { name: 'ราคาประมูล', selector: row => formatPrice(row.r_rubber_price) },
        { name: 'จำนวนเงิน', selector: row => formatPrice(row.w_price) },
        { name: 'สมาชิก', selector: row => row.username, width: '220px' },
        { name: 'ผู้บันทึก', selector: row => row.uadmin, width: '175px' },
        { name: 'วันที่บันทึก', selector: row => formatDate(row.w_datetime), width: '175px' },
    ];


    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [rubberprice, setRubberprice] = useState([]);
    const [u_firstname, setUfirstname] = useState('')
    const [r_number, setRnumber] = useState('');
    const [users, setUsers] = useState([])

    const showData = useCallback(async () => {


        const Data = {
            r_number, u_firstname
        }
        const response = await axios.post(api + "/weightprice/weight", Data);

        if (response.status === 200) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const filteredData = response.data.data.filter(item => {
                const itemDate = new Date(item.r_rubber_date);
                const itemYear = itemDate.getFullYear();
                const itemMonth = itemDate.getMonth() + 1;
                return itemYear === currentYear && itemMonth === currentMonth;
            });

            setData(filteredData);
            setPending(false);

        } else {
            throw new Error("ไม่พบข้อมูล");
        }

    }, [api, r_number, u_firstname])



    const handlerubberpriceChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice')
            if (response.status === 200) {

                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;

                const filteredRubber = response.data.data.filter(item => {
                    const itemDate = new Date(item.r_rubber_date);
                    const itemYear = itemDate.getFullYear();
                    const itemMonth = itemDate.getMonth() + 1;
                    return itemYear === currentYear && itemMonth === currentMonth;
                });

                setRubberprice(filteredRubber)
            }

        } catch (error) {
            console.log(error);
        }
    }, [api])

    const userData = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users")
            if (response.status === 200)
                setUsers(response.data.data)
        } catch (error) {
            throw error
        }


    }, [api])

    useEffect(() => {
        showData();
        userData()
        handlerubberpriceChange()
    }, [showData, userData, handlerubberpriceChange])


    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4 mt-5">
                        <select className="form-select" onChange={(e) => setRnumber(e.target.value)} required>
                            <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                            {rubberprice.map(item => (
                                <option key={item.r_number} value={item.r_number}>{formatDate(item.r_rubber_date) + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4 mt-5">
                        <input className="form-control" list="user" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                        <datalist id="user">
                            {users.map(user => (
                                <option value={user.u_firstname}></option>
                            ))}

                        </datalist>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className='col-md-12 mt-5'>
                        <h4>รายการขายยางพาราประจำเดือน {new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}</h4>
                        <hr />
                        <DataTable
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
