import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
};

function EditCollection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(async () => {
    if (Cookies.get("role") !== "Admin" && Cookies.get("role") !== "Seller") {
      navigate("/login");
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/collections/${id}`
      );

      setCollection(response.data);
      setName(response.data.name);
      setPrice(response.data.price);
      setLoaded(true);

      if (response.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [name, setName] = useState(collection.name);
  const [error, setError] = useState(false);
  const [price, setPrice] = useState(collection.price);
  console.log(collection);
  console.log(name);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSubmit = async () => {
    // Perform authentication logic here using 'username' and 'password'
    try {
      const response = await axios.put(
        "http://localhost:8080/api/collections/" + id,
        {
          name: name,
          price: price,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 200) {
        navigate("/collections/" + id);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    }
    // Add your authentication logic here (e.g., API call, validation)
  };
  if (!loaded) {
    return null;
  }
  return (
    <>
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={12} className="App-header">
              {error && (
                <label style={{ color: "red" }}>Incorrect details</label>
              )}
              <br />
              <label>
                Name:
                <br />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </label>
              <label style={{ marginTop: "10px" }}>
                Price:
                <br />
                <input
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  required
                />
              </label>
              <Button
                style={{ backgroundColor: "#2274a5", marginTop: "10px" }}
                variant="contained"
                onClick={() => handleSubmit()}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
      \
    </>
  );
}

export default EditCollection;
