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
  }, [messages]);

  // useEffect for private Messages
  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });

    // SocketIO Receive Private Message
    socket.on("receive_private_message", (data) => {
      setPrivateMessages([...privateMessages, data]);
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    });
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

    return () => {
      socket.disconnect();
    };
  }, []);


  // const for emit ask_messages
  const getMessagesEmit = () => {
    socket.emit("ask_messages");
  };

  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    // if private message send to target user
    if (targetUser) {
      socket.emit("send_private_message", {
        message: message,
        targetId: targetUser,
      });
    } else {
      // else send to all users
      socket.emit("send_message", {
        username: username,
        message: message,
      });
    }
    setMessage("");
    socket.emit("send_message", { username: username, message: message });
    setMessage("");
  }

  // Set Username and connect to SocketIO with prompt
  const setUsernameAndConnect = () => {
    let username = "";

    while (username === "" || username === null) {
      username = prompt("Please enter your username");
    }

    setUsername(username);
    socket.connect();
    socket.emit("user_connected", username);
  }

  function ChatContainer (user) {
    // Messages Ref to scroll down
    const messagesRef = useRef(null);
    console.log("ChatContainer: ", user);

    // if user object is empty than return select user
    if (targetUser === null) {
      return (
        <div
          id="text"
          className="overflow-auto d-flex flex-column justify-content-between rounded" 
        >
          <div className="d-flex justify-content-center" >Select a User to chat with</div>
      </div>
      );
    } else {
      return (
        // key is the user id
        <div
          id="text"
          className="overflow-auto d-flex flex-column justify-content-between rounded"
          key={user.id}
        >
          <div className="d-flex justify-content-center" >Chat with {user.vorname}</div>
          <div className="d-flex flex-column">
            {privateMessages.map((message, index) => {
              return (
                <ul>
                </ul>
              );
            })}
          </div>
          <div ref={messagesRef} />
        </div>
      );
    }
  }


  if (username === "") {
    setUsernameAndConnect();
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
                {onlineUsers.map((user, index) => (
                  <li key={index}><Button variant="outline-light" onClick={() => alert("MongoDB_ID: " + user._id)} >{user.vorname}</Button></li>
                ))}
              </ul>
              <h4>Offline</h4>
              <ul className="users">
              { offlineUsers.map((user) => {
                  return (
                    <li key={user._id}>
                        <Button variant="outline-light" onClick={() => setTargetUser(user)} >{user.vorname}</Button>
                    </li>
                  );
                })
                }
              </ul>
            </div>
        </div>

          <div className="ChatContainer col">
            <ChatContainer user={targetUser}/>
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
