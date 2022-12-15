import React, { Suspense, lazy} from 'react';
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



