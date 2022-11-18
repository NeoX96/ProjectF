import React, {useState, useEffect} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMap,Circle } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import images from './assets/map/index.js';
import 'leaflet/dist/leaflet.css';







 
function GetIcon(_iconSize) {
  return L.icon({
    iconUrl: images.me,
    iconSize: _iconSize
  });
}


function Maps() {

  
   

 
 
  const [zoom, setZoom] = useState(15);
 
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
        <Marker position={position} icon={GetIcon(40)}>
        <Popup>
          Dein Standort
        </Popup>
        
      </Marker>
      </Circle>
      
    );
  }
 
 
  return (

    
    <MapContainer 
    

    
      center={[48.777500, 11.431111]}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100vh" }}
    >
  <body background color="green">

<nav >
   <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">Über uns</a></li>
      <li><a href="#">Leistungen</a></li>
      <li><a href="#">FAQ</a></li>
      <li><a href="#">Kontakt</a></li>
  </ul>
</nav>

</body>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker>
         
        </LocationMarker>

   
    </MapContainer>
  );
}
 
 
export default Maps;