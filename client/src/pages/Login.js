import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';


function Login () {
    const navigate = useNavigate();

    const [email , setemail]= useState('');
    const [password , setPassword] = useState('');

    const changeAuthMode = () => {
        navigate("/Register");
    }

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // login logic with axios
        const user = {
            email: email,
            password: password
        };
    
        try {
            // send post request to the backend
            const res = await axios.post('http://localhost:4000/login', user);
            console.log("AccessToken: " + res.data.accessToken);
            console.log("Status: " + res.status);

            
            // check if the response is successful (200)
            if (res.status === 200) {
                // parse the response data
                const data = res.data;
                // check if the access token is returned
                if (data.accessToken) {
                    // set the access token as a cookie using js-cookie
                    Cookies.set('sessionID', data.accessToken, {
                        expires: 1
                      });

                    if (Cookies.get('sessionID')) {
                        navigate('/Home');
                    } else {
                        alert("Cookie is not set");
                    }
                } else {
                    alert("Access token is not returned");
                }
            } else {
                // if the response is not successful (200), show the error message
                alert(res.status + " " + res.error);
            }
        } catch (error) {
            // if there is any error, show the error message
            alert(error.message);
        }
    }


    return (
        <div className="justify-content-center d-flex">
        <div className="Auth-form-container w-25">
          <form className="Auth-form">
            <div className="Auth-form-content">
              <div className="text-center">
                <h6 >Welcome to SPORTSCONNECT</h6>
                <Button onClick={changeAuthMode}>
                  Sign Up
                </Button>
              </div>
              <h3 className="Auth-form-title">Login</h3>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input className="form-control mt-1" type="email" name="" id="email" placeholder='Email' onChange={(e)=>setemail(e.target.value)} />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input className="form-control mt-1" type="password" placeholder='******' name="" onChange={(e)=>setPassword(e.target.value)} id="password" />
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