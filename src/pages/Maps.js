import React from "react";
import { useNavigate } from "react-router-dom";

function Maps() {
  const navigate = useNavigate();

  return (
    <div>
        <h1> Maps </h1>
        <button
            onClick={() => {navigate("/Home");}}>Home
        </button>

        <button
            onClick={() => {navigate("/Chat");}}>Chat
        </button>

        <button
            onClick={() => {navigate("/Login");}}>Logout
        </button>
    </div>
  );
}

export default Maps;