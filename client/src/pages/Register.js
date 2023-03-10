import React, { useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { DOMAIN } from "../index";

function Register() {
  const navigate = useNavigate();

  const [vorname, setVorname] = useState("");
  const [nickname, setNickname] = useState("");
  const [geburtstag, setGeburtstag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const changeAuthMode = () => {
    navigate("/Login");
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const registered = {
      vorname: vorname,
      username: nickname,
      birthday: geburtstag,
      email: email,
      password: password,
    };

    axios
      .post(`${DOMAIN}/createUser`, registered)
      .then((res) => {
        console.log(res.data);
        navigate("/Home");
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(registered);
  };

  return (
<div className="d-flex justify-content-center text-center vh-100">
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '600px' }}>
        <div className="text-center mb-3">
          <h2>Welcome to Gonkle</h2>
          <Button onClick={changeAuthMode}>Sign In</Button>
        </div>

        <form className="Auth-form" onSubmit={handleRegister}>
          <h3 className="Auth-form-title">Registrieren</h3>
          <div className="Auth-form-content">
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Addresse"
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Vorname</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Vorname"
                required
                onChange={(event) => {
                  setVorname(event.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Benutzername</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Nickname"
                required
                onChange={(event) => {
                  setNickname(event.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Geburtstag</label>
              <input
                type="date"
                className="form-control mt-1"
                placeholder="Geburstag"
                required
                onChange={(event) => {
                  setGeburtstag(event.target.value);
                }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Passwort"
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
  );
}

export default Register;
