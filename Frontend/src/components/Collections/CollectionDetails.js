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
import Cookies from "js-cookie";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../DeleteModal";
//import ProjectCard from "./ProjectCards";

function CollectionDetails() {
  const renderEdit =
    Cookies.get("role") === "Admin" || Cookies.get("role") === "Seller";
  const { collectionId } = useParams();

  const navigate = useNavigate();
  const [collection, setCollection] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/collections/${collectionId}`,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 200) {
        setCollection(response.data);
        setLoaded(true);
      }
      if (response.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleEdit = (id) => {
    navigate("/collections/" + collectionId + "/books/" + id + "/edit");
  };

  const handleMaybeDelete = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8080/api/collections/" +
          collectionId +
          "/books/" +
          id,
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
  console.log(collection);
  if (!loaded) return <CircularProgress />;
  return (
    <>
      <Container fluid className="home-section">
        <Container className="home-content">
          <h1 className="heading-name">Collection</h1>
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
              <Card className="project-card-view">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {collection.name}
                  </Typography>
                  <Typography variant="body2">
                    Price: {collection.price}
                  </Typography>
                </CardContent>
              </Card>
            </Col>
            <Col md={3}></Col>
          </Row>
          <br />
          <h1 className="heading-name">Collection Books</h1>

          {collection.books.map((item) => (
            <Row style={{ marginTop: "10px" }}>
              <Col md={3}></Col>
              <Col md={6}>
                <Stack gap={2}>
                  <Button
                    style={{ backgroundColor: "#2274a5" }}
                    variant="contained"
                    onClick={() =>
                      navigate(`/collections/${collectionId}/books/${item.id}`)
                    }
                    key={item.id}
                  >{`${item.name} - ${item.price}`}</Button>
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

          {renderEdit && (
            <Row style={{ marginTop: "35px" }}>
              <Col md={3}></Col>
              <Col md={6}>
                <Stack gap={2}>
                  <>
                    <Button
                      style={{ backgroundColor: "#2274a5" }}
                      variant="contained"
                      onClick={() =>
                        navigate(`/collections/${collectionId}/books/add`)
                      }
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

export default CollectionDetails;
