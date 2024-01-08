import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function NotFound() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={12} className="App-header">
              <h1 style={{ paddingBottom: 15 }} className="heading-name">Oops! Page not found...</h1>
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
}

export default NotFound;
