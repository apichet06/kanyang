import React from 'react'

export default function Modal() {
    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">เพิ่มข้อมูล</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            ...
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
