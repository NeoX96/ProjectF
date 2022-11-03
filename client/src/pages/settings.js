import React from "react";
import Navigationbar from "./navigationbar";
import { useGeolocated } from "react-geolocated";



const Demo = () => {
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
            <Navigationbar />
            Geolocation is not enabled</div>
    ) : coords ? (
        <table>
            <tbody>
            
                <tr>
                    <td>latitude</td>
                    <td>{coords.latitude}</td>
                </tr>
                <tr>
                    <td>longitude</td>
                    <td>{coords.longitude}</td>
                </tr>
                
                
            </tbody>
        </table>
    ) : (
        <div>GPS-Daten werden jetzt upgerufen&hellip; </div>
    );
    
};

export default Demo;
