import React, { useState, useEffect, useContext } from "react";
import { Form, Modal } from "react-bootstrap";
import Control from "react-leaflet-custom-control";
import { Button, ToggleButton, Box, Typography } from "@mui/material";


import EventIcon from '@mui/icons-material/Event';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from '@mui/icons-material/Chat';
import AddLocationAltTwoToneIcon from '@mui/icons-material/AddLocationAltTwoTone';



import Cookies from "js-cookie";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import images from "./assets/map/index.js";
import "leaflet/dist/leaflet.css";
import "./css/Maps.css";
import axios from "axios";
import { IndexContext } from "../App";
import { DOMAIN } from "../index";


// Universelle GetIcon Funktion mit Icongröße und Iconname
function GetIcon(_iconSize, _iconName) {
  return L.icon({
    iconUrl: images[_iconName],
    iconSize: _iconSize,
  });
}

function Maps() {
  const [enableEvent, setEnableEvent] = useState(false);
  const [eventLatLng, setEventLatLng] = useState({ lat: 0, lng: 0 });
  const [showModal, setShowModal] = useState(false);
  const [markerExists, setMarkerExists] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
 


  const { index } = useContext(IndexContext);

  console.log("index: " + index);

  /*
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(100);
  */

  const [events, setEvents] = useState([]);
  const sessionID = Cookies.get("sessionID");

  // Funktion zum holen der Events aus der DB
  const getEvents = async () => {
    const res = await axios.post(`${DOMAIN}/getEvents`);
    console.log(res.data);

    if (res.data) {
      setEvents(res.data);
    }
  };

  // Rendert nur einmal, wenn die Seite geladen wird
  useEffect(() => {
    getEvents();
  }, []);

  // Funktion zum erstellen eines Events
  function CreateEvent() {
    // Event erstellen

    useMapEvents({
      click: (e) => {
        setEventLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
        setShowModal(true);
        setMarkerExists(true);
      },
    });

    // Modal schließen
    const handleClose = () => {
      setShowModal(false);
      setMarkerExists(false);
    };

    // Formular abschicken
      const submitForm = (event) => {
        event.preventDefault();
      
        const eventTime = new Date(event.target.elements.eventTime.value);
        const eventName = event.target.elements.eventName.value;
    
      // Check if the event time is more than 1 year in the future
      const now = new Date();
      const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
     
        if (eventTime > oneMonthFromNow) {
          // Create a notification box with the message
          const notificationBox = document.getElementById("notificationBox");
          notificationBox.innerHTML = "<span>&#9432;</span><p>Das Datum liegt zu weit in der Zukunft</p>";
          notificationBox.classList.add("notification-box");
          return;
        }
      
    
      if (eventTime < now) {
        // Create a notification box with the message
        const notificationBox = document.getElementById("notificationBox");
        notificationBox.innerHTML = "<span>&#9432;</span><p>Das Datum liegt in der Vergangenheit</p>";
        notificationBox.classList.add("notification-box");
        return;
      }

      if (!eventName) {
        // Create a notification box with the message
        const notificationBox = document.getElementById("notificationBox");
        notificationBox.innerHTML = "<span>&#9432;</span><p>Bitte geben Sie den Namen der Veranstaltung an</p>";
        notificationBox.classList.add("notification-box");
        return;
      }

      if (!event.target.elements.eventTime.value) {
        // Create a notification box with the message
        const notificationBox = document.getElementById("notificationBox");
        notificationBox.innerHTML = "<span>&#9432;</span><p>Bitte geben Sie das Datum der Veranstaltung an</p>";
        notificationBox.classList.add("notification-box");
        return;
      }

      
    
      

      // Axios Post ans Backend - Event erstellen

      console.log("Formular wurde gesendet!");
      console.log("eventlatlng " + eventLatLng.lat + " " + eventLatLng.lng);
      console.log(
        "Name " +
          event.target.eventName.value +
          ", Uhrzeit " +
          event.target.eventTime.value
      );
      handleClose();

      // Wenn Event erstellt worden ist, dann nochmal Events aus DB holen und in die Map einfügen, da der lokale Marker entfernt wird
      // Eventueller useEffect außerhalb der Funktion, der bei jedem Event erstellen ausgeführt wird

      // Namen des Events aus dem Formular holen
      const data = {
        // sessionID in user dokument.get cookie
        user: sessionID,
        name: event.target.eventName.value,
        uhrzeit: event.target.eventTime.value,
        lat: eventLatLng.lat,
        lng: eventLatLng.lng,
        index: index,
        //equipment: event.target.eventTool.value,

        // get SessionID from cookie
      };

      axios
        .post(`${DOMAIN}/createEvent`, data)
        .then((res) => {
          switch (res.status) {
            case 200:
              alert("Event wurde erstellt!");
              getEvents();
              break;
            case 400:
              alert("Event konnte nicht erstellt werden!");
              break;
            default:
              alert("Fehler beim erstellen des Events!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return (
      <>
        {markerExists && (
          <Marker
            position={[eventLatLng.lat, eventLatLng.lng]}
            icon={
              index === 0
                ? GetIcon([30, 30], "frisbee")
                : index === 1
                ? GetIcon([30, 30], "fussball")
                : index === 2
                ? GetIcon([30, 30], "volleyball")
                : index === 3
                ? GetIcon([30, 30], "basketball")
                : index === 4
                ? GetIcon([50, 50], "tischtennis")
                : index === 5
                ? GetIcon([30, 40], "skateboard")
                : GetIcon([30, 40], "marker")
            }
          />
        )}

        <Modal
          size="lg"
          show={showModal}
          onHide={handleClose}
          centered
          dialogClassName="modal-90w"
          style={{ color: "black" }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Events erstellen</Modal.Title>
          </Modal.Header>
          <Form onSubmit={submitForm}>
            <Modal.Body>
              <Form.Group controlId="eventName" className="mb-3">
                <Form.Label>Event Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Geben Sie den Namen des Events ein"
                />
              </Form.Group>
              <Form.Group controlId="eventTime" className="mb-3">
                <Form.Label>Uhrzeit:</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="Geben Sie die Uhrzeit des Events ein"
                />
                <div id="notificationBox"></div>
              </Form.Group>
              <Form.Group
                controlId="eventTool"
                className="justify-content-center d-flex"
              >
                <Form.Check
                  type="checkbox"
                  label="Sportgerät"
                  id="eventToolJa"
                  className=""
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
  
  



  // Standort setzen
  function UserPostionMarker() {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
      map.locate();
      map.on("locationfound", (e) => {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });

      return () => {
        map.off("locationfound");
      };
    }, [map]);

    if (position === null) {
      return null;
    }

    return (
      <Marker icon={GetIcon(40, "me")} position={position}>
        <Popup>
          <span>Dein Standort</span>
        </Popup>
      </Marker>
    );
  }

  // Events auf Map anzeigen
  function SetEventsMap() {
    // State variables to control visibility and content of the info box
    const [infoBoxVisible, setInfoBoxVisible] = useState(false);
    const [eventJoined, setEventJoined] = useState(false);
    const [eventLeft, setEventLeft] = useState(false);
  


    if (events.length === 0) {
      console.log("Keine Events vorhanden");
      return <div></div>;
    }
  
    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
  
    function formatTime(dateString) {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  
    function showInfo() {
      setInfoBoxVisible(prevState => !prevState);
    }
  
    function joinEvent(event) {
      
      console.log(event.teilnehmer);
  ///////////////////////////////////////////////// aktuellenUser = usertest
      if (event.user === event.teilnehmer) {
        alert("Sie können nicht beitreten, da Sie diese Veranstaltung selbst erstellt haben.");
        console.log(sessionID);
        return;
      }
    
      const data = {
        user: sessionID,
        eventID: event._id,
      };
    
      axios
        .post(`${DOMAIN}/joinEvent`, data)
        .then((res) => {
          setEventJoined(true);

        })
        .catch((err) => {
          switch (err.response.status) {
            case 403:
              alert("Nutzer nicht gefunden");
              break;

            case 404:
              alert("Event nicht gefunden");
              break;
  
            case 405:
              alert("Bei Event bereits beigetreten");
              break;
  
            case 500:
              alert("Serverfehler");
              break;
  
            default:
              alert("Unbekannter Fehler");
              break;
          }
        });
    }


    ////////////////////////////////////////////////////////////////////////////
    
    async function leaveEvent(event) {
      console.log("leaveEvent:", event._id);
      try {
        const response = await axios.delete(`${DOMAIN}/events/${event._id}/${event.userId}`);
        if (response.status === 200) {
          setEventLeft(true);
          alert("Event verlassen");
        } else {
          throw new Error('Failed to delete object');
        }
      } catch (error) {
        console.error(error);
      }
    }


    function sendFriendRequest (event) {

      const data = {
        user: sessionID,
        eventID: event._id,
      };
    
      axios
        .post(`${DOMAIN}/sendFriendRequest`, data)
        .then((res) => {
          alert("Freundschaftsanfrage gesendet");

        })
        .catch((err) => {
          switch (err.response.status) {
            case 403:
              alert("Nutzer nicht gefunden");
              break;

            case 404:
              alert("Event nicht gefunden");
              break;

            case 405:
              alert("Du kannst dir nicht selbst eine Freundschaftsanfrage senden");
              break;

            case 406:
              alert("Du bist bereits mit diesem Nutzer befreundet");
              break;

            case 407:
              alert("Du hast bereits eine Freundschaftsanfrage an diesen Nutzer gesendet");
              break;

            case 500:
              alert("Serverfehler");
              break;

            default:
              alert("Unbekannter Fehler");
              break;
            }
        });

    }




    return (
      <div>
        {events.map((event) => (
          <Marker
            key={event._id}
            position={{ lat: [event.lat], lng: [event.lng] }}
            icon={
              event.index === 0
                ? GetIcon([30, 30], "frisbee")
                : event.index === 1
                ? GetIcon([30, 30], "fussball")
                : event.index === 2
                ? GetIcon([30, 30], "volleyball")
                : event.index === 3
                ? GetIcon([30, 30], "basketball")
                : event.index === 4
                ? GetIcon([50, 50], "tischtennis")
                : event.index === 5
                ? GetIcon([30, 40], "skateboard")
                : GetIcon([30, 40], "marker")
            }
           
          >
            <Popup>
              <div className="event-info-container">
                <p className="event-name blue-bg">
                  <strong className="name">{event.name}</strong>
                  <span
                    className="info-button"
                    onClick={() => showInfo(event)}
                  >
                    i
                  </span>
                </p>
                {console.log(event.usernames)}
                {/* Render the info box if it is visible */}
                {infoBoxVisible && (
                  <div>
                    <div className="popup-content"><strong>Organisator:</strong> {event.owner}</div>
                    <div><strong>Teilnehmer:</strong></div>
                    <Box sx={{ maxHeight: 50, overflow: 'auto' }}>
                      <div>
                        <ul sx={{ margin: 0, padding: 0 }}>
                          {event.usernames.map((username) => (
                            <li key={username}>{username}</li>
                          ))}
                        </ul>
                      </div>
                    </Box>
                  </div>
                )}

    
                <p className="event--datum">
                  <strong>Datum:</strong> {formatDate(event.uhrzeit)}
                </p>
                <p className="event--uhrzeit">
                  <strong>Uhrzeit:</strong> {formatTime(event.uhrzeit)}
                </p>
                <p className="event-equipment">
                  {event.equipment ? (
                    <>
                      <strong>Sportgerät:</strong> ✓
                    </>
                  ) : (
                    <>
                      <strong>Sportgerät:</strong> ✘
                    </>
                  )}
                </p>
    
                <div className="button-container">
                <Button
                className={`play-button ${eventJoined && !eventLeft ? "bg-danger" : ""}`}
                onClick={eventJoined && !eventLeft ? () => leaveEvent(event) : () => joinEvent(event)}
                id={`event-${event._id}-button`}
                endIcon={<AddIcon />}
              >
                {eventJoined && !eventLeft ? "Verlassen" : "Mitspielen"}
              </Button>

                  <Button className="chat-button" onClick={() => sendFriendRequest(event)} endIcon={<ChatIcon />}>Chat</Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </div>
    );
  }


  function handleDeleteEvent(eventId) {
    // Senden einer DELETE-Anforderung an die API-Endpunkt-URL mit dem Ereignis-ID-Parameter
    axios.delete(`${DOMAIN}/events/${eventId}`)
      .then(() => {
        // Wenn die Anforderung erfolgreich ist, aktualisieren Sie den Zustand des Ereignisarrays
        const updatedEvents = events.filter(event => event._id !== eventId);
        setEvents(updatedEvents);
      })
      .catch((error) => {
        // Wenn ein Fehler auftritt, loggen Sie den Fehler oder geben Sie eine Fehlermeldung aus
        console.error(error);
        alert('Beim Löschen des Ereignisses ist ein Fehler aufgetreten.');
      });
  }

/////////////////////////////////////////////////////// map definieren
 
function getParticipatingEvents(eventID, eventlat, eventlng) {
  

  Maps.setView([eventlat, eventlng], 15);
  console.log(`Event lat: ${eventlat}, lng: ${eventlng}`);
}


  function ShowEventsData() {

    return (
      <Box
      >
  <Typography variant="h4">Creating Events</Typography>
  
  {events.map((event) => (
    <Box key={event._id}
      sx={{ 
        m: 2,
        p: 0.5,
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: 1,
        borderRadius: 3
      }}
    >
      <Typography>{event.name}</Typography>
      <Button color="error" aria-label="delete" onClick={() => {
        console.log(event._id);
        handleDeleteEvent(event._id);
      }}>
        <DeleteForeverIcon />
      </Button>
    </Box>
  ))}

  <Typography variant="h4">Events I'm Participating In</Typography>


  {events.map((event) => (
    <Box key={event._id}
      sx={{ 
        m: 2,
        p: 0.5,
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 3
      }}
    >
      <Typography>{event.name}</Typography>
      <Button color="error" aria-label="delete" onClick={() => {
        console.log(event._id);
        getParticipatingEvents(event._id, event.lat, event.lng);
      }}>
        <LocationSearchingIcon />
      </Button>
    </Box>
  ))}
</Box>
    )
  }

                 
  

  return (
    <div>
      <MapContainer
        center={[48.7775, 11.431111]}
        zoom={14}
        minZoom={10}
        scrollWheelZoom
        attributionControl={false}
        style={{ height: "100vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Control>
          <UserPostionMarker />
          <SetEventsMap />
          {enableEvent === true ? <CreateEvent /> : null}
        </Control>

        <Control prepend position="bottomright">
            <ToggleButton
              value="check"
              selected={enableEvent}
              onChange={() => setEnableEvent(!enableEvent)}
              selectedColor="red"
              sx={{ color: "white", bgcolor: "primary.main", mb: 10, mr: 3, borderRadius: 10, boxShadow: 5}}
            >
              <AddLocationAltTwoToneIcon />
            </ToggleButton>
        </Control>

        <Control prepend position="topleft">
            <Button
              value="check"
              onClick={() => setShowEvents(!showEvents)}
              sx={{ color: "white", bgcolor: "primary.main", borderRadius: 10, boxShadow: 5}}
            >
              <EventIcon/>
            </Button>
          {showEvents === true ? <ShowEventsData /> : null}
        </Control>
  
        
      </MapContainer>
    </div>
  );
}

export default Maps