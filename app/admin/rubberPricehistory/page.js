'use client'
import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate, formatDateTime } from '../../utils/allfunctions';

export default function Page() {

    const columns = [
        { name: 'ID', selector: row => row.w_number },
        { name: 'ปี/เดือน/วัน', selector: row => formatDate(row.r_rubber_date) },
        { name: 'รอบขาย', selector: row => row.r_around },
        { name: 'น้ำหนัก', selector: row => Number(row.w_weigth).toLocaleString() },
        { name: 'ราคาประมูลยางพารา', selector: row => formatPrice(row.r_rubber_price) },
        { name: 'จำนวนเงิน', selector: row => formatPrice(row.w_price) },
        { name: 'สมาชิก', selector: row => row.username, width: '175px' },
        { name: 'ผู้บันทึก', selector: row => row.uadmin, width: '175px' },
        { name: 'วันที่บันทึก', selector: row => formatDateTime(row.w_datetime), width: '175px' },
    ];

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(false); // เปลี่ยนค่าเริ่มต้นเป็น false
    const [rubberprice, setRubberprice] = useState([]);
    const [u_firstname, setUfirstname] = useState('');
    const [r_number, setRnumber] = useState('');
    const [users, setUsers] = useState([]);

    const fetchRubberPrice = useCallback(async () => {
        try {
            const response = await axios.get(api + '/rubberprice');
            if (response.status === 200) {
                setRubberprice(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }, [api]);

    const showData = async () => {
        if (!r_number || !u_firstname) return;

        setPending(true);
        try {
            const Data = { r_number, u_firstname };
            const response = await axios.post(api + "/weightprice/weight", Data);
            if (response.status === 200) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
        }
    };

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users");
            if (response.status === 200) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRubberPrice();
    }, [fetchUsers, fetchRubberPrice]);


    const dateSearch = rubberprice.filter(item => item.r_number === r_number);

    const downloadExcelFile = async () => {
        try {
            const Data = { r_number, u_firstname };
            const response = await axios.post(api + "/weightprice/Export", Data, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ประวัติการขายยางพาราทั้งหมด ${dateSearch.length > 0 ? 'ประจำรอบ ' + formatDate(dateSearch[0].r_rubber_date) : ''} ${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };

    return (
        <>
            <div className="container mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-3 mt-md-5 mt-lg-5 mt-sm-5">
                        <select className="form-select" onChange={(e) => setRnumber(e.target.value)} required>
                            <option value="">เลือกรอบขาย/ราคาประมูลยาง</option>
                            {rubberprice.map(item => (
                                <option key={item.r_number} value={item.r_number}>
                                    {formatDate(item.r_rubber_date) + ' รอบ ' + item.r_around + ' ราคาประมูล ' + item.r_rubber_price}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3 mt-md-5 mt-lg-5 mt-sm-2">
                        <input className="form-control" list="user" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                        <datalist id="user">
                            {users.map(user => (
                                <option key={user.u_number} value={user.u_firstname}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className="col-md-1 mt-md-5 mt-lg-5 mt-sm-2 col-sm-12 text-center">
                        <button className="btn btn-primary" onClick={showData}>ค้นหา</button>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12 mt-5">
                        <hr />
                        <div className="row">
                            <div className="col-md-7">
                                <h4>ประวัติการขายยางพาราทั้งหมด {dateSearch.length > 0 ? 'ประจำรอบ ' + formatDate(dateSearch[0].r_rubber_date) : ''}</h4>
                            </div>
                            <div className="col-md-5 text-end">
                                <button className="btn btn-sm btn-secondary" onClick={downloadExcelFile}>ออกรายงาน Excel</button>
                            </div>
                        </div>
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
    );
}
