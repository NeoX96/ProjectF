
import './css/Chat.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client"

const socket = socketIO.connect("http://localhost:4001");

function Chat() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };


  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    })

  },[])
  

  const sendPing = () => {
    socket.emit('ping');
  }


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
      
      <div>
        <button onClick={sendPing}>Send ping</button>
      </div>

      <div>
        <h2> Display: </h2>
        
          <input placeholder='Message...'  onChange={(event) => {setMessage(event.target.value)}}/>
          <button onClick={sendMessage}>Send Message</button>
          <ul id="messages">{messageReceived}</ul>
      </div>

    </div>
  );
}

export default Chat