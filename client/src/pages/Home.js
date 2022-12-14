import React from "react";
import images from './assets/home/index';
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import "./css/Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div >
          <div className="justify-content-center d-flex">
            <h6>Wähle deine Sportart aus</h6>
          </div>

          <div className="justify-content-center d-flex">
            <Carousel wrap={true} touch={true} keyboard={true}>
                
           
                <Carousel.Item>
                    <div onClick={() => {navigate("/Maps")}}>
                        <img src={images.frisbee} alt="Frisbee" className="photo"/>
                        <Carousel.Caption><h6>NR 1 Frisbee</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                     <div onClick={() => {navigate("/Maps")}}>
                        <img src={images.fussball} alt="Fußball" className="photo"/>
                    
                        <Carousel.Caption><h6>NR 2 Fußball</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div>
                        <img src={images.volleyball} alt="Volleyball" className="photo"/>
                      
                        <Carousel.Caption><h6>NR 3 Volleyball</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.baskettball} alt="Baskettball" className="photo"/>
                      
                        <Carousel.Caption><h6>NR 4 Baskettball</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.tischtennis} alt="Tischtennis" className="photo"/>
                        
                        <Carousel.Caption><h6>NR 5 Football</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.skateboard} alt="Skateboard" className="photo"/>
                        
                        <Carousel.Caption><h6>NR 6 Skateboard</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
            </Carousel>
            </div>
            
            <div className="justify-content-center d-flex mt-5">
              <button  onClick={() => {navigate("/Maps")}} className="btn btn-secondary justify-content-center d-flex" >LET´S PLAY !</button>
            </div>
        </div>
      
    );
}

export default Home;





/*

      <script src="https://apis.google.com/js/platform.js" async defer></script>

      <div class="g-signin2" data-onsuccess="onSignIn"></div>

 <p className="legend">Sportart 1</p>

<a href="/forgotpw">password? </a> 


import React, { useState } from "react"
import images from './assets/index';

import { useNavigate } from "react-router-dom";

import { Carousel } from 'react-bootstrap';

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
              <h6 className="Auth-form-title">Home.js</h6>
              <div >
                Not registered yet?{" "}
                <span className="link-primary" onClick={changeAuthMode}>
                  Sign Up
                </span>
              </div>
              <div >
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
                Forgot <a href="/login">password?</a>
              </p>
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
            <h6 className="Auth-form-title">Sign In</h6>
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
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
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
*/

/*
function Home() {
    const navigate = useNavigate();

    return (
        <div >
            <h6>home.js</h6>







            
            <button
                onClick={() => { navigate("/Chat"); }}>Chat
            </button>

            <button
                onClick={() => { navigate("/Maps"); }}>Maps
            </button>

            <button
                onClick={() => { navigate("/Login"); }}>Logout
            </button>
            <button
                onClick={() => { navigate("/Settings"); }}>Settings|geoCache
            </button>
            <br></br>
<div class="justify-content-center d-flex">
            <Carousel slide={true}>
                <Carousel.Item>
                    <div onClick={() => {navigate("/Settings")}}>
                        
                        <p className="legend">Sportart 1</p>
                        <img src={images.frisbee} alt="Frisbee"/>
                        

                        <Carousel.Caption><h6>Frisbee</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                     <div onClick={() => {navigate("/Maps")}}>
                        <img src={images.fussball} alt="Fußball"/>
                        <p className="legend">Sportart 2</p>
                        <Carousel.Caption><h6>Soccer</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div>
                        <img src={images.volleyball} alt="Volleyball"/>
                        <p className="legend">Sportart 3</p>
                        <Carousel.Caption><h6>Volleyball</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.baskettball} alt="Baskettball"/>
                        <p className="legend">Sportart 4</p>
                        <Carousel.Caption><h6>Baskettball</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.tischtennis} alt="Tischtennis"/>
                        <p className="legend">Sportart 4</p>
                        <Carousel.Caption><h6>Football</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.skateboard} alt="Skateboard"/>
                        <p className="legend">Sportart 4</p>
                        <Carousel.Caption><h6>Skateboard</h6></Carousel.Caption>
                    </div>
                </Carousel.Item>
            </Carousel>
            </div>
        </div>


    );
}

export default Home;


*/

/*

                <div>
                    <img src={images.b}/>
                    <p className="legend1">Sportart 2</p>
                
                    <img src={images.c}/>
                    <p className="legend2">Sportart 3</p>
                </div>
                
            </Carousel>
            <Carousel  showArrows={true}>
                <div>
                    <img src={images.a} />
                    <p className="legend">Sportart 1</p>
                </div>
                <div>
                    <img src={images.b}/>
                    <p className="legend1">Sportart 2</p>
                
                    <img src={images.c}/>
                    <p className="legend2">Sportart 3</p>
                </div>
                
    */