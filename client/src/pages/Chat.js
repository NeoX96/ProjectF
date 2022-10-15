import "./css/Chat.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";

const socket = socketIO.connect("http://localhost:4001");

function Chat() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");


  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      var item = document.createElement("li");
      item.textContent = data.message;
      document.getElementById("messages").appendChild(item);
    });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    sendMessage();
    setMessage("");
  }


  return (
    <div class="container">
      <div class="row ">
        <div class="navigation col ">
          <h1> Chat</h1>
          <button
            onClick={() => {
              navigate("/Home");
            }}
          >
            Home
          </button>

          <button
            onClick={() => {
              navigate("/Maps");
            }}
          >
            Maps
          </button>

          <button
            onClick={() => {
              navigate("/Login");
            }}
          >
            Logout
          </button>
        </div>

        <div id="test" class="col">
          <ul id="messages"></ul>
          <form onSubmit={handleSubmit}>
            <div class="row">
              <div class="col">
                <input
                  placeholder="Message..."
                  required
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  class="rounded form-control"
                  type="text"
                />
              </div>
              <div class="col">
                <button class="btn btn-outline-primary" type="submit">
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
