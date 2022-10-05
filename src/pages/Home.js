import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
        <h1> HomePage </h1>
        <button
            onClick={() => {navigate("/Chat");}}>Chat
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

export default Home;