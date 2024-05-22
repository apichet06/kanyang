'use client'
import { useEffect, useCallback, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice, formatDate } from '../../utils/allfunctions';
import Link from 'next/link';
import Select from 'react-select';
import ComponentToPrint from './ComponentToPrint'
import { useReactToPrint } from 'react-to-print'

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
    const [u_number, setUnumber] = useState('');
    const [r_number, setRnumber] = useState('');
    const [users, setUsers] = useState([])

    const [isPrinting, setIsPrinting] = useState(false);
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'emp-data',
        onBeforeGetContent: () => {
            setIsPrinting(true); // เซ็ตสถานะเมื่อผู้ใช้กดปุ่ม "พิมพ์"
        },
        onAfterPrint: () => {
            setIsPrinting(false); // เซ็ตสถานะเมื่อพิมพ์เสร็จสิ้น
        }
    })


    const showData = useCallback(async () => {

        const Data = { r_number, u_firstname: u_number }
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

    }, [api, r_number, u_number])



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


    const dateSearch = rubberprice.filter((item) => {
        return item.r_number == r_number;
    });
    const downloadExcelFile = async () => {
        try {
            const Data = { r_number, u_number }
            const response = await axios.post(api + "/weightprice/Export", Data, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `รายการขายยางพาราประจำเดือน${dateSearch.length > 0 ? 'ประจำรอบ ' + formatDate(dateSearch[0].r_rubber_date) : ''} ${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    }

    const ChangeUsers = (e) => {
        setUnumber(e ? e.value : '');
    };

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
                        <Select
                            value={users.find(option => option.value === u_number)}
                            options={users}
                            onChange={ChangeUsers}
                            required
                        />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className='col-md-12 mt-5 mb-5'>
                        <hr />
                        <div className='row'>
                            <div className='col-md-7'>
                                <h4>รายการขายยางพาราประจำเดือน {new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}</h4>
                            </div>
                            <div className='col-md-5 text-end'>
                                {(r_number || u_number) ?
                                    <>
                                        <button className='btn btn-sm btn-secondary' onClick={downloadExcelFile}>ออกรายงาน Excel</button>  {' '}
                                        {/* <Link href={`./printrubberprice?r_number=${r_number}&u_firstname=${u_number}`} target='_blank' className='btn btn-sm btn-dark'>พิมพ์เอกสาร</Link> */}
                                        <button className='btn btn-sm btn-dark' onClick={handlePrint} >พิมพ์เอกสาร</button>
                                    </> : <strong className='text-danger'>ออกรายงาน Excel จำเป็นต้องค้นข้อมูลทุกครั้ง</strong>
                                }
                            </div>
                        </div>
                        <hr />
                        <DataTable
                            columns={columns}
                            data={data}
                            pagination
                            progressPending={pending}
                        />
                        <div style={{ display: 'none' }}>
                            {isPrinting && <ComponentToPrint data={data} ref={componentRef} />}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
