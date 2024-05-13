import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import { decodeToken } from '../../utils/decodeToken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

export default function Headers() {
    const token = cookies().get('token').value;
    const decoded = decodeToken(token);

    async function createInvoice() {
        'use server'
        cookies().delete('token');
        redirect("/")
    }

    return (
        <header>
            <nav className={`navbar navbar-expand-md navbar-dark fixed-top bg-secondary shadow ${styles['navbar-bottom-line']}`}>
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/admin">หน้าหลัก</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" href="/admin/rubberPriceReview">รายการขายยางประจำเดือน</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/admin/rubberPricehistory">ประวัติการขายยางพารา</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/admin/shareapercentReview">รายงานปันผลประจำปี</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    การจัดการ
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><Link className="dropdown-item" href="../admin/users">สมาชิก</Link></li>
                                    <li><Link className="dropdown-item" href="../admin/rubberPrice">ราคาประมูลยางพารา</Link></li>
                                    <li><Link className="dropdown-item" href="../admin/sharePercent">แบ่งเปอร์เซ้นปันผลหุ้น/หัวตันต่อปี</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" href="../admin/weightprice">น้ำหนักยางพาราช่างได้</Link></li>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex" action={createInvoice} >
                            <ul className="navbar-nav me-auto mb-1 mb-md-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" href="#">{decoded.username}</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" type="submit">ออกจากระบบ</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </nav>
        </header>

    )
}
