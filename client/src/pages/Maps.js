import React from "react";
import { Marker, Popup, TileLayer, MapContainer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGeolocated } from "react-geolocated";
import images from './assets/map/index.js';

function GetIcon(_iconSize) {
  return L.icon({
    iconUrl: images.me,
    iconSize: _iconSize
  });
}

function Maps() {


  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });


    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>
            Geolocation is not enabled</div>
    ) : coords ? (
      <div>

          


        <div id="map" className="vh-100">
          <MapContainer center={[coords.latitude, coords.longitude]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.latitude, coords.longitude]} icon={GetIcon(40)}>
              
              <Popup>
                <div>
                    <h3>Deine Position</h3>
                    <p>Latitude: {coords.latitude}</p>
                    <p>Longitude: {coords.longitude}</p>
                </div>
              </Popup>
              
            </Marker>
          </MapContainer>
        </div>

      </div>


    ) : (
        <div>GPS-Daten werden jetzt upgerufen&hellip; </div>
    );
}

export default Maps;