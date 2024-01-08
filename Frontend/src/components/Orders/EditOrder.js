import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import moment from "moment";

const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
};

function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [order, setOrder] = useState({});

  useEffect(async () => {
    if (Cookies.get("role") !== "Admin") {
      navigate("/login");
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/orders/` + id,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 401) {
        navigate("/login");
      }

      setOrder(response.data);

      setDate(response.data.date);
      setTotalCost(response.data.totalcost);
      setLoaded(true);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [date, setDate] = useState(order.date);
  const [error, setError] = useState(false);
  const [totalCost, setTotalCost] = useState(order.totalcost);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handletotalCostChange = (event) => {
    setTotalCost(event.target.value);
  };

  const handleSubmit = async () => {
    // Perform authentication logic here using 'username' and 'password'
    try {
      const response = await axios.put(
        "http://localhost:8080/api/orders/" + id,
        {
          date: date,
          totalCost: totalCost,
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
        navigate("/orders");
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

  console.log(date)
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
                Date:
                <br />
                <input
                  type="date"
                  value={moment(date).format("YYYY-MM-DD")}
                  onChange={handleDateChange}
                  required
                />
              </label>
              <label style={{ marginTop: "10px" }}>
                Total Cost:
                <br />
                <input
                  type="number"
                  value={totalCost}
                  onChange={handletotalCostChange}
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
    </>
  );
}

export default EditOrder;
