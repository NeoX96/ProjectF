import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import images from "./assets/map/index.js";
import "leaflet/dist/leaflet.css";
import "./css/Maps.css";
import axios from "axios";

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
  const [zoom, setZoom] = useState(15);
  const [enableEvent, setEnableEvent] = useState(false);
  const [eventLatLng, setEventLatLng] = useState({ lat: 0, lng: 0 });
  const [showModal, setShowModal] = useState(false);
  const [markerExists, setMarkerExists] = useState(false);
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(100);

  const [events, setEvents] = useState([]);

  function Event() {
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
      console.log(eventLatLng);
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
        name: event.target.eventName.value,
        uhrzeit: event.target.eventTime.value,

        // get SessionID from cookie
      };

      axios
        .post(`${DOMAIN}/createEvent`, data)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(data);
    };

    return (
      <>
        {markerExists && (
          <Marker
            position={[eventLatLng.lat, eventLatLng.lng]}
            icon={GetIcon([30, 40], "marker")}
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
  function LocationMarker() {
    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        setZoom(13);
        map.setView(e.latlng, map.getZoom());
      });
    }, [map]);

    return position === null ? null : (
      <div
        style={{
          position: "absolute",
          zIndex: 999,
          top: "10px",
          right: "10px",
        }}
      >
        <Circle
          center={position}
          radius={radius}
          fillColor={"red"}
          color={"black"}
        >
          <Marker position={position} icon={GetIcon(40, "me")}>
            <Popup>Dein Standort</Popup>
          </Marker>
        </Circle>
        <div>
          <input
            type="range"
            min="1"
            max="10000"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
          <div style={{ color: "black" }}>
            {radius === 0
              ? 0
              : radius === 10000
              ? 15
              : (radius * 0.001 + (radius >= 1 ? 0.1 : 0)).toFixed(1)}{" "}
            Kilometer
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    axios
      .post(`${DOMAIN}/getEvents`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function EventsData() {
    console.log(events);

    if (events.length === 0) {
      return <div></div>;
    }

    return (
      <div>
        {events.map((event) => (
          <Marker
            key={event._id}
            position={{ lat: [event.lat], lng: [event.lng] }}
            icon={GetIcon([30, 40], "marker")}
          ></Marker>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Events erstellen"
        checked={enableEvent}
        onChange={() => setEnableEvent(!enableEvent)}
      />

      <MapContainer
        center={[48.7775, 11.431111]}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker />
        <EventsData />

        {enableEvent === true ? <Event /> : null}
      </MapContainer>
    </div>
  );
}

export default Maps;
