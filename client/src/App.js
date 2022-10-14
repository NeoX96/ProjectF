import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter as Router, Route, Routes, Container, Col , Row  } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Maps from "./pages/Maps";
import Login from "./pages/Login";
import Settings from "./pages/settings";
import Wait from "./pages/wait";
import Forgotpw from "./pages/Forgotpw";



function App() {
    
  return (
    <div className="App">
    <Router>
      
        <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Maps" element={<Maps />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Wait" element={<Wait />} />
            <Route path="/Forgotpw" element={<Forgotpw />} />
            
        </Routes>
    </Router>

    </div>
  );
}

export default App;



