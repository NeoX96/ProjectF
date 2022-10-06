import React from "react";
import { useNavigate } from "react-router-dom";


// Create the function
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement('script');
  script.src = urlOfTheLibrary;
  script.async = true;
  document.body.appendChild(script);
}


function Maps() {
  const navigate = useNavigate();

  return (
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

        {AddLibrary('http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js')}



  



    </div>
  );
}

export default Maps;