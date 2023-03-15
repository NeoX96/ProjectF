import React, { useEffect, useState, useRef } from "react";
import socketIO from "socket.io-client";
import { Modal, Table } from "react-bootstrap";
import Cookies from "js-cookie";
import { endpoint } from "../index";
import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  ListItemText,
  ListItem,
  List,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Divider,
  Badge,
  Fab
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import PersonRemoveTwoToneIcon from "@mui/icons-material/PersonRemove";
import SendIcon from '@mui/icons-material/Send';

const socket = socketIO(endpoint, { autoConnect: false });

function Chat() {
  // Messages Ref to scroll down
  const messagesRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // States
  const [privateMessages, setPrivateMessages] = useState({});
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [offlineFriends, setOfflineFriends] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [showFriendModal, setshowFriendModal] = useState(false);

  const [unreadMessagesCount, setUnreadMessagesCount] = useState({});

  const sessionID = Cookies.get("sessionID");

  // useEffect zum Verbinden mit SocketIO
  useEffect(() => {
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();

      // get Username from MongoDB and set to socket
      socket.on("session", (data) => {
        socket.username = data.username;
        socket.id = data.userID;
        socket.name = data.name;
        socket._id = data._id;
      });
    } else {
      // redirect to login
      window.location.href = "/Login";
    }
  }, [sessionID]);

  // useEffect for Friends
  useEffect(() => {
    socket.on("user_connected", () => {
      socket.emit("ask_friends");
    });

    socket.on("user_disconnected", () => {
      socket.emit("ask_friends");
    });
  }, [onlineFriends, offlineFriends]);

  // useEffect for private Messages
  useEffect(() => {
    socket.on("receive_private_message", (data) => {
      setPrivateMessages({
        ...privateMessages,
        [targetUser]: [...privateMessages[targetUser], data],
      });

      if (targetUser === null || data.sender !== targetUser.userID) {
        setUnreadMessagesCount({
          ...unreadMessagesCount,
          [data.sender]: (unreadMessagesCount[data.sender] || 0) + 1,
        });
      }

    });

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }

    return () => {
      socket.off("receive_private_message");
    };
  }, [privateMessages, targetUser, unreadMessagesCount]);

  // initial useEffect
  useEffect(() => {
    socket.emit("ask_pending_requests", socket._id);

    // socket.on ask_friends
    socket.on("ask_friends", () => {
      socket.emit("ask_friends");
    });

    // get_friends erstmal auskommentiert
    socket.on("get_friends", (online, offline) => {
      setOnlineFriends(online);
      setOfflineFriends(offline);
      console.log(online, offline);
    });

    // response from server if friend request was accepted
    socket.on("accept_request_response", (data) => {
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    });

    // response from server if friend requst was denied
    socket.on("decline_request_response", (data) => {
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    });

    // response from server if friend was deleted
    socket.on("delete_friend_response", (data) => {
      if (data.success) {
        alert(data.message);
        socket.emit("ask_friends");
      } else {
        alert(data.message);
      }
    });

    return () => {
      socket.off("get_friends");
      socket.off("session");
      socket.off("accept_request_response");
      socket.off("decline_request_response");
      socket.off("delete_friend_response");
      socket.disconnect();
    };
  }, []);

  // Send Message
  const sendMessage = (event) => {
    event.preventDefault();
    const value = event.target.elements.message.value;
    console.log(event.target.elements.message.value);
    if (value === "") return;

    console.log(value);
    // if private message send to target user
    if (targetUser !== null) {
      socket.emit("send_private_message", {
        message: value,
        targetUser: targetUser.userID,
        sender: socket.id,
      });
    } else {
      return;
    }
  };

  const deleteFriend = (friend) => {
    socket.emit("delete_friend", friend);
    unselectUser();
  };

  // select user to chat with
  const selectUser = (user) => {
    setTargetUser(user);
  };

  const unselectUser = () => {
    setTargetUser(null);
  };

  // useEffect for private messages
  useEffect(() => {
    setPrivateMessages((prevPrivateMessages) => ({
      ...prevPrivateMessages,
      [targetUser]: [],
    }));

    if (targetUser) {
      console.log(targetUser.userID);
      socket.emit("ask_private_messages", {
        sender: socket.id,
        targetUser: targetUser.userID,
      });
    }

    socket.on("get_private_messages", (data) => {
      setPrivateMessages((prevPrivateMessages) => ({
        ...prevPrivateMessages,
        [targetUser]: data,
      }));
    });

    return () => {
      socket.off("get_private_messages");
    };
  }, [targetUser]);

  // ChatContainer for each user
  function ChatContainer() {
    // chat container for each user to chat with seperatly key = user._id
    if (targetUser !== null) {
      return (
        <Box sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(5px)",
              borderRadius: 2,
              padding: 1,
              boxShadow: 3,
              height: "10%",
              maxWidth: "100%",
            }}
          >
            <Box>
              <IconButton onClick={() => unselectUser()}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                marginLeft: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  textShadow: "4px 4px 4px rgba(30, 30, 30, 0.6)",
                  textDecoration: "none",
                  cursor: "default",
                  color: "white",
                }}
              >
                {targetUser.vorname}
              </Typography>
            </Box>
            <Box
              sx={{
                marginLeft: "auto",
              }}
            >
              <IconButton
                sx={{ boxShadow: 2, mr: 5, backdropFilter: 4 }}
                onClick={() => deleteFriend(targetUser._id)}
              >
                <PersonRemoveTwoToneIcon color="error" />
              </IconButton>
            </Box>
          </Box>

          <Box
            p={2}
            mt={2}
            sx={{
              borderRadius: 2,
              backgroundColor: "rgba(20, 20, 20, 0.6)",
              backdropFilter: "blur(10px)",
              color: "white",
              boxShadow: 3,
              height: "85%",
              marginBottom: 2,
              overflow: "auto",
            }}
          >
            <List
              sx={{
                position: "relative",
                overflow: "auto",
                width: "100%",
                "& ul": { padding: 0 },
              }}
            >
              {privateMessages[targetUser] ? (
                privateMessages[targetUser].map((message, idx) => {
                  const date = new Date(message.date);
                  const formattedDate = date.toLocaleDateString();
                  const formattedTime = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const shouldShowDate =
                    idx === 0 ||
                    formattedDate !==
                      new Date(
                        privateMessages[targetUser][idx - 1].date
                      ).toLocaleDateString();

                  return (
                    <div key={idx}>
                      {shouldShowDate && (
                        <ListItem
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            {formattedDate}
                          </Typography>
                        </ListItem>
                      )}
                      <ListItem
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems:
                            message.sender === socket._id ||
                            message.sender === socket.id
                              ? "flex-end"
                              : "flex-start",
                          backgroundColor:
                            message.sender === socket._id ||
                            message.sender === socket.id
                              ? "rgba(0, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.08)",
                          borderRadius: 5,
                          padding: 1,
                          marginBottom: 1,
                          boxShadow: 1,
                          maxWidth: "75%",
                          width: "fit-content",
                          marginLeft:
                            message.sender === socket._id ||
                            message.sender === socket.id
                              ? "auto"
                              : 0,
                          marginRight:
                            message.sender === socket._id ||
                            message.sender === socket.id
                              ? 0
                              : "auto",
                        }}
                      >
                        <ListItemText
                          primary={message.message}
                          secondary={formattedTime}
                        />
                      </ListItem>
                      {shouldShowDate && <Divider sx={{ margin: "4px 0" }} />}
                    </div>
                  );
                })
              ) : (
                <ListItem>
                  <ListItemText primary="No messages yet" />
                </ListItem>
              )}
              <div ref={messagesRef}></div>
            </List>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box
          sx={{
            borderRadius: 5,
            backgroundColor: "rgba(0, 255, 255, 0.08)",
            backdropFilter: "blur(5px)",
            boxShadow: 3,
          }}
        ></Box>
      );
    }
  }

  // SearchBar Funktion
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
      if (searchUser.length === 0) {
        setShowResults(false);
      } else {
        setShowResults(true);
      }
    }, [searchUser]);

    useEffect(() => {
      socket.on("get_user", (results) => {
        setSearchUserResult(results);
      });
      return () => {
        socket.off("get_user");
      };
    }, [searchUserResult]);

    useEffect(() => {
      if (selectedUser) {
        socket.emit("send_friend_request", selectedUser._id);
        socket.on("friend_request_response", (data) => {
          const { success, message } = data;
          if (success) {
            alert(message);
            setSelectedUser(null);
            setSearchUser("");
          } else {
            alert(message);
            setSelectedUser(null);
            setSearchUser("");
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
      <Box>
        <TextField
          placeholder="Search"
          value={searchUser}
          onChange={searchHandler}
          sx={{
            width: "100%",
            "& .MuiInputBase-input": {
              paddingLeft: "32px",
              maxHeight: "5px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  sx={{ padding: "6px" }}
                  onClick={() => setshowFriendModal(true)}
                >
                  <AddIcon />
                </Button>
              </InputAdornment>
            ),
          }}
        />
        {showResults && (
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "100px",
            }}
          >
            <Paper
              sx={{
                borderRadius: 3,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
                width: "100%",
              }}
            >
              <List sx={{ padding: 0 }}>
                {searchUserResult.map((result, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(0, 255, 255, 0.08)",
                        cursor: "pointer",
                        zIndex: 9999,
                      },
                    }}
                    onClick={() => handleUserClick(result)}
                  >
                    <ListItemText
                      primary={`${result.username} ${result.vorname}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    );
  }

  function InputMessage() {
    return (
      <div>
        <form onSubmit={sendMessage}>
          <div className="input-group">
            <input
              placeholder="Message ..."
              required
              className="form-control"
              type="text"
              name="message"
            />
            <Button variant="contained" type="submit">
              <SendIcon />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // FriendsModal zum akzeptieren von Freundschaftsanfragen
  const FriendsModal = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentPendingRequests, setSentPendingRequests] = useState([]);

    const handleClose = () => setshowFriendModal(false);

    useEffect(() => {
      if (showFriendModal) {
        socket.emit("ask_pending_requests", socket._id);

        // response from server with pending requests
        socket.on("get_pending_requests", (data) => {
          if (data.success) {
            setPendingRequests(data.pendingUsers);
            setSentPendingRequests(data.sentUsers);
          }
        });
      }
      return () => {
        socket.off("get_pending_requests");
      };
    }, []);

    return showFriendModal ? (
      <>
        <Modal
          show={showFriendModal}
          onHide={handleClose}
          className="text-center"
          size="lg"
        >
          <Modal.Body>
          <h3>Freundschaftsanfragen</h3>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Vorname</th>
                  <th>Aktion</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {pendingRequests && pendingRequests.length > 0
                  ? pendingRequests.map((request, index) => (
                      <tr key={index}>
                        <td>{request.username}</td>
                        <td>{request.vorname}</td>
                        <td>
                          <Button
                            className="mr-2"
                            variant="success"
                            onClick={() => {
                              socket.emit("accept_request", request._id);
                              handleClose();
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => {
                              socket.emit("decline_request", request._id);
                              handleClose();
                            }}
                          >
                            Decline
                          </Button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>

            <h3>Gesendete Freundschaftsanfragen</h3>
            <Table striped hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Vorname</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {sentPendingRequests && sentPendingRequests.length > 0
                  ? sentPendingRequests.map((request, index) => (
                      <tr key={index}>
                        <td>{request.username}</td>
                        <td>{request.vorname}</td>
                      </tr>
                    ))
                  : null}
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
    );
  };

  function FriendsList() {
    const [openOnline, setOpenOnline] = useState(true);
    const [openOffline, setOpenOffline] = useState(true);

    return (
      <Box className="UserList" height="100%" overflow="auto">
        <Box
          onClick={() => setOpenOnline(!openOnline)}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "4px",
            borderRadius: "5px",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            cursor: "pointer",
            boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Typography color={"lightgreen"} variant="h6" ml="10px">
            Online
          </Typography>
          <IconButton>
            {openOnline ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>

        {openOnline && (
          <List>
            {onlineFriends.map((user, idx) => {
              return (
                <ListItem key={idx}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      selectUser(user);
                      setUnreadMessagesCount({
                        ...unreadMessagesCount,
                        [user.userID]: 0,
                      });
                    }}
                    sx={{
                      boxShadow: 3,
                      width: "100%",
                      padding: "10px",
                    }}
                  >
                    <Badge
                      badgeContent={unreadMessagesCount[user.userID] || 0}
                      color="error"
                    >
                      {user.vorname}
                    </Badge>
                  </Button>
                </ListItem>
              );
            })}
          </List>
        )}
        <Box
          onClick={() => setOpenOffline(!openOffline)}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "4px",
            borderRadius: "5px",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Typography color={"red"} variant="h6" ml="10px">
            Offline
          </Typography>
          <IconButton>
            {openOffline ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        {openOffline && (
          <List>
            {offlineFriends.map((user, idx) => {
              return (
                <ListItem key={idx}>
                  <Button
                    variant="outlined"
                    onClick={() => selectUser(user)}
                    sx={{
                      boxShadow: 3,
                      width: "100%",
                      padding: "10px",
                      backdropFilter: "blur(15px)",
                      fontWeight: "bold",
                      borderRadius: "15px",
                    }}
                  >
                    {user.vorname}
                  </Button>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    );
  }

  return (
    <Container
      className="HoleChatAppContainer"
      style={{ height: `calc(100vh - 200px)` }}
    >
      <Grid container spacing={2} style={{ height: "95%" }}>
        <Grid
          item
          md={4}
          xs={12}
          style={{
            height: "100%",
            display:
              isMobile && !targetUser ? "block" : !isMobile ? "block" : "none",
          }}
        >
          <Box
            p={2}
            mt={2}
            sx={{
              borderRadius: 5,
              backgroundColor: "rgba(0, 255, 255, 0.08)",
              backdropFilter: "blur(5px)",
              boxShadow: 3,
            }}
          >
            <Search />
            <FriendsModal />
          </Box>
          <Box
            p={3}
            mt={2}
            sx={{
              borderRadius: 5,
              backgroundColor: "rgba(0, 255, 255, 0.08)",
              backdropFilter: "blur(5px)",
              boxShadow: 3,
              height: "100%",
            }}
          >
            <FriendsList />
          </Box>
        </Grid>
        <Grid
          item
          md={8}
          xs={12}
          style={{
            height: "100%",
            display: isMobile && !targetUser ? "none" : "block",
          }}
        >
          <Box
            mt={2}
            sx={{
              borderRadius: 5,
              backgroundColor: targetUser
                ? "transparent"
                : "rgba(0, 255, 255, 0.08)",
              backdropFilter: targetUser ? "none" : "blur(5px)",
              boxShadow: targetUser ? 0 : 3,
              height: "100%",
            }}
          >
            <ChatContainer />
          </Box>
          <Box
            mt={2}
            sx={{
              borderRadius: 5,
              backgroundColor: "rgba(0, 255, 255, 0.08)",
              backdropFilter: "blur(5px)",
              boxShadow: 3,
              padding: !targetUser ? 4 : 2,
            }}
          >
            {targetUser && <InputMessage />}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;





















