'use client'

import { useEffect, useCallback, useState } from 'react';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import axios from 'axios';
import { api } from "../../utils/config";
import { formatPrice } from '../../utils/allfunctions';

const columns = [
    { name: 'ปี', selector: row => row.r_rubber_year, width: '65px' },
    { name: 'ID', selector: row => row.u_number, width: '110px' },
    { name: 'เลขหุ้น', selector: row => row.u_share_id, width: '110px' },
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


export default function Datatable() {
    const [data, setData] = useState([]);
    const [pending, setPending] = useState(true);
    const [users, setUsers] = useState([])
    const [percentYears, setPercentYears] = useState([])

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
            const response = await axios.get(api + "/sharepercent/share");
            if (response.status === 200) {
                setData(response.data.data);
                setPending(false);
            }
        } catch (error) {
            throw error
        }

    }, [api])

    useEffect(() => {
        showData();
        userData()
        percentYear()
    }, [showData, userData, percentYear])


    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div class="col-auto mt-5">
                        <input className="form-control" list="percentYear" placeholder="เลือกปีปันผล..." />
                        <datalist id="percentYear">
                            {percentYears.map(p => (
                                <option value={p.s_year}></option>
                            ))}
                        </datalist>
                    </div>
                    <div class="col-auto mt-5">
                        <input class="form-control" list="user" id="u_number" placeholder="รหัสพนักงาน" />
                        <datalist id="user">
                            {users.map(user => (
                                <option value={user.u_firstname}></option>
                            ))}

                        </datalist>
                    </div>
                    <div className='col-md-10 mt-5'>
                        <h4>รายงานเงินปันผลประจำปี</h4>
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
