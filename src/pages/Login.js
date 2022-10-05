import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
        <h1> Register/Login </h1>
        <button
            onClick={() => {navigate("/Home");}}>Login
        </button>
    </div>
  );
}

export default Login;