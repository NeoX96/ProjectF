import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Maps from "./pages/Maps";
import Login from "./pages/Login";
import SignUp from "./pages/signup";
import Settings from "./pages/settings";
import Wait from "./pages/wait";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const handleDragStart = (e) => e.preventDefault();

const items = [
  <img src="./assets/index" onDragStart={handleDragStart} role="presentation" />,
  <img src="./assets/index" onDragStart={handleDragStart} role="presentation" />,
  <img src="./assets/index" onDragStart={handleDragStart} role="presentation" />,
];

const Gallery = () => {
  return (
    <AliceCarousel mouseTracking items={items} />
  );
}

function App() {
    
  return (
    <div className="App">
    <Router>
      
        <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Maps" element={<Maps />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Wait" element={<Wait />} />
            
        </Routes>
    </Router>

    </div>
  );
}

export default App;



