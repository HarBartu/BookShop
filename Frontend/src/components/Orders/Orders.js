import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Cookies from "js-cookie";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../DeleteModal";

function Orders() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const renderAdd = Cookies.get("role") === "Admin" ||  Cookies.get("role") === "User";
  const renderEdit = Cookies.get("role") === "Admin";
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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

  const handleEdit = (id) => {
    navigate("/orders/" + id + "/edit");
  };

  const handleMaybeDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8080/api/orders/" + id,
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
    <>
      <Container fluid className="home-section">
        <Container className="home-content">
          <h1 className="heading-name">Orders</h1>
          {orders.map((item) => (
            <Row style={{ marginTop: "10px" }}>
              <Col md={3}></Col>
              <Col md={6}>
                <Stack gap={2}>
                  <Button
                    style={{ backgroundColor: "#2274a5" }}
                    variant="contained"
                    onClick={() => navigate(`/orders/${item.id}`)}
                    key={item.id}
                  >{`Order Date: ${moment(item.date).format(
                    "MMMM Do YYYY, h:mm:ss"
                  )}`}</Button>
                </Stack>
              </Col>
              <Col md={3}>
                {renderEdit && (
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="edit-button"
                  >
                    <FaEdit />
                  </button>
                )}
                {renderEdit && (
                  <button
                    onClick={() => handleMaybeDelete(item.id)}
                    className="delete-button"
                  >
                    <FaTrash />
                  </button>
                )}
              </Col>
            </Row>
          ))}

          {renderAdd && (
            <Row style={{ marginTop: "35px" }}>
              <Col md={3}></Col>
              <Col md={6}>
                <Stack gap={2}>
                  <>
                    <Button
                      style={{ backgroundColor: "#2274a5" }}
                      variant="contained"
                      onClick={() => navigate(`/orders/add`)}
                      key={"new"}
                    >
                      {"Add new"}
                    </Button>
                  </>
                </Stack>
              </Col>
              <Col md={3}></Col>
            </Row>
          )}
        </Container>
      </Container>
      <ConfirmDeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          handleDelete(deleteId);
          setModalOpen(false);
        }}
      />
    </>
  );
}

export default Orders;
