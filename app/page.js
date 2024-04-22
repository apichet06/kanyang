


export default function Home() {
  return (
    <div className="container vh-100">
      <div className="row justify-content-center align-items-center  vh-100">
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-5 col-xl-3">
          <main className="form-signin text-center">
            <form>
              {/* <img className="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt width={72} height={57} /> */}
              <h1 className="h3 mb-3 fw-normal">กรุณาเข้าสู่ระบบ</h1>
              <div className="form-floating mb-2">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                <label htmlFor="floatingInput">รหัสสมาชิก</label>
              </div>
              <div className="form-floating mb-3">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                <label htmlFor="floatingPassword">รหัสผ่าน</label>
              </div>

              <button className="w-100 btn btn-lg btn-primary" type="submit">เข้าสู่ระบบ</button>
              <p className="mt-5 mb-3 text-muted">Copyright &copy; Apichet Singnakrong 2024</p>
            </form>
          </main>
        </div>
      </div>
    </div>
  )
}
