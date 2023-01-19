import React from "react";
import { Nav, NavItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faMap, faComment } from '@fortawesome/free-solid-svg-icons'
import "../pages/css/Navbar.css";
import { useNavigate } from "react-router-dom";


export default function Navigationbar() {
    const navigate = useNavigate();
    // const user = localStorage.getItem("sessionID");

    /* const logout = () => {
      localStorage.removeItem("sessionID");
        navigate("/");
    }; */

    // only return if user is on home, chat or maps page
    if (window.location.pathname === "/Home" || window.location.pathname === "/Chat" || window.location.pathname === "/Maps" || window.location.pathname === "/settings") {

    return (
      <div>

        <Nav  className="navbar">
          <NavItem className="nav-item navlink">
            <Nav.Link onClick={() => navigate("/Home")} className="nav-link active">
              <div className="icon-container">
                <FontAwesomeIcon className="icon" icon={faHome} />
              </div>
              Home
            </Nav.Link>
          </NavItem>
          <NavItem className="nav-item navlink">
            <Nav.Link onClick={() => navigate("/Maps")} className="nav-link active">
            <div className="icon-container">
              <FontAwesomeIcon className="icon" icon={faMap} />
            </div>
              Map
            </Nav.Link>
          </NavItem>
          <NavItem className="nav-item navlink">
            <Nav.Link onClick={() => navigate("/Chat")} className="nav-link active">
            <div className="icon-container">
            <FontAwesomeIcon className="icon" icon={faComment} />
              </div>
              Chat
            </Nav.Link>
          </NavItem>
        </Nav>
      </div>
    );
    } else {
        return (
            <div></div>
        );
    }

}