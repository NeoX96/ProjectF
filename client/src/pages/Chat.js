import "./css/Chat.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import socketIO from "socket.io-client";

const socket = socketIO.connect("http://localhost:4001");

function Chat() {
  const navigate = useNavigate();

  // AutoScroll to Bottom
  const fieldRef = useRef(null);

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };

  // SocketIO Chat Message Receive and Send to Chat Field
  useEffect(() => {
    socket.on("receive_message", (data) => {
      var item = document.createElement("li");
      item.textContent = data.message;
      document.getElementById("messages").appendChild(item);

      // AutoScroll to Bottom
      fieldRef.current.scrollIntoView({
        behavior: "smooth",
      });
    });
  }, []);

  // Call Functions when pressing submit
  function handleSubmit(event) {
    event.preventDefault();

    sendMessage();
    setMessage("");
  }

  socket.on("connect", function () {
    var client_id = socket.io.engine.id;
    document.getElementById("SocketID").innerHTML = "ID: " + client_id;
  });

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

          <div class="col">
            <h3 class="m-3">Socket IDs of all Users</h3>
            <ul id="users"></ul>
          </div>
        </div>

        <div id="chatContainer" class="col">
          <div
            id="text"
            class="overflow-auto d-flex flex-column justify-content-between rounded"
          >
            <ul id="messages"></ul>
            <div ref={fieldRef}></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div class="row mt-2 mb-2">
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
              <div class="col" id="SocketID"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
