import React, {useState, useEffect} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMap,Circle,useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L, { latLng } from 'leaflet';
import images from './assets/map/index.js';
import 'leaflet/dist/leaflet.css';
import "./css/Maps.css";




// Icon für Standort  
function GetIcon(_iconSize) {
  return L.icon({
    iconUrl: images.me,
    iconSize: _iconSize
  });
}


function Maps() {
 const [zoom, setZoom] = useState(15);

//Clickevent setzen 
 function Event() {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      L.marker([lat, lng], {GetIcon}).addTo(map)

    }
  });
  return null;
}

 
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


</body>
<ul>
  <li><a href="Home?">Home</a></li>
  <li><a href="news.asp">Einstellung</a></li>
  <li><a href="chat">Chat</a></li>
  <li><a href="about.asp">About</a></li>
</ul> 
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <button></button>
      
      <LocationMarker></LocationMarker>
      <Event></Event>
      
       
  
   
    </MapContainer>
  );
}
 
 
export default Maps;