import "./css/Chat.css";
import React, { useEffect, useState, useRef } from "react";
import socketIO from "socket.io-client";
import { Button, ListGroup, Modal, Table} from "react-bootstrap";
import Cookies from 'js-cookie'
const endpoint = "http://localhost:4001";

const socket = socketIO(endpoint, { autoConnect: false });

function Chat() {
  // Messages Ref to scroll down
  const messagesRef = useRef(null);

  // States
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState({});
  const [username, setUsername] = useState("");
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [offlineFriends, setOfflineFriends] = useState([]);
  const [targetUser, setTargetUser] = useState(null);

  const sessionID = Cookies.get('sessionID');

  if (sessionID) {
    socket.auth = { sessionID };
    socket.connect();

    // get Username from MongoDB and set to socket
    socket.on("session", (data) => {
      setUsername(data.username);
      socket.username = data.username;
      socket.id = data.userID;
      socket.name = data.name;
      socket._id = data._id;
    });
  } else {
    let user_promt = null;
    while (user_promt === null) {
      user_promt = prompt("Please enter your username");
    }
    setUsername(user_promt);
    socket.auth = { username: user_promt };
    socket.connect();


    socket.on("session", (data) => {
      Cookies.set('sessionID', data.sessionID);
      socket.username = data.username;
      setUsername(data.username);
      socket.id = data.userID;
      socket.name = data.name;
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
      setMessages([...messages,{ vorname: "Chat Bot", message: `${username} disconnected` }]);
    });
  
    socket.on("user_connected", (username) => {
      setMessages([...messages,{ vorname: "Chat Bot", message: `${username} connected` }]);
    });

    return () => {
      socket.off ("receive_message");
      socket.off ("user_disconnected");
      socket.off ("user_connected");
    }
  }, [messages]);

  useEffect(() => {
    socket.on("user_connected", () => {
      socket.emit("ask_users");
    });

    socket.on("user_disconnected", () => {
      socket.emit("ask_users");
    });
  }, [onlineFriends, offlineFriends]);

  // useEffect for private Messages
  useEffect(() => {
    messagesRef.current.scrollIntoView({ behavior: "smooth" });
    socket.on("receive_private_message", (data) => {
      setPrivateMessages({
        ...privateMessages,
        [targetUser]: [...privateMessages[targetUser], data],
      });
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("receive_private_message");
    };
  }, [privateMessages, targetUser]);


  useEffect(() => {
// get_friends erstmal auskommentiert
    socket.on("get_users", (online, offline) => {
      setOnlineFriends(online);
      setOfflineFriends(offline);
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
      socket.off ("get_friends");
      socket.off ("session");
    }
  }, []);


  // Send Message
  const sendMessage = (e) => {
    e.preventDefault();
    // if private message send to target user
    if (targetUser !== null) {
      socket.emit("send_private_message", {
        message: message,
        targetUser: targetUser.userID,
        sender: socket.id,

      });
    } else {
      // else send to all users
      socket.emit("send_message", { username: username, message: message, vorname : socket.name });
    }
    setMessage("");
  }





  // select user to chat with
  const selectUser = (user) => {
    setTargetUser(user);
  }

  const unselectUser = () => {
    setTargetUser(null);
  }

  useEffect(() => {
    setPrivateMessages({
      ...privateMessages,
      [targetUser]: [],
    });

    if(targetUser) {
      console.log(targetUser.userID);
      socket.emit("ask_private_messages", {sender: socket.id, targetUser: targetUser.userID});
    }

    socket.on("get_private_messages", (data) => {
        setPrivateMessages({
            ...privateMessages,
            [targetUser]: data,
        });
    });

    return () => {
        socket.off("get_private_messages");
    }
  }, [targetUser]);



  // ChatContainer for each user
  function ChatContainer () {

    // chat container for each user to chat with seperatly key = user._id
    if (targetUser !== null) {
      return (
        <div>
          <h4 className="justify-content-center">Chat with {targetUser.vorname}</h4>
        <div
          id="text"
          className="overflow-auto d-flex flex-column justify-content-between rounded" 
          key={targetUser.userID}>
          <ul className="list-group-item">
          {privateMessages[targetUser] ? privateMessages[targetUser].map((message, idx) => {
            return (
              <li key={idx} className={message.sender === socket._id || message.sender === socket.id ? "text-end users" : "text-start users"} >
                {message.message}
              </li>
            );
          }) : <li className="justify-conent-center">No messages yet.</li>}
          </ul>
          <div ref={messagesRef}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h4>All Chat</h4>
        <div
        id="text"
        className="overflow-auto  justify-content-between rounded" 
        >
          <ul className="list-group-item">
            {messages.map((message, idx) => {
              return (
                <li key={idx} className={message.username === username ? "text-end users" : "text-start users"} >
                  <b>{message.vorname}</b>: {message.message}
                </li>
              );
            })}
          </ul>
          <div ref={messagesRef}></div>
        </div>
        </div>
      );
    }
  }

  const [showFriendModal, setshowFriendModal] = useState(false);

  function Search() {
    const [searchUser, setSearchUser] = useState("");
    const [searchUserResult, setSearchUserResult] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const searchHandler = (e) => {
      const searchValue = e.target.value;
      setSearchUser(searchValue);
      if (searchValue.length > 0) {
        setShowResults(true);
        socket.emit("search_user", searchValue);
      } else {
        setShowResults(false);
      }
    };

    useEffect(() => {
      socket.on("get_user", (results) => {
        setSearchUserResult(results);
      });
      return () => {
        socket.off("get_user");
      };
    }, []);

    useEffect(() => {
      if (selectedUser) {
        socket.emit("send_friend_request", selectedUser._id);
        socket.on("friend_request_response", (data) => {
          const { success, message } = data;
          if (success) {
            alert(message);
            setSelectedUser(null);
          } else {
            alert(message);
            setSelectedUser(null);
          }
        });
        return () => {
          socket.off("friend_request_response");
        };
      }
    }, [selectedUser]);

    const handleUserClick = (user) => {
      setSelectedUser(user);
    };

    return (
      <div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"
            value={searchUser}
            onChange={searchHandler}
          />
        <Button>
          <iconify-icon icon="mingcute:contacts-line" onClick={() => setshowFriendModal(true)}/>
        </Button>
        </div>
        {showResults && (
          <ListGroup>
            {searchUserResult.map((result, index) => (
              <ListGroup.Item
                action
                key={index}
                onClick={() => handleUserClick(result)}
                variant="light"
              >
                {result.username} {result.vorname}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    );
  } 

  const FriendsModal = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
  
    const handleClose = () => setshowFriendModal(false);
  
    if (showFriendModal) {
      useEffect(() => {
        socket.emit("ask_pending_requests", socket._id);
        socket.on("get_pending_requests", (data) => {
          if (data.success) {
            setPendingRequests(data.pendingUsers);
          }
        });
        return () => {
          socket.off("get_pending_requests");
        };
      }, [showFriendModal]);
    }
  
    return (
      showFriendModal ? (
        <>
          <Modal show={showFriendModal} onHide={handleClose} className="text-center" >
          <Modal.Body>
            <Table striped hover>
              <thead>
              <tr >
                <th>Username</th>
                <th>Vorname</th>
                <th>Aktion</th>
              </tr>
              </thead>
              <tbody className="align-middle">
              {pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.username}</td>
                  <td>{request.vorname}</td>
                  <td>
                    <Button
                      className="mr-2"
                      variant="success"
                      onClick={() => {
                        alert(request.username + " accepted");
                        socket.emit("accept_request", request._id);
                        handleClose();
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        alert(request.username + " declined");
                        socket.emit("decline_request", request._id);
                        handleClose();
                      }}
                    >
                      Decline
                    </Button>
                  </td>
                </tr>
              ))
              ) : null}
              </tbody>
            </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <div />
      )
    );
  };
  

  return (
    <div>
      <div className="container-md">
        <div className="row">
          <div className="col-md">
            <div className="mt-1">
              <Button className="" onClick={unselectUser}>All Chat</Button>
            </div>

            <div>
              <Search  />
              <FriendsModal />
            </div>

            <div className="UserList">
              <h4>Online</h4>
              <ul className="users">
              { onlineFriends.map((user, idx) => {
                  return (
                      <li key={idx}>
                          <Button variant="outline-light" onClick={() => selectUser(user)} >{user.vorname}</Button>
                      </li>
                  );
              })}
              </ul>
              <h4>Offline</h4>
              <ul className="users">
              { offlineFriends.map((user, idx) => {
                  return (
                      <li key={idx}>
                          <Button variant="outline-light" onClick={() => selectUser(user)} >{user.vorname}</Button>
                      </li>
                  );
              })}
              </ul>
          </div>
        </div>

          <div className="ChatContainer col">
            <ChatContainer />
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
              <p>Connected as: {socket.name}</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
