import React, { Suspense, lazy, useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/navigationbar';
import Logout from './components/logout'; 
import { DOMAIN } from "./index";

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Maps = lazy(() => import('./pages/Maps'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/settings'));
const Wait = lazy(() => import('./components/wait'));
const Forgotpw = lazy(() => import('./pages/Forgotpw'));
const Landing = lazy(() => import('./pages/Landing'));
const Verify = lazy(() => import('./pages/Verify'));

export const IndexContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [index, setIndex] = useState(0);

  // Prüfen, ob der sessionID-Cookie gesetzt ist
  useEffect(() => {
    const sessionID = getCookie('sessionID');
    if (sessionID && !isLoggedIn) {
      axios.post(`${DOMAIN}/validateSession`, { sessionID })
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
      <IndexContext.Provider value={{index, setIndex}}>
      <Router>
        {isLoggedIn && <> <Navbar />  <Logout /> </>}
        <Suspense fallback={<Wait />}>
          
          <Routes>
            {!isLoggedIn && (
              <>
                <Route path="/Login" element={<Login /> } />
                <Route path="/Register" element={<Register  />} />
                <Route path="/" element={<Landing  />} />
                <Route path="/Verify" element={<Verify />} />
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
                element={<Navigate to="/" />}
              />
            )}
            <Route path="/Forgotpw" element={<Forgotpw />} />
          </Routes>
        </Suspense>
      </Router>
      </IndexContext.Provider>
    </div>
  );
  }

export default App;
