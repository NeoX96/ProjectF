import React, { Suspense, lazy, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navigationbar';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Maps = lazy(() => import('./pages/Maps'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/settings'));
const Wait = lazy(() => import('./components/wait'));
const Forgotpw = lazy(() => import('./pages/Forgotpw'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Prüfen, ob der sessionID-Cookie gesetzt ist
  useEffect(() => {
    const sessionID = getCookie('sessionID');
    if (sessionID) {
      setIsLoggedIn(true);
    }
  }, []);

  // Hilfsfunktion zum Auslesen von Cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Navbar />}
        <Suspense fallback={<Wait />}>
          <Routes>
            <Route path="/" element={<Navigate to="/Login" />} />
            <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/Register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            {isLoggedIn ? (
              <>
                <Route path="/Home" element={<Home />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/Maps" element={<Maps />} />
                <Route path="/Settings" element={<Settings />} />
              </>
            ) : (
              <Route
                path="*"
                element={<Navigate to="/Login" />}
              />
            )}
            <Route path="/Forgotpw" element={<Forgotpw />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
