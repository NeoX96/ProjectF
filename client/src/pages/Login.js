import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';


function Login () {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const changeAuthMode = () => {
    navigate("/Register");
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('http://localhost:4000/login', {
        email,
        password
      });

      if (data.accessToken) {
        Cookies.set('sessionID', data.accessToken, {
          expires: 1,
          sameSite: "none",
          secure: true
        });

        window.location.href = "/Home";
      } else {
        alert("Access token is not returned");
      }
    } catch (error) {
      console.log(error.response);
      alert("Error logging in. Please try again.");
      Cookies.remove('sessionID');
    }
  };

  return (
    <div className="justify-content-center d-flex">
      <div className="Auth-form-container w-25">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <div className="text-center">
              <h6>Welcome to SPORTSCONNECT</h6>
              <Button onClick={changeAuthMode}>
                Sign Up
              </Button>
            </div>
            <h3 className="Auth-form-title">Login</h3>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input className="form-control mt-1" type="email" name="" id="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input className="form-control mt-1" type="password" placeholder='******' name="" onChange={(e) => setPassword(e.target.value)} id="password" />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button onClick={handleLogin} className="btn btn-primary">Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
