import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
        <h1> Register/Login </h1>
        <div>Aenderung 3</div>
        <button
            onClick={() => {navigate("/Home");}}>Login
        </button>
    </div>
  );
}

export default Login;