import React from 'react'

export default function Modal() {
    return (
        <>
            <div className="modal fade" id="exampleModal" data-bs-backdrop="static" tabIndex={-1} data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">เพิ่มข้อมูล</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <form className='row g-3'>
                                <div className='col-md-2'>
                                    <label className="col-form-label">คำนำหน้า</label>
                                    <select className="form-select" id='u_title'  >
                                        <option value="">คำนำหน้า</option>
                                        <option value="นาย">นาย</option>
                                        <option value="นาง">นาง</option>
                                        <option value="นางสาว">นางสาว</option>
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <label className="col-form-label">ชื่อ</label>
                                    <input type="text" className="form-control" id="u_fristname" />
                                </div>
                                <div className="col-md-5">
                                    <label className="col-form-label">สกุล</label>
                                    <input type="text" className="form-control" id="u_fristname" />
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="message-text" className="col-form-label">ที่อยู่</label>
                                    <textarea className="form-control" id="u_lastname" placeholder='เช่น เลขที่ 1 หมู่ 1 บ้านหนองป่าอ้อย ' />
                                </div>
                                <div className='col-md-3'>
                                    <label className="col-form-label">ตำบล</label>
                                    <select className="form-select" id='u_title' >
                                        <option value="">ตำบล</option>
                                        <option value="นาย">นาย</option>
                                    </select>
                                </div>
                                <div className='col-md-3'>
                                    <label className="col-form-label">อำเภอ</label>
                                    <select className="form-select" id='u_title' >
                                        <option value=''>อำเภอ</option>
                                        <option value="นาย">นาย</option>
                                    </select>
                                </div>
                                <div className='col-md-3'>
                                    <label className="col-form-label">จังหวัด</label>
                                    <select className="form-select" id='u_title' >
                                        <option value="">จังหวัด</option>
                                        <option value="นาย">นาย</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="col-form-label">จำนวนหุ้น</label>
                                    <input type="number" className="form-control" id="u_share" placeholder='เช่น 1000' />
                                </div>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary">บันทึก</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
