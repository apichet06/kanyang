'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';

import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, isLeapYear } from '../../utils/allfunctions';




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
            const Data = { year, u_username }
            const response = await axios.post(api + "/sharepercent/ExportShareToExcel", Data, {
                responseType: 'blob' // กำหนดประเภทข้อมูลเป็น blob เพื่อรับไฟล์
            });

            // สร้าง URL ของไฟล์ที่ดาวน์โหลด
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // สร้างลิงก์สำหรับดาวน์โหลดไฟล์
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', 'รายงานปันผลหุ้นประจำปี' + yearStart + ' ถึง ' + yearEnd + '.xlsx');
            document.body.appendChild(link);

            // คลิกลิงก์เพื่อดาวน์โหลดไฟล์
            link.click();

            // ลบ URL หลังจากดาวน์โหลดเสร็จ
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
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-auto mt-5">
                        <input className="form-control" list="percentYear" placeholder="ค้นหาปีปันผล..." onChange={e => setYear(e.target.value)} />
                        <datalist id="percentYear">
                            {percentYears.map(p => (
                                <option value={p.s_year}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className="col-auto mt-5">
                        <input className="form-control" list="user" id="u_number" placeholder="ค้นหาชื่อสมาชิก" onChange={e => setUfirstname(e.target.value)} />
                        <datalist id="user">
                            {users.map(user => (
                                <option value={user.u_firstname}></option>
                            ))}

                        </datalist>
                    </div>
                    <div className='col-md-10 mt-5'>
                        <hr />
                        <div className='row'>
                            <div className='col-md-8'>
                                <h4>รายงานเงินปันผลประจำปี {yearStart + ' ถึง ' + yearEnd}</h4>
                            </div>
                            <div className='col-md-4 text-end'>
                                <button className='btn btn-sm btn-secondary' onClick={downloadExcelFile}>Export Excel</button>
                                {/* แสดงปุ่มดาวน์โหลดเมื่อมี URL ของไฟล์ Excel พร้อมใช้งาน */}



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
