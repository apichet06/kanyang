'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, isLeapYear } from '../../utils/allfunctions';
import Swal from 'sweetalert2';


export default function Datatable() {

    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [users, setUsers] = useState([])
    const [percentYears, setPercentYears] = useState([])
    const [year, setYear] = useState('')
    const [u_username, setUfirstname] = useState('')


    const userData = useCallback(async () => {
        try {
            const response = await axios.get(api + "/users")
            if (response.status === 200)
                setUsers(response.data.data)
        } catch (error) {
            throw error
        }


    }, [api])

    const percentYear = useCallback(async () => {
        try {

            const response = await axios.get(api + "/sharepercent")
            if (response.status === 200)
                setPercentYears(response.data.data)
        } catch (error) {
            throw error
        }
    }, [api])



    const handleUpdateShareYear = useCallback(async () => {
        try {
            let timerInterval;
            let count = 1;

            Swal.fire({
                title: "อัปเดตหุ้นประจำปี...",
                html: "เวลาประมวลผล: <b></b>",
                didOpen: () => {
                    Swal.showLoading();
                    const progress = Swal.getPopup().querySelector("b");
                    progress.textContent = count; // แสดงความคืบหน้าเริ่มต้นที่ 0%
                    timerInterval = setInterval(() => {
                        count++;
                        progress.textContent = count; // อัพเดทความคืบหน้าเรื่อย ๆ
                    }, 100); // เพิ่มค่าทุกๆ 1 วินาที
                },
                willClose: () => {
                    clearInterval((timerInterval));
                },
                allowOutsideClick: false, // ไม่อนุญาตให้คลิกนอกกล่องเพื่อปิด
                allowEscapeKey: false,    // ไม่อนุญาตให้กดปุ่ม Escape เพื่อปิด
                allowEnterKey: false      // ไม่อนุญาตให้กดปุ่ม Enter เพื่อปิด
            });

            const response = await axios.get(api + "/sharepercent/UdateshareYear", {
                // onDownloadProgress: (progressEvent) => { }
            });
            if (response.status === 200) {
                Swal.close(); // ปิด SweetAlert เมื่อได้รับการตอบกลับที่มีสถานะเป็น 200
            }

        } catch (error) {
            throw error;
        }
    }, [api]);

    const showData = useCallback(async () => {

        try {

            const Data = { year, u_username }
            const response = await axios.post(api + "/sharepercent/share", Data);
            if (response.status === 200) {
                setData(response.data.data);
                setPending(false);
            }
        } catch (error) {
            throw error
        }

    }, [api, year, u_username])



    // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ Excel
    const downloadExcelFile = async () => {
        try {
            const response = await axios.post(api + "/sharepercent/ExportShareToExcel", { year, u_username }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `รายงานปันผลหุ้นประจำปี ${yearStart} ถึง ${yearEnd + '/' + Date.now()} .xlsx`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    }

    useEffect(() => {
        showData();
        userData()
        percentYear()
    }, [showData, userData, percentYear])

    const currentDate = new Date().getFullYear();
    const nextYear = year === '' ? currentDate + 1 : parseInt(year) + 1;
    const lastDay = isLeapYear(nextYear);

    const yearStart = `${year || currentDate}-03-01`;
    const yearEnd = `${nextYear}-02-${lastDay}`;

    const columns = [
        { name: 'ปี', selector: row => row.r_rubber_year, width: '65px' },
        { name: 'ID', selector: row => row.u_number, width: '110px' },
        { name: 'เลขหุ้น', selector: row => row.u_share_id, width: '70px' },
        { name: 'ชื่อ-สกุล', selector: row => row.u_title + '' + row.u_firstname + ' ' + row.u_lastname, width: '175px' },
        { name: 'ที่อยู่', selector: row => row.u_address, width: '410px' },
        { name: 'จำนวนหุ้น', selector: row => formatPrice(row.u_share) },
        { name: 'เปอร์เซ็นหุ้น', selector: row => (row.percent) + '%' },
        { name: 'เงินปันผลหุ้น', selector: row => formatPrice(row.Sumpercentshare) },
        { name: 'น้ำหนักหัวตันรวม', selector: row => row.Sumweight },
        { name: 'เปอร์เซ็นหัวตัน', selector: row => (row.percent_yang) + '%' },
        { name: 'เงินปันผลหัวตัน', selector: row => formatPrice(row.sumhuatun) },
        { name: 'เงินปันผลรวม', selector: row => formatPrice(row.sumPrice) },
    ];

    return (
        <>
            <div className="container-fluid mb-5">
                <div className="row justify-content-center">
                    <div className="col-auto mt-5">
                        <input className="form-control" list="percentYear" placeholder="ค้นหาปีปันผล..." onChange={e => setYear(e.target.value)} />
                        <datalist id="percentYear">
                            {percentYears.map(p => (
                                <option key={p.s_year} value={p.s_year}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className="col-auto mt-5">
                        <input className="form-control" list="user" id="u_number" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                        <datalist id="user">
                            {users.map(user => (
                                <option key={user.u_number} value={user.u_firstname}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className='col-md-10 mt-5'>
                        <hr />
                        <div className='row'>
                            <div className='col-md-8'>
                                <h4>รายงานเงินปันผลประจำปี {yearStart + ' ถึง ' + yearEnd}</h4>
                                <straon>
                                    <b className='text-danger'>แจ้งเตือน</b>: กรณีไม่พบข้อมูลการปันผล แสดงว่าข้อมูลหุ้นปีนั้นๆ ไม่ถูกอัปเดต <b className='text-danger'><u>จำเป็นต้องกดปุ่ม "อัปเดตหุ้นประจำปี"</u></b> หรือสมาชิกเพิ่มหุ้นหรือถอนหุ้น <b className='text-danger'><u>จำเป็นต้องกดปุ่ม "อัปเดตหุ้นประจำปี"</u></b> เช่นกัน
                                </straon>
                            </div>
                            <div className='col-md-4 text-end'>
                                <button className='btn btn-sm btn-warning' onClick={handleUpdateShareYear}>อัปเดตหุ้นประจำปี</button>{' '}
                                <button className='btn btn-sm btn-secondary' onClick={downloadExcelFile}>ออกรายงาน Excel</button>
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

    )
}
