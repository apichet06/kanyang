import React from 'react'
import Modal from './modal'
import Datatable from './datatable'
export default function Users() {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className='col-md-12 mt-5'>
                        <div className='row justify-content-center'>
                            <div className='col-md-9 text-end mb-3'>
                                <button type="button" className="btn btn-primary " data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    เพิ่ม
                                </button>
                                <hr />
                            </div>
                            <div className="col-md-9">
                                <div className="card">
                                    <div className="card-body">
                                        <Datatable />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal />
        </>


    )
}
