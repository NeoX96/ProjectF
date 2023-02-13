import { useNavigate } from "react-router-dom";
import { useState } from 'react';


function LoginNew () {
    const navigate = useNavigate();
    const [email , setemail]= useState('');
    const [password , setPassword] = useState('');

    return (
        <div className="justify-content-center d-flex">
        <div className="Auth-form-container w-25">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <h6 >Welcome to SPORTSCONNECT</h6>
              
              <div className="form-group mt-3">
                <label>Email address</label>
                <input className="form-control mt-1" type="email" name="" id="email" placeholder='Email' onChange={(e)=>setemail(e.target.value)} />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input className="form-control mt-1" type="password" placeholder='******' name="" onChange={(e)=>setPassword(e.target.value)} id="password" />
              </div>
              <div className="d-grid gap-2 mt-3">
              <button onClick={() => {navigate("/Home")}} className="btn btn-primary">Submit
              </button>
              </div>
            </div>
          </form>
        </div>
        </div>
        
  
        
      )
}

export default LoginNew;