import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import '../Styles/About.css';
import img from '../assets/images/hero-img01.jpg'

const About = () => {
  return (
    <div className="about-page">
      <div className="hero-section">
        <h1>About Savonta Service (Pvt) Ltd</h1>
        <p>Your Trusted Partner in Vehicle Care</p>
      </div>

      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <h2>Our Story</h2>
            <p>
              Savonta Service has been a leading name in vehicle maintenance and repair since 2005. 
              With a commitment to excellence and customer satisfaction, we've grown from a small 
              garage to a full-service automotive care center.
            </p>
          </Col>
          <Col md={6}>
            <img src={img} alt="Our Workshop" className="img-fluid rounded" />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={4}>
            <Card className="service-card">
              <CardBody>
                <h3>Expert Technicians</h3>
                <p>Our team of certified mechanics ensures top-notch service for your vehicle.</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="service-card">
              <CardBody>
                <h3>State-of-the-Art Equipment</h3>
                <p>We use the latest diagnostic and repair tools to provide accurate services.</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="service-card">
              <CardBody>
                <h3>Customer-First Approach</h3>
                <p>Your satisfaction is our priority. We offer transparent and honest service.</p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h2>Our Services</h2>
            <ul className="service-list">
              <li>Regular Maintenance</li>
              <li>Engine Diagnostics and Repair</li>
              <li>Brake Service</li>
              <li>Transmission Repair</li>
              <li>Tire Services</li>
              <li>Air Conditioning Service</li>
            </ul>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h2>Why Choose Us?</h2>
            <p>
              At Savonta Service, we combine technical expertise with a passion for customer care. 
              Our goal is to keep your vehicle running smoothly and safely, providing you with 
              peace of mind on the road.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
