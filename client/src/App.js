import React, { Suspense, lazy, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navbar from './components/navigationbar';


const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Maps = lazy(() => import('./pages/Maps'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/settings'));
const Wait = lazy(() => import('./components/wait'));
const Forgotpw = lazy(() => import('./pages/Forgotpw'));



function App() {

    useEffect(() => {
      window.addEventListener('resize', updateBackground);
      return () => window.removeEventListener('resize', updateBackground);
    }, []);
  
    function updateBackground() {
      document.body.style.background = 'linear-gradient(180.2deg, rgb(30, 33, 48) 6.8%, rgb(74, 98, 110) 131%)';
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.height = '100vh';
    }
    
  return (
    <div className="App">
    <Router>
      <Navbar />
        <Suspense fallback={<Wait/>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Maps" element={<Maps />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Forgotpw" element={<Forgotpw />} />
          </Routes>
        </Suspense>
    </Router>

    </div>
  );
}

export default App;



