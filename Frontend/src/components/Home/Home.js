import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import books from "../../Assets/book.png";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={12} className="App-header">
              <h1 style={{ paddingBottom: 15 }} className="heading-name">Welcome to BookShop!</h1>

              <h1 style={{ paddingBottom: 15 }}className="heading">If you are looking for books</h1>
              <h1 style={{ paddingBottom: 15 }}className="heading">look no more - this is the place!</h1>

              <img className={'responsive-image'} src={books} alt="brand" />
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  );
}

export default Home;
