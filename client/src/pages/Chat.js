import "./css/Chat.css";
import React, { useEffect, useState, useRef } from "react";
import socketIO from "socket.io-client";
import { Button } from "react-bootstrap";
const endpoint = "http://localhost:4001";

const socket = socketIO(endpoint, { autoConnect: false });

function Chat() {
  // Messages Ref to scroll down
  const messagesRef = useRef(null);

  // States
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);


  const sessionID = localStorage.getItem("sessionID");

  if (sessionID) {
    if (username === "") {
      // call api get user by sessionID
      fetch(`http://localhost:4000/api/user/${sessionID}`)
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
          socket.auth = { sessionID };
          socket.connect();
          // get Username from MongoDB and set to socket
          socket.on("session", (data) => {
            setUsername(data.username);
            socket.username = data.username;
            socket.id = data.userID;
            socket.emit("user_connected", data.username);
          });
        });
    }
    socket.auth = { sessionID };
    socket.connect();
    // get Username from MongoDB and set to socket
    socket.on("session", (data) => {
      setUsername(data.username);
      socket.username = data.username;
      socket.id = data.userID;
      socket.emit("user_connected", data.username);
    });
  } else {
    let user_promt = prompt("Please enter your username");
    while (user_promt === "" || user_promt === null) {
      user_promt = prompt("Please enter your username");
    }
    setUsername(user_promt);
    socket.auth = { username: user_promt };
    socket.connect();


    socket.on("session", (data) => {
      localStorage.setItem("sessionID", data.sessionID);
      socket.username = data.username;
      socket.id = data.userID;
      socket.emit("user_connected", data.username);
    });

    socket.emit("ask_users");
  }

  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });

    // SocketIO Receive Message and store in MongoDB
    socket.on("receive_message", (data) => {
      setMessages([...messages, data]);
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    });

    socket.on("user_disconnected", (username) => {
      setMessages([...messages,{ username: "Chat Bot", message: `${username} disconnected` }]);
      socket.emit("ask_users");
    });
  
    socket.on("user_connected", (username) => {
      setMessages([...messages,{ username: "Chat Bot", message: `${username} connected` }]);
      socket.emit("ask_users");
    });

    return () => {
      socket.off ("receive_message");
      socket.off ("user_disconnected");
      socket.off ("user_connected");
    }
  }, [messages]);

  // useEffect for private Messages
  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });

    // SocketIO Receive Private Message
    socket.on("receive_private_message", (data) => {
      setPrivateMessages([...privateMessages, data]);
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off ("receive_private_message");
    }
  }, [privateMessages]);

  useEffect(() => {
     // get Messages
    socket.on("get_messages", (data) => {
      // for each message.username message.message
      let newMessages = data.map(el => ({ username: el.username, message: el.message }));

      setMessages(messages => [ ...messages, ...newMessages]);
      console.log(data);
    });

    socket.on("get_users", (online, offline) => {
      setOnlineUsers(online);
      setOfflineUsers(offline);
      console.log(online, offline);
    });

    
    socket.on("session", ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.id = userID;
    });

    return () => {
      socket.off ("get_messages");
      socket.off ("get_users");
      socket.off ("session");
    }
  }, []);


  // const for emit ask_messages
  const getMessagesEmit = () => {
    socket.emit("ask_messages");
  };

  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    // if private message send to target user
    if (targetUser !== null) {
      socket.emit("send_private_message", {
        message: message,
        username: username,
        // target user socketID
        targetUser: targetUser.userID
      });
    } else {
      // else send to all users
      socket.emit("send_message", { username: username, message: message });
    }
    setMessage("");
  }


  // select user to chat with
  const selectUser = (user) => {
    setTargetUser(user);
    socket.emit("ask_private_messages", user._id);
  }


  // ChatContainer for each user
  function ChatContainer () {
    // chat container for each user to chat with seperatly key = user._id
    if (targetUser !== null) {
      return (
        <div className="ChatContainer" key={targetUser.userID}>
          <h4>Chat with {targetUser.vorname}</h4>
          <ul className="list-group-item">
            {privateMessages.map((message, idx) => {
              return (
                <li key={idx}>
                  <b>{message.username}</b>: {message.message}
                </li>
              );
            })}
          </ul>
          <div ref={messagesRef}></div>
        </div>
      );
    } else {
      return (
        <div className="ChatContainer">
          <h4>Chat</h4>
          <ul className="list-group-item">
            {messages.map((message, idx) => {
              return (
                <li key={idx}>
                  <b>{message.username}</b>: {message.message}
                </li>
              );
            })}
          </ul>
          <div ref={messagesRef}></div>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="container-md">
        <div className="row">
          <div className="col-md">
            <div className=" ">
              <Button className="" onClick={getMessagesEmit}>Get Messages</Button>
            </div>

            <div className="UserList">
              <h4>Online</h4>
              <ul className="users">
              { onlineUsers.map((user, idx) => {
                  return (
                    <li key={idx}>
                        <Button variant="outline-light" onClick={() => selectUser(user)} >{user.vorname}</Button>
                    </li>
                  );
                })
                }
              </ul>
              <h4>Offline</h4>
              <ul className="users">
              { offlineUsers.map((user, idx) => {
                  return (
                    <li key={idx}>
                        <Button variant="outline-light" onClick={() => selectUser(user)} >{user.vorname}</Button>
                    </li>
                  );
                })
                }
              </ul>
            </div>
        </div>

          <div className="ChatContainer col">
          <div
            id="text"
            className="overflow-auto d-flex flex-column justify-content-between rounded" 
          >
            <ChatContainer />
          </div>
            <div ref={messagesRef}></div>
              <div>
                <form onSubmit={sendMessage}>
                  <div className="row mt-2 mb-2 d-block ">
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
                        <iconify-icon icon="ic:round-send"></iconify-icon>
                      </button>
                    </div>
                    <div className="col-sm" id="SocketID"></div>
                  </div>
                </form>
              </div>
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