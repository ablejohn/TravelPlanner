// NavBar.jsx
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import logo from "../assets/getCode.avif"; // Adjust path if necessary

function NavBar() {
  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} alt="Plan Now Logo" className="navbar-logo" />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/popular-destinations">
              <Nav.Link>Popular Destinations</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
