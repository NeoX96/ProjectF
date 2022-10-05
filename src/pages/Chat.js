import React from "react";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();

  return (
    <div>
        <h1> Chat </h1>
        <button
            onClick={() => {navigate("/Home");}}>Home
        </button>

        <button
            onClick={() => {navigate("/Maps");}}>Maps
        </button>
        
        <button
            onClick={() => {navigate("/Login");}}>Logout
        </button>
    </div>
  );
}

export default Chat;