import React from "react";
import Spinner from 'react-bootstrap/Spinner';

export default function wait() {

    // vertical and horizontal centering
    const style = {
        position: "absolute",
        top: "25%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    };


        return (
            <div className="d-flex align-items-center justify-content-center" style={style}>
                <h4>please be patient</h4>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
}