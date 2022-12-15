import React, { useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("signin");
  const [vorname, setVorname] = useState("");
  const [nickname, setNickname] = useState("");
  const [geburtstag, setGeburtstag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }


  const handleRegister = (event) => {
    event.preventDefault();
    const registered = {
        vorname: vorname,
        username: nickname,
        birthday: geburtstag,
        email: email,
        password: password
    };

    axios.post('http://localhost:4000/createUser', registered).then(res => {
        console.log(res.data);
        navigate("/Home");
    }).catch(err => {
        console.log(err);
    });

    console.log(registered);
  }


        

  if (authMode === "signin") {
    return (
      <div className="justify-content-center d-flex">
      <div className="Auth-form-container w-25">
      <div className="text-center">
          <p>Not registered?</p>
          <span className="link-primary" onClick={changeAuthMode}>
            Sign UP
          </span>
        </div>
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h6 >Welcome to SPORTSCONNECT</h6>
            
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
            <button onClick={() => {navigate("/Home")}} className="btn btn-primary">Submit
            </button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="/">password?</a>
            </p>
          </div>
        </form>
      </div>
      </div>
      

      
    )
  }

  return (
    <div className="justify-content-center d-flex">
      <div className="Auth-form-container w-25">
        <div className="text-center">
          <p>Already registered?</p>
          <span className="link-primary" onClick={changeAuthMode}>
            Sign In
          </span>
        </div>

        <form className="Auth-form" onSubmit={handleRegister}>
        <h3 className="Auth-form-title">Registrieren</h3>
        <div className="Auth-form-content">
          <div className="form-group mt-3">
            <label>Email address</label>
            <input type="email" className="form-control mt-1" placeholder="Email Addresse" required
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label>Vorname</label>
            <input type="text" className="form-control mt-1" placeholder="Vorname" required
              onChange={(event) => {
                setVorname(event.target.value);
              }}/>
          </div>
          <div className="form-group mt-3">
            <label>Benutzername</label>
            <input type="text" className="form-control mt-1" placeholder="Nickname" required
              onChange={(event) => { 
                setNickname(event.target.value);
              }}/>
          </div>
          <div className="form-group mt-3">
            <label>Geburtstag</label>
            <input type="date" className="form-control mt-1" placeholder="Geburstag" required
              onChange={(event) => {
                setGeburtstag(event.target.value);
              }}/>
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input type="password" className="form-control mt-1" placeholder="Passwort"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  )
}


export default Login;