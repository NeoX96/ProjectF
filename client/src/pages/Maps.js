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




 const buttonRemove = '<h1>Erstelle ein Event</h1><form class="cf"><div class="fancy-input"><input type="text" id="input-name" placeholder="Name"></div><div class="fancy-input"><textarea name="message" type="text" id="input-message" placeholder="Message"></textarea></div> <input type="datetime-local" name="geburtsdatum"><div><input type="submit" value="Submit" id="input-submit"><button type="button" class="remove">delte marker 💔</button></form></div> ';


 
 function Event({position, radius}) {
  const [counter, setCounter] = useState(0);
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(buttonRemove)
        .openPopup()
        .setIcon(GetIcon([20, 20], 'basketball'));

      // Check if marker is within the defined radius
      if (L.latLng(position).distanceTo(marker.getLatLng()) <= radius) {
        setCounter(counter + 1);
      }

      // Add event listener to buttonRemove
      const removeBtn = document.querySelector('.remove');
      removeBtn.addEventListener('click', () => {
        marker.remove(); // Von der Karte löschen
        setCounter(counter - 1);
      });
    }
  });

  useEffect(() => {
    console.log('counter changed:', counter);
  }, [counter]);

  return (
    <div style={{ position: 'absolute', zIndex: 999, top: '50px', right: '0px' }}>
      <div style={{ color: 'black' }}> {counter}</div>
    </div>
  );
}

  
  // Standort setzen
  function LocationMarker() {
   
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(100);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      setZoom(13);
      map.setView(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <div style={{ position: 'absolute', zIndex: 999, top: '10px', right: '10px' }}>
      <Circle center={position} radius={radius} fillColor={'red'} color={'black'}>
        <Marker position={position} icon={GetIcon(40, 'me')}>
          <Popup>
            Dein Standort
          </Popup>
        </Marker>
      </Circle>
      <div>
      <input type="range" min="1" max="10000" value={radius} onChange={e => setRadius(e.target.value)} />
      <div style={{ color: 'black' }}>{radius === 0 ? 0 : radius === 10000 ? 15 : ((radius * 0.001) + (radius >= 1 ? 0.1 : 0)).toFixed(1)} Kilometer</div>
    </div>
  </div>
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