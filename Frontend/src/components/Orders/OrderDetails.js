import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Cookies from "js-cookie";
import { FaTrash } from "react-icons/fa";

function OrderDetails() {
  const renderEdit = Cookies.get("role") === "Admin" || Cookies.get("role") === "User";
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [order, setOrder] = useState({});
  useEffect(async () => {
    if (!renderEdit) {
        navigate('/login')
    }
    try {
      const response = await axios.get(
        "http://localhost:8080/api/orders/" + id,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 200) {
        setOrder(response.data);
        setLoaded(true);
      }
      if (response.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  if (!loaded) return <CircularProgress />;

  const handleDelete = async (collectionId) => {
    try {
      const response = await axios.delete(
        "http://localhost:8080/api/orders/" +
          id +
          "/collections/" +
          collectionId,
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
      window.location.reload(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container fluid className="home-section">
      <Container className="home-content">
        <h1 className="heading-name">Order</h1>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <Card className="project-card-view">
              <CardContent>
                <Typography variant="h5" component="div">
                  {order.name}
                </Typography>
                <Typography variant="body2">
                  Order Date:{" "}
                  {moment(order.date).format("MMMM Do YYYY, h:mm:ss")}
                </Typography>
                <Typography variant="body2">
                  Price: {order.totalcost}
                </Typography>
              </CardContent>
            </Card>
          </Col>
          <Col md={3}></Col>
        </Row>
        <br />
        <h1 className="heading-name">Order Collections</h1>
        {order.collections.map((item) => (
          <Row style={{ marginTop: "10px" }}>
            <Col md={3}></Col>
            <Col md={6}>
              <Stack gap={2}>
                <Button
                  style={{ backgroundColor: "#2274a5" }}
                  variant="contained"
                  onClick={() => navigate(`/collections/${item.id}`)}
                  key={item.id}
                >{`${item.name} - ${item.price}`}</Button>
              </Stack>
            </Col>
            <Col md={3}>
              {renderEdit && (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-button"
                >
                  <FaTrash />
                </button>
              )}
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
}

export default OrderDetails;
