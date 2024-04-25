import { useCallback, useEffect, useState } from 'react'
import { api } from '../../utils/config';
import axios from 'axios';

export default function Modal(props) {
    const { editID, handleInputChange, handleSubmit, userData } = props
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);




    const handleprovinctChange = useCallback(async () => {
        try {
            const response = await axios.get(api + '/provincesAll')
            if (response.status === 200) {
                setProvinces(response.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }, [api])


    const handleDistrict = useCallback(async (id) => {
        try {
            const response = await axios.get(api + '/district/' + id)
            if (response.status === 200) {
                setDistricts(response.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }, [api])

    const handleSubDistrict = useCallback(async (id) => {
        try {
            const response = await axios.get(api + '/subdistrict/' + id)
            if (response.status === 200) {
                setSubdistricts(response.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }, [api])



    const handleDistrictChanges = (e) => {
        const selectprovices = e.target.value;
        handleDistrict(selectprovices)
        handleInputChange({ target: { name: 'provinces_id', value: selectprovices } });
        handleSubDistrict(0)
    }

    const handleSubDistrictChanges = (e) => {
        const selectdistrict = e.target.value;
        handleSubDistrict(selectdistrict)
        handleInputChange({ target: { name: 'districts_id', value: selectdistrict } });
    }




    const fetchDistrictData = useCallback(async () => {

        try {

            const districtResponse = await axios.get(`${api}/district/2`);
            if (districtResponse.status === 200) {
                const districtData = districtResponse.data.data;
                setDistricts(districtData);
            }
        } catch (error) {
            console.log(error);
        }

    }, [api]);

    const fetchSubdistrictData = useCallback(async () => {
        try {
            const subdistrictResponse = await axios.get(`${api}/subdistrict/12`);
            if (subdistrictResponse.status === 200) {
                const subdistrictData = subdistrictResponse.data.data;
                setSubdistricts(subdistrictData);
            }
        } catch (error) {
            console.log(error);
        }

    }, [api]);



    useEffect(() => {
        handleprovinctChange()
        if (editID) {
            fetchDistrictData();
            fetchSubdistrictData();
        }

    }, [handleprovinctChange, editID, fetchDistrictData, fetchSubdistrictData]);


    return (
        <>
            <div className="modal fade" id="exampleModal" data-bs-backdrop="static" tabIndex={-1} data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{editID ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มข้อมูลสมาชิก"}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <form className='row g-3' onSubmit={handleSubmit}>
                                <div className='col-md-2'>
                                    <label className="col-form-label">คำนำหน้า</label>
                                    <select className="form-select" name="u_title" onChange={handleInputChange} value={userData.u_title} required>
                                        <option value="">คำนำหน้า</option>
                                        <option value="นาย">นาย</option>
                                        <option value="นาง">นาง</option>
                                        <option value="นางสาว">นางสาว</option>
                                    </select>
                                </div>
                                <div className="col-md-5">
                                    <label className="col-form-label">ชื่อ</label>
                                    <input type="text" className="form-control" name="u_firstname" value={userData.u_firstname} onChange={handleInputChange} required />
                                </div>
                                <div className="col-md-5">
                                    <label className="col-form-label">สกุล</label>
                                    <input type="text" className="form-control" name="u_lastname" onChange={handleInputChange} value={userData.u_lastname} required />
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="message-text" className="col-form-label">ที่อยู่</label>
                                    <textarea className="form-control" name="u_address" placeholder='เช่น เลขที่ 1 หมู่ 1 บ้านหนองป่าอ้อย' value={userData.u_address} onChange={handleInputChange} />
                                </div>
                                <div className='col-md-4'>
                                    <label className="col-form-label">จังหวัด</label>
                                    <select className="form-select" name='provinces_id' value={userData.provinces_id} onChange={handleDistrictChanges}>
                                        <option value="">เลือกจังหวัด</option>
                                        {provinces.map(province => (
                                            <option key={province.id} value={province.id}>{province.name_in_thai}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-md-4'>
                                    <label className="col-form-label">อำเภอ</label>
                                    <select className="form-select" name='districts_id' onChange={handleSubDistrictChanges} >
                                        <option value=''>เลือกอำเภอ</option>
                                        {districts.map(districts => (
                                            <option key={districts.id} value={districts.id}>{districts.name_in_thai}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='col-md-4'>
                                    <label className="col-form-label">ตำบล</label>
                                    <select className="form-select" name='subdistricts_id' onChange={handleInputChange} >
                                        <option value="">เลือกตำบล</option>
                                        {subdistricts.map(subdistricts => (
                                            <option key={subdistricts.id} value={subdistricts.id}>{subdistricts.name_in_thai}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-form-label">จำนวนหุ้น</label>
                                    <input type="number" className="form-control" name="u_share" value={userData.u_share} placeholder='เช่น 1000' onChange={handleInputChange} />
                                </div>
                                <div className="mb-3 col-md-4">
                                    <label className="col-form-label">สถานะ</label>
                                    <select className="form-select" name='u_status' value={userData.u_status} onChange={handleInputChange} >
                                        <option value="">สถานะ</option>
                                        <option value="Admin">ผู้ดูแลระบบ</option>
                                        <option value="user">ผู้ใช้งานทั้วไป</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">{editID ? "แก้ไข" : "บันทึก"}</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
