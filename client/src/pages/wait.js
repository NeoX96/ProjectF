import React, { Component } from "react";

export default class SignUp extends Component {
    render() {
        return (
            <div class="justify-content-center d-flex" className="text-center">
                <form className="Auth-form">
                <h3>Wait just one more second</h3></form>
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