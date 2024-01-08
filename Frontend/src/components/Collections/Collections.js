import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { TbEdit, TbTrash } from "react-icons/tb";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../DeleteModal";
import OrdersModal from "../OrdersModal";
import { CgAdd } from "react-icons/cg";

function Collections() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const renderEdit =
    Cookies.get("role") === "Admin" || Cookies.get("role") === "Seller";
  const renderAdd =
    Cookies.get("role") === "Admin" || Cookies.get("role") === "User";
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);

  useEffect(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/collections",
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 200) {
        setCollections(response.data);
      }
      if (response.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleEdit = (id) => {
    navigate("/collections/" + id + "/edit");
  };

  const handleMaybeDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8080/api/collections/" + id,
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

  const handleCollectionAdd = async (orderId) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/orders/" +
          orderId +
          "/collections/" +
          selectedId,
        {},
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
          <h1 className="heading-name">Collections</h1>
          {collections.map((item) => (
            <Row style={{ marginTop: "10px" }}>
              <Col md={3}></Col>
              <Col md={6}>
                <Stack gap={2}>
                  <>
                    <Button
                      style={{ backgroundColor: "#2274a5" }}
                      variant="contained"
                      onClick={() => navigate(`/collections/${item.id}`)}
                      key={item.id}
                    >
                      {`${item.name} - ${item.price}`}
                    </Button>
                  </>
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
                {renderAdd && (
                  <button
                    onClick={() => {
                      setSelectedId(item.id);
                      setOrdersModalOpen(true);
                    }}
                    className="add-button"
                  >
                    <CgAdd />
                  </button>
                )}
              </Col>
            </Row>
          ))}

          {renderEdit && (
            <Row style={{ marginTop: "35px" }}>
              <Col md={3}></Col>
              <Col md={6}>
                <Stack gap={2}>
                  <>
                    <Button
                      style={{ backgroundColor: "#2274a5" }}
                      variant="contained"
                      onClick={() => navigate(`/collections/add`)}
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
      <OrdersModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
        onConfirm={(orderId) => {
          handleCollectionAdd(orderId);
          setModalOpen(false);
        }}
      ></OrdersModal>
    </>
  );
}

export default Collections;
