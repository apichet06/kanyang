'use client'

import React, { forwardRef } from 'react';
import { formatDate, formatPrice } from '../../utils/allfunctions';

const ComponentToPrint = forwardRef(({ data }, ref) => (
    <div ref={ref} >
        {data.map((row, index) => (<>
            <hr key={index} />
            <div className='fs-6 fw-bolder' style={{ paddingLeft: '0.5cm' }}> ชื่อ : {row.username}</div>
            <div style={{ paddingLeft: '0.5cm' }}>ที่อยู่ : {row.Address}</div>
            <div style={{ paddingLeft: '0.5cm' }}>วันที่ขาย : {formatDate(row.r_rubber_date)} รอบขายประจำเดือน : รอบที่ {row.r_around}</div>
            <div style={{ paddingLeft: '0.5cm' }} className='fs-6'>ราคาประมูล : {formatPrice(row.r_rubber_price)} น้ำหนักรวม : {row.w_weigth} กิโลกรัม </div>
            <h5 style={{ paddingLeft: '0.5cm' }} className='fw-bold'>รวมเป็นเงิน : {formatPrice(row.w_price)} </h5>
        </>))}
    </div>

));

export default ComponentToPrint;
