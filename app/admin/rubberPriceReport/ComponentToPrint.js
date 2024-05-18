'use client'

import React, { forwardRef } from 'react';
import { formatDate, formatPrice } from '../../utils/allfunctions';

const ComponentToPrint = forwardRef(({ data }, ref) => (
    <div ref={ref} >
        {data.map((row, index) => (<>
            <div className='fs-5 fw-bolder'> ชื่อ : {row.username}</div>
            <div >ที่อยู่ : {row.Address}</div>
            <div >วันที่ขาย : {formatDate(row.r_rubber_date)} รอบขายประจำเดือน : รอบที่ {row.r_around}</div>
            <div className='fs-6'>ราคาประมูล : {formatPrice(row.r_rubber_price)} น้ำหนักรวม : {row.w_weigth} กิโลกรัม </div>
            <h5 className='fw-bold'>รวมเป็นเงิน : {formatPrice(row.w_price)} </h5>
            <hr key={index} />
        </>))}
    </div>

));

export default ComponentToPrint;
