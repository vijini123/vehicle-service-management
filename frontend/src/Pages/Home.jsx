import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import img1 from '../assets/images/hero-img01.jpg'
import img2 from '../assets/images/hero-img02.jpg'
import img3 from '../assets/images/hero-img03.jpg'
import Chatbot from '../Components/AIChatBot/ChatBot'

const Home = () => {

  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  return <>
    <div className="home-page">
      <div style={{ marginTop: '20px' }}>
        <div class="container text-center">
              <h3 class="display-4 fi">Welcome to <br /> <b>SAVONTA Service (pvt) LTD.</b></h3>
              <p class="lead fi">Your Trusted Vehicle Service Partner</p>
              <a href="/services" class="btn bg-primary btn-light btn-lg rounded-pill text-light fi">Explore Our Services</a>
        </div>

        <Container className="my-5">
          <Row>
            <Col md={8}>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={img1}
                    alt="Professional Service"
                  />
                  <Carousel.Caption>
                    <h3>Professional Service</h3>
                    <p>Expert technicians for all your vehicle needs</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={img2}
                    alt="Quality Parts"
                  />
                  <Carousel.Caption>
                    <h3>Quality Parts</h3>
                    <p>We use only the best components for your vehicle</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={img3}
                    alt="Quick Turnaround"
                  />
                  <Carousel.Caption>
                    <h3>Quick Turnaround</h3>
                    <p>Fast and efficient service to get you back on the road</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Book an Appointment</Card.Title>
                  <Card.Text>
                    Schedule your vehicle service today and experience the SAVONTA difference.
                  </Card.Text>
                  <Button as={Link} to="/booking" variant="primary">Book Now</Button>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Emergency Service</Card.Title>
                  <Card.Text>
                    Need urgent assistance? Our 24/7 emergency team is here to help.
                  </Card.Text>
                  <Button variant="danger">Call Now</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col md={4}>
              <Card className="service-card">
                <Card.Body>
                  <Card.Title>Oil Change</Card.Title>
                  <Card.Text>
                    Regular oil changes to keep your engine running smoothly.
                  </Card.Text>
                  <Button variant="outline-primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="service-card">
                <Card.Body>
                  <Card.Title>Brake Service</Card.Title>
                  <Card.Text>
                    Ensure your safety with our professional brake services.
                  </Card.Text>
                  <Button variant="outline-primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="service-card">
                <Card.Body>
                  <Card.Title>Tire Services</Card.Title>
                  <Card.Text>
                    From rotation to replacement, we've got your tires covered.
                  </Card.Text>
                  <Button variant="outline-primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Chatbot toggle button */}
      <Button
        onClick={toggleChatbot}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}
      >
        {showChatbot ? 'Close Chat' : 'Need Help?'}
      </Button>

      {/* Chatbot component */}
      {showChatbot && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '300px',
          height: '400px',
          zIndex: 1000
        }}>
          <Chatbot />
        </div>
      )}
    </div>
  </>
}

export default Home