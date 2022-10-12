import React, { Component } from "react";
export default class SignUp extends Component {
    render() {
        return (
            <div>
                <h3>React SignUp Component</h3>          <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick>
                Los !
              </button>
            </div>
            
            </div>
        );
    }
}

/*
import React, { Component } from "react";
import {useState} from 'react';
export default class SignUp extends Component {
    render() {
        return (
            <div>const[value, setValue] = ustState(0);
                <h3>React SignUp Component</h3>         
                 <div className="d-grid gap-2 mt-3">
              <button onClick={() =>setValue(value + 1)}>
                Los !
              </button>
            </div>
            </div>
        );
    }
    */

   /*
   import React, { Component } from 'react'
export default class SignUp extends Component {
  render() {
    return (
      <form>
        <h3>Sign Up</h3>
        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
          />
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input type="text" className="form-control" placeholder="Last name" />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already regstered <a href="/sign-in">sign in?</a>
        </p>
      </form>
    )
  }
}*/
