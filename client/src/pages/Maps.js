import React from "react";
import { useNavigate } from "react-router-dom";
import './css/Chat.css';
// Leaflet-React Import
import { Marker, Popup, TileLayer, MapContainer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function Maps() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h1> Maps </h1>
        <button
            onClick={() => {navigate("/Home");}}>Home
        </button>

        <button
            onClick={() => {navigate("/Chat");}}>Chat
        </button>

        <button
            onClick={() => {navigate("/Login");}}>Logout
        </button>
      </div>

        <div id="map">
          <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: "50vh", width: "100vh"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

    </div>
  );
}

export default Maps;