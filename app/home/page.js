
import Datatable from "./datatable";


export default async function page() {
    try {

        return (
            <div className="container">
                <div className='row  '>
                    <div className='col-md-12 mt-5'>
                        <Datatable />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error(error.message);
        return (
            <div className="container">
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className="mt-5">ไม่พบข้อมูล สมาชิก</h1>
                    </div>
                </div>
            </div>
        );
    }
}
