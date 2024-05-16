'use client'
import { useState } from "react";
import { api } from "./utils/config";
import axios from "axios";
import Cookies from 'js-cookie';
import { decodeToken } from "./utils/decodeToken"
import { LoginAction } from './loginAction'

export default function Home() {

  const [u_number, setUnumber] = useState('');
  const [u_password, setUpassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const formAction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const Data = {
        u_number, u_password
      }
      const response = await axios.post(`${api}/users/login`, Data);

      if (response.status === 200) {
        Cookies.set('token', response.data.token);
        setMessage("ล็อกอินสำเร็จ!")
        const token = Cookies.get('token');
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          LoginAction(decodedToken.status)
          setLoading(false);
        }

      }

    } catch (error) {

      setMessage("ล็อกอินไม่สำเร็จ!")
      setLoading(false);
    }

  }

  return (
    <div className="container vh-100">
      <div className="row justify-content-center align-items-center  vh-100">
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5 col-xl-3">
          <main className="form-signin text-center" >
            <form onSubmit={formAction}>
              <img className="mb-4" src="./logo_rubber.png" alt width={132} height={127} />
              <h1 className="h3 mb-3 fw-normal">กรุณาเข้าสู่ระบบ</h1>
              <div className="form-floating mb-2">
                <input type="text" className="form-control" name='u_number' autoComplete="off" placeholder="รหัสสมาชิก" onChange={(e) => setUnumber(e.target.value)} />
                <label htmlFor="floatingInput">รหัสสมาชิก</label>
              </div>
              <div className="form-floating mb-3">
                <input type="password" className="form-control" name='u_password' placeholder="รหัสผ่าน" onChange={(e) => setUpassword(e.target.value)} />
                <label htmlFor="floatingPassword">รหัสผ่าน</label>
              </div>
              <strong className='text-danger'>
                {message}
              </strong>
              <button className="w-100 btn btn-lg btn-primary" type='submit' disabled={loading}>{loading ? 'Loading...' : 'เข้าสู่ระบบ'}</button>
              <p className="mt-5 mb-3 text-muted">Copyright &copy; Apichet Singnakrong 2024</p>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}
