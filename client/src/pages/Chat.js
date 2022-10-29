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



  // SocketIO
  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });

    // SocketIO Receive Message and store in MongoDB
    socket.on("receive_message", (data) => {
      setMessages([...messages, data]);
    });

    // SocketIO User Disconnected Chat Bot
    socket.on("user_disconnected", (username) => {
      setMessages([...messages, { username: "Chat Bot", message: `${username} disconnected` }]);
    });

    // SocketIO User Connected Chat Bot
    socket.on("user_connected", (username) => {
      setMessages([...messages,{ username: "Chat Bot", message: `${username} connected` }]);
    });

  }, [messages]);


  // const for emit get_messages
  const getMessagesEmit = () => {
    socket.emit("get_messages");
  };


  // SocketIO Receive Messages from MongoDB
  socket.on("get_messages", (data) => {
    // for each message.username message.message
    data.forEach((messageIN) => {
      setMessages([...messages, { username: messageIN.username, message: messageIN.message }]);
      console.log(`Name: ${messageIN.username} Message: ${messageIN.message}`)
      });
    console.log(data);
  });

  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send_message", { username: username, message: message });
    setMessage("");
  }

  // Set Username and connect to SocketIO with prompt
  const setUsernameAndConnect = () => {
    const username = prompt("Username");
    setUsername(username);
    setConnected(true);
        // SocketIo Emit Connection to Server
        socket.emit("user_connected", username);
  }
  
  if (!connected) {
    setUsernameAndConnect();
  }

  return (
    <div className="container">
      <div className="row ">
        <div className="navigation col ">
          <Navigationbar />
          <button onClick={getMessagesEmit}>Get Messages</button>
      </div>

      <div id="chatContainer" className="col">
          <div
            id="text"
            className="overflow-auto d-flex flex-column justify-content-between rounded"
          >
            <ul id="messages">
          {messages.map((message, index) => (
            <li
              key={index}
              className={
                message.username === username ? "text-end" : "text-start"
              }
            >
              <b>{message.username}</b>: {message.message}
            </li>
          ))}
          </ul>
          <div ref={messagesRef}></div>
        </div>
        
            <div>
              <form onSubmit={sendMessage}>
                <div className="row mt-2 mb-2  d-block ">
                  <div className="col input-group">
                    <input
                      placeholder="Message ..."
                      required
                      value={message}
                      onChange={(event) => {
                        setMessage(event.target.value);
                      }}
                      className="form-control"
                      type="text"
                    />
                    <button className="btn btn-primary" type="submit">
                      <i className="bi bi-send"></i>
                    </button>
                  </div>
                  <div className="col" id="SocketID"></div>
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