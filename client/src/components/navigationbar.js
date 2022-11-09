import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function Navigationbar() {
    const navigate = useNavigate();
    const user = localStorage.getItem("username");

    const logout = () => {
      localStorage.removeItem("username");
        navigate("/");
    };

    // only return if user is on home, chat or maps page
    if (window.location.pathname === "/Home" || window.location.pathname === "/Chat" || window.location.pathname === "/Maps") {

    return (
      <div className="navigationbar">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand onClick={() => navigate("/Home")}>SportConnect</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => navigate("/Home")}>Home</Nav.Link>
                <Nav.Link onClick={() => navigate("/Maps")}>Maps</Nav.Link>
                <Nav.Link onClick={() => navigate("/Chat")}>Chat</Nav.Link>
              </Nav>
              <Nav>
              <NavDropdown title={user} id="collasible-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate("/settings")}>Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
    } else {
        return (
            <div></div>
        );
    }

}