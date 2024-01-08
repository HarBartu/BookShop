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
//import ProjectCard from "./ProjectCards";

function BookDetails() {
  const { collectionId, bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({});
  const [loaded, setLoaded] = useState(false);
  useEffect(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/collections/${collectionId}/books/${bookId}`,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        }
      );

      if (response.status === 200) {
        setBook(response.data);
        setLoaded(true);
      }
      if (response.status === 401) {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  console.log(book);
  if (!loaded) return <CircularProgress />;
  return (
    <Container fluid className="home-section">
      <Container className="home-content">
        <h1 className="heading-name">Book</h1>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <Card className="project-card-view">
              <CardContent>
                <Typography variant="h5" component="div">
                  {book.name}
                </Typography>
                <Typography variant="body2">
                  Description: {book.description}
                </Typography>
                <Typography variant="body2">Price: {book.price}</Typography>
              </CardContent>
            </Card>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </Container>
  );
}

export default BookDetails;
