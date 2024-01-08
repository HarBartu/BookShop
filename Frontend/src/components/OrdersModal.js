import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import moment from "moment";
import axios from "axios";

const OrdersModal = ({ isOpen, onClose, onConfirm }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders", {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      });

      if (response.status === 200) {
        setOrders(response.data);
      }
      if (response.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className={`confirm-delete-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h1 className="heading-name">Orders</h1>
        {orders.map((item) => (
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <Stack gap={2}>
                <Button
                  style={{ backgroundColor: "#2274a5" }}
                  variant="contained"
                  onClick={() => onConfirm(item.id)}
                  key={item.id}
                >{`Order Date: ${moment(item.date).format(
                  "MMMM Do YYYY, h:mm:ss"
                )}`}</Button>
              </Stack>
            </Col>
            <Col md={3}></Col>
          </Row>
        ))}
        <button style={{width: "20%", marginLeft: "40%", marginTop: "30px"}}onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default OrdersModal;
