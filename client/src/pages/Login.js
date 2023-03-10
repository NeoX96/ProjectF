import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";

import { DOMAIN } from "../index";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDisabled =
    email.trim() === "" || password.trim() === "" || !email.includes("@");

  const changeAuthMode = () => {
    navigate("/Register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${DOMAIN}/login`, {
        email,
        password,
      });

      if (data.token) {
        var isSecure = window.location.protocol === "https:" ? true : false;
        Cookies.set("sessionID", data.token, {
          expires: 1,
          secure: isSecure,
          sameSite: isSecure ? "none" : "lax",
        });

        Cookies.set("vorname", data.user)

        window.location.href = "/Home";
      } else {
        alert("Access token is not returned");
      }
    } catch (error) {
      // switch case for error.response.data
      switch (error.response.status) {
        case 400:
          alert("Email oder Passwort falsch");
          break;
        case 401:
          alert("User nicht verifiziert");
          break;

        default:
          alert("Fehler", error.response);
      }

      Cookies.remove("sessionID");
    }
  };

  return (
<div className="d-flex justify-content-center text-center vh-100">
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: '300px' }}>
    <div>
      <h6>Welcome to Gonkle</h6>
      <Button onClick={changeAuthMode}>Sign Up</Button>
    </div>
    <Form onSubmit={handleLogin}>
      <div className="">
        <div className="mt-3">
          <Form.Control
            className="mt-1"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <Form.Control
            className="mt-1"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant={isDisabled ? "secondary" : "primary"}
            type="submit"
            disabled={isDisabled}
          >
            Login
          </Button>
        </div>
      </div>
    </Form>
    <div className="mt-5">test@rdf.de - asdfasdf</div>
  </div>
</div>

  );
}

export default Login;