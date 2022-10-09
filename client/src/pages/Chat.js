import React from "react";
import './css/Chat.css';
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();

  return (
    <div>
      <div class="navigation">
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

      <div class="chat">
        <ul id="messages"></ul>
        <form id="form" action="">
          <input id="input" autocomplete="off" /><button>Send</button>
        </form>
      </div>

    </div>
  );
}

export default Chat;