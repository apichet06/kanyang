import React from 'react'
import Link from 'next/link';
import styles from '../page.module.css';
export default function Headers() {
    return (
        <header>
            <nav className={`navbar navbar-expand-md navbar-dark fixed-top bg-dark shadow ${styles['navbar-bottom-line']}`}>
                <div className="container-fluid">
                    <Link className="navbar-brand" href="#">หน้าหลัก</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/home">รายการขายยางประจำเดือน</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/home/history">ประวัติการขายยางพารา</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/home/share">รายการปันผลประจำปี</Link>
                            </li>
                            {/* <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li> */}
                        </ul>
                        <form className="d-flex">
                            <ul className="navbar-nav me-auto mb-1 mb-md-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" href="#">นายอภิเชษฐ์ สิงห์นาครอง</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/" type="submit">ออกจากระบบ</Link>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </nav>
        </header>

    )
}
