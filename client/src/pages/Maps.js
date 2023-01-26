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



 
  //Clickevent setzen 

  function Event() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const marker= L.marker([lat, lng]).addTo(map)
        .bindPopup(buttonRemove)
        .openPopup()
        .setIcon(GetIcon([20, 20], 'basketball'));

          // Add event listener to buttonRemove
        const removeBtn = document.querySelector('.remove');
        removeBtn.addEventListener('click', () => {
          marker.remove(); // Von der Karte löschen
        });
          
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
      <div>
          <Circle center={position} radius={100} fillColor={'red'} color={'black'}>
              <Marker position={position} icon={GetIcon(40, 'me')}>
                  <Popup>
                      Dein Standort
                  </Popup>
              </Marker>
          </Circle>
          <div><button onClick>&#x1F575;</button></div>
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
       <div><button onClick>&#x1F575;</button></div>

      
          

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