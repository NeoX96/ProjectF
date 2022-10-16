import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  if (authMode === "signin") {
    return (
      <div class="justify-content-center d-flex">
      <div className="Auth-form-container w-25">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h6 className="Auth-form-title">Welcome to SPORTSCONNECT</h6>
            
             
            <div className="form-group mt-3">
              <label>Forgot Password ?</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Enter email"
              />
            </div>
            
            <div className="d-grid gap-2 mt-3">
            <button onClick={() => {navigate("/Home")}} className="btn btn-primary">Send new Password
            </button>
            </div>
            
          </div>
        </form>
      </div>
      </div>

      
    )
  }

  return (
    <div class="justify-content-center d-flex">
    <div className="Auth-form-container w-25">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
            />
          </div>
          
          <div className="d-grid gap-2 mt-3">
            <button onClick={() => {navigate("/Home")}} className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="/login">password?</a>
          </p>
        </div>
      </form>
    </div>
    </div>
  )
}


export default Login;