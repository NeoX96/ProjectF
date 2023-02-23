import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/navigationbar';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Maps = lazy(() => import('./pages/Maps'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/settings'));
const Wait = lazy(() => import('./components/wait'));
const Forgotpw = lazy(() => import('./pages/Forgotpw'));
const Landing = lazy(() => import('./pages/Landing'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Prüfen, ob der sessionID-Cookie gesetzt ist
  useEffect(() => {
    const sessionID = getCookie('sessionID');
    if (sessionID && !isLoggedIn) {
      axios.post('http://localhost:4000/validateSession', { sessionID })
        .then(response => {
          const isValidSession = response.data.isValid;

          if (isValidSession) {
            setIsLoggedIn(true);
          }
        })
        .catch(error => {
          console.error(error);
          document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setIsLoggedIn(false);
        });
    }
  }, [isLoggedIn]);

  // Hilfsfunktion zum Auslesen von Cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // bei jedem Render-Vorgang prüfen, ob der sessionID-Cookie gesetzt ist
  const cookie = getCookie('sessionID')

  // when cookie is removed and the user changes with useNavigate to another page isloggedin is still true
  useEffect(() => {
    if (!cookie && isLoggedIn) {
      setIsLoggedIn(false);     // HERE IS THE PROBLEM
    }
  }, [cookie, isLoggedIn]);

  // useEffect(() => {


  return (
    <div className="App">
      <Router>
        {isLoggedIn && <Navbar />}
        <Suspense fallback={<Wait />}>
          <Routes>
            {!isLoggedIn && (
              <>
                <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/Register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/Landing" element={<Landing setIsLoggedIn={setIsLoggedIn} />} />
              </>
            )}
            {isLoggedIn ? (
              <>
                <Route path="/Home" element={<Home />} />
                <Route path="/Chat" element={<Chat />} />
                <Route path="/Maps" element={<Maps />} />
                <Route path="/Settings" element={<Settings />} />
                <Route
                  path="*"
                  element={<Navigate to="/Home" />}
                />
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
