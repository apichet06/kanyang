import React from 'react'
import Datatable from './datatable'


export default function page() {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 mt-5'>
                    <div className='card'>
                        <div className='card-body'>
                            <Datatable />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
