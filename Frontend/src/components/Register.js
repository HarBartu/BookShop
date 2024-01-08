import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

function Register() {
  Cookies.set("isLoggedIn", false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleUsernameChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async () => {
    // Perform authentication logic here using 'username' and 'password'
    try {
      const response = await axios.post(
        "http://localhost:8080/api/session/register",
        {
          email: email,
          name: name,
          role: role,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 201) {
        navigate("/login");
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    }
    // Add your authentication logic here (e.g., API call, validation)
  };
  return (
    <Container fluid className="home-section" id="home">
      <Container className="home-content">
        <Row>
          <Col md={12} className="App-header">
            {error && (
              <label style={{ color: "red" }}>Incorrect credentials</label>
            )}
            <br />
            <label>
              Email:
              <br />
              <input
                type="text"
                value={email}
                onChange={handleUsernameChange}
                required
              />
            </label>
            <label style={{ marginTop: "10px" }}>
              Name:
              <br />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                required
              />
            </label>
            <label>
              Role:
              <br />
              <input
                type="text"
                value={role}
                onChange={handleRoleChange}
                required
              />
            </label>
            <label style={{ marginTop: "10px" }}>
              Password:
              <br />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <Button
              style={{ backgroundColor: "#2274a5", marginTop: "10px" }}
              variant="contained"
              onClick={() => handleSubmit()}
            >
              Register
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Register;
