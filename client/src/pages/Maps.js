import React, {useState, useEffect} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents} from "react-leaflet";
import L from 'leaflet';
import images from './assets/map/index.js';
import Form from 'react-bootstrap/Form';

import 'leaflet/dist/leaflet.css';
import "./css/Maps.css";


// Universelle GetIcon Funktion mit Icongröße und Iconname
function GetIcon(_iconSize, _iconName) {
  return L.icon({
    iconUrl: images[_iconName],
    iconSize: _iconSize
  });
}


function Maps() {
  const [zoom, setZoom] = useState(15);

  // Event erstellen Toggle
  const [enableEvent, setEnableEvent] = useState(false);


  //Clickevent setzen 
  function Event() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        L.marker([lat, lng]).addTo(map)
          .bindPopup('Event erstellt')
          .openPopup()
          .setIcon(GetIcon([20, 30], 'marker'));
      }
    });
    return null;
  }

  // Standort setzen
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        setZoom(13);
        map.setView(e.latlng, map.getZoom());
      });
    }, [map]);

    return position === null ? null : (
      <Circle center={position} radius={100} fillColor={'green'} color={'black'}>
        <Marker position={position} icon={GetIcon(40, 'me')}>
          <Popup>
            Dein Standort
          </Popup>
        </Marker>
      </Circle>
      
    );
  }

  


    return (
      <div>
        <Form.Check 
          type="switch"
          id="custom-switch"
          label="Events erstellen"
          checked={enableEvent} onChange={() => setEnableEvent(!enableEvent)}
        />

        <MapContainer 
          center={[48.777500, 11.431111]}
          zoom={zoom}
          scrollWheelZoom
          style={{ height: "100vh" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <LocationMarker />
          {enableEvent === true? <Event /> : null}
        </MapContainer>
      </div>
    );
}
 
 
export default Maps;