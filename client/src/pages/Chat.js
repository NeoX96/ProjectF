import "./css/Chat.css";
import React, { useEffect, useState, useRef } from "react";
import socketIO from "socket.io-client";
import Navigationbar from "./navigationbar";
const socket = socketIO.connect("http://localhost:4001");


function Chat() {
  // Messages Ref to scroll down
  const messagesRef = useRef(null);

  // States
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

  // Scroll down to last message
  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SocketIO
  useEffect(() => {
    // SocketIO Disconnect
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // SocketIO Receive Message and store in MongoDB
    socket.on("receive_message", (data) => {
      setMessages([...messages, data]);
    });

    // SocketIO User Disconnected
    socket.on("user_disconnected", (id) => {
      setMessages([...messages, { id: id, message: "disconnected" }]);
    });

    // SocketIO Set Username
    socket.on("set_username", (data) => {
      setUsername(data.username);
      setConnected(true);
    });

  }, [messages]);

  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send_message", { username: username, message: message });
    setMessage("");
  }

  // Set Username and connect to SocketIO with prompt
  const setUsernameAndConnect = () => {
    const username = prompt("Username");
    socket.emit("set_username", { username: username });
  }
  
  if (!connected) {
    setUsernameAndConnect()
  }

  return (
    <div class="container">
      <div class="row ">
        <div class="navigation col ">
          <Navigationbar />
      </div>

      <div id="chatContainer" class="col">
          <div
            id="text"
            class="overflow-auto d-flex flex-column justify-content-between rounded"
          >
            <ul id="messages">
          {messages.map((message, index) => (
            <li key={index}>
              <b>{message.username}</b>: {message.message}
            </li>
          ))}
          </ul>
          <div ref={messagesRef}></div>
        </div>
        
            <div>
              <form onSubmit={sendMessage}>
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
          <div className="connection">
            <p>Connected as: {username}</p>
          </div>
      </div>
    </div>
  </div>
  );
}

export default Chat;