import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";

const DOMAIN = "http://localhost:4000";


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

      if (data.accessToken) {
        Cookies.set("sessionID", data.accessToken, {
          expires: 1,
          sameSite: "none",
          secure: true,
        });

        window.location.href = "/Home";
      } else {
        alert("Access token is not returned");
      }
    } catch (error) {
      console.log(error.response);
      alert("Error logging in. Please try again.");
      Cookies.remove("sessionID");
    }
  };

  return (
    <div className="d-flex justify-content-center text-center">
      <div className="">
        <div>
          <h6>Welcome to SPORTSCONNECT</h6>
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
