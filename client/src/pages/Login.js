import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Button, Form  } from 'react-bootstrap';
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
    <div className="d-flex justify-content-center">
        <div className="">
            <div className="text-center">
                <h6>Welcome to SPORTSCONNECT</h6>
                <Button onClick={changeAuthMode}>
                    Sign Up
                </Button>
            </div>
            <div className="">
                <h3>Login</h3>
                <div className="form-group mt-3">
                    <Form.Control className="mt-1" type="email" name="" id="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group mt-3">
                    <Form.Control className="mt-1" type="password" placeholder='Password' name="" onChange={(e) => setPassword(e.target.value)} id="password" />
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <Button onClick={handleLogin}>Submit</Button>
                </div>
            </div>
        </div>
    </div>
);
}

export default Login
