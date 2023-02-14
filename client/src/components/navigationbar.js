import React from "react";
import { Nav, NavItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faMap, faComment } from '@fortawesome/free-solid-svg-icons'
import "../pages/css/Navbar.css";
import { useNavigate } from "react-router-dom";


export default function Navigationbar() {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/Home', icon: faHome },
    { name: 'Map', path: '/Maps', icon: faMap },
    { name: 'Chat', path: '/Chat', icon: faComment }
  ];

  return (
    <Nav className="navbar">
      {navLinks.map((link) => (
        <NavItem key={link.path} className="nav-item navlink">
          <Nav.Link onClick={() => navigate(link.path)} className="nav-link active">
            <div className="icon-container">
              <FontAwesomeIcon className="icon" icon={link.icon} />
            </div>
            {link.name}
          </Nav.Link>
        </NavItem>
      ))}
    </Nav>
  );
}
