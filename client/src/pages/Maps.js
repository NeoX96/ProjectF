import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
 // Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import images from "./assets/map/index.js";
import "leaflet/dist/leaflet.css";
import "./css/Maps.css";
import axios from "axios";
import {IndexContext} from "../App";

import { DOMAIN } from "../index";

/*
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
*/

/*
const MAP_STYLES = [
  { name: "Standard", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
  { name: "Schwarz-Weiß", url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" },
  { name: "Grau", url: "https://tiles.wmflabs.org/bw-mapnik-landuse/{z}/{x}/{y}.png" },
  { name: "Wasserfarben", url: "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png" },
];
*/
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
  


  const vorname = Cookies.get("vorname");
  const {index} = useContext(IndexContext);
  

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
        vorname: vorname,
        //equipment: event.target.eventTool.value,

        // get SessionID from cookie
      };

      axios
        .post(`${DOMAIN}/createEvent`, data)
        .then((res) => {
        
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
              <Button variant="primary" type="submit">
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
    if (events.length === 0) {
      console.log("Keine Events vorhanden");
      return <div></div>;
    }
     

    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
    function showInfo(event) {
      const popupContent = event.target.closest('.leaflet-popup-content');
      const createdBy = popupContent.querySelector('.created-by');
      createdBy.insertAdjacentHTML('beforeend', `<p>Vorname: ${event.vorname}</p>`);
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
            <Popup onOpen={() => showInfo(event)}>
            <div class="event-info-container">
              <p class="event-name blue-bg">
                <strong class="name">{event.name}</strong>
                <span class="info-button">i</span>
              </p>
              <p class="event--datum">Datum: {formatDate(event.uhrzeit)}</p>
              <p class="event-equipment">
                {event.equipment ? "Sportgerät ✓" : "Kein Sportgerät ✘"}
              </p>
              <div class="button-container">
                <button class="play-button" onclick="joinEvent()">+ Mitspielen</button>
                <button class="chat-button" onclick="joinEvent()">+ Chat</button>
              </div>
            </div>
          </Popup>

          </Marker>
        ))}
      </div>
    );
  }

  return (
    <div >
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Events erstellen"
        checked={enableEvent}
        onChange={() => setEnableEvent(!enableEvent)}
      />

      <MapContainer
        center={[48.7775, 11.431111]}
        zoom={14}
        minZoom={10}
        scrollWheelZoom
        style={{ height: "100vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <UserPostionMarker />
        <SetEventsMap />


        {enableEvent === true ? <CreateEvent /> : null}
      </MapContainer>
    </div>
  );
}

export default Maps;