
import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AccessDenied.css';
import oops from '../../assets/oops.png'

const AccessDenied = () => {
  return (
    <Container fluid className="access-denied-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col lg={4} className="text-center">
        <img src={oops} alt="" />
        </Col>
        <Col xs={12} md={8} lg={8} className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="display-1 text-danger mb-4">403 <br /> Access Denied</h1>
            <p className="lead mb-5 fs-4">Sorry, you don't have permission to access this page.</p>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                tag={Link}
                to="/"
                color="primary"
                size="lg"
                className="pulse-button"
              >
                Go Back Home
              </Button>
            </motion.div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDenied;
