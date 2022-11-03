import "./css/Chat.css";
import React, { useEffect, useState, useRef } from "react";
import socketIO from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Navigationbar from "./navigationbar";
import { Button } from "react-bootstrap";
const socket = socketIO.connect("http://localhost:4001");



function Chat() {
  // Messages Ref to scroll down
  const messagesRef = useRef(null);

  // States
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  // SocketIO
  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });

    // SocketIO Receive Message and store in MongoDB
    socket.on("receive_message", (data) => {
      setMessages([...messages, data]);
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    });

    // SocketIO User Disconnected Chat Bot
    socket.on("user_disconnected", (username) => {
      setMessages([...messages, { username: "Chat Bot", message: `${username} disconnected` }]);
      setConnected(false);
    });

    // SocketIO User Connected Chat Bot
    socket.on("user_connected", (username) => {
      setMessages([...messages,{ username: "Chat Bot", message: `${username} connected` }]);
      socket.emit("ask_users");
    });


  }, [messages]);

  // const for emit ask_messages
  const getMessagesEmit = () => {
    socket.emit("ask_messages");
  };

  // get Messages
  socket.on("get_messages", (data) => {
    // for each message.username message.message
    let newMessages = data.map(el => ({ username: el.username, message: el.message }));

    setMessages(messages => [ ...messages, ...newMessages]);
    console.log(data);
  });


  // get Users
  socket.on("get_users", (online, offline) => {
    let onlineUser = online.map(on => on.name);
    let offlineUser = offline.map(off => off.name);

    setOnlineUsers(onlineUser);
    setOfflineUsers(offlineUser);
    console.log(online, offline);
  });

  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("send_message", { username: username, message: message });
    setMessage("");
  }

  // Set Username and connect to SocketIO with prompt
  const setUsernameAndConnect = () => {
    let username = "";
    
    // if localstorage username is set
    if(localStorage.getItem("username")) {
      username = localStorage.getItem("username");
    } else {
      while (username === "" || username === null) {
        username = prompt("Please enter your username");
      }
      localStorage.setItem("username", username);
    }
    
    if (username) {
      setUsername(username);
      setConnected(true);
      socket.emit("user_connected", username);

    }
  }
  
  if (!connected) {
    setUsernameAndConnect();
  }

  return (
    <div>
      <Navigationbar />
    
    <div className="container-md">
      <div className="row">
        <div className="col-md">
          <div className=" ">
            <Button className="" onClick={getMessagesEmit}>Get Messages</Button>
          </div>

          <div className="UserList">
            <h4>Online</h4>
            <ul className="users">
              {onlineUsers.map((user, index) => (
                <li onClick={() => alert("Debug: Changed Text Chat")}key={index}>{user}</li>
              ))}
            </ul>
            <h4>Offline</h4>
            <ul className="users">
              {offlineUsers.map((user, index) => (
                <li onClick={() => alert("Debug: Changed Text Chat") }key={index}>{user}</li>
              ))}
            </ul>
          </div>
      </div>
      <div id="chatContainer" className="col-md">
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
                  <div className="col-md input-group">
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
                  <div className="col-sm" id="SocketID"></div>
                </div>
              </form>
            </div>
          <div className="connection">
            <p>Connected as: {username}</p>
          </div>
      </div>
    </div>
  </div>
  </div>
  );
}

export default Chat;