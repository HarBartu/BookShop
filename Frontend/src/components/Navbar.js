import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/logo.png";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { CgLogOut, CgShoppingBag } from "react-icons/cg";

import { FaBook } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import Cookies from "js-cookie";

function NavBar() {
  const [expand, updateExpanded] = useState(false);

  return (
    <Navbar expanded={expand} fixed="top" expand="md" className={"sticky"}>
      <Container>
        <Navbar.Brand href="/" className="d-flex">
          <img src={logo} className="img-fluid logo" alt="brand" />
          <span className="font-link">BookShop</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/collections"
                onClick={() => updateExpanded(false)}
              >
                <SiBookstack style={{ marginBottom: "2px" }} /> Collections
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/orders"
                onClick={() => updateExpanded(false)}
              >
                <CgShoppingBag style={{ marginBottom: "2px" }} /> Orders
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="fork-btn">
              <Button
                as={Link}
                to="/login"
                onClick={() => {
                  updateExpanded(false);
                  Cookies.set("isLoggedIn", false);
                }}
                
                className="fork-btn-inner"
              >
                <CgLogOut  style={{ fontSize: "1.2em" }}/>
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
