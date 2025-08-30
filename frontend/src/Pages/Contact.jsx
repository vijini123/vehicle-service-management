import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { BASE_URL } from '../Utils/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Contact = () => {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState('');
  const [carType, setCarType] = useState('');
  const [contact, setContact] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    type: '',
    carType: '',
    contact: '',
    serviceDate: '',
    message: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!type) {
      newErrors.type = 'Please select a message type';
      isValid = false;
    } else {
      newErrors.type = '';
    }

    if (!carType) {
      newErrors.carType = 'Please select a car type';
      isValid = false;
    } else {
      newErrors.carType = '';
    }

    if (!contact || contact.length !== 10 || !/^\d+$/.test(contact)) {
      newErrors.contact = 'Please enter a valid 10-digit contact number';
      isValid = false;
    } else {
      newErrors.contact = '';
    }

    if (!serviceDate) {
      newErrors.serviceDate = 'Please select a date';
      isValid = false;
    } else {
      newErrors.serviceDate = '';
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter a message';
      isValid = false;
    } else {
      newErrors.message = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const reviewData = {
        user: user._id,
        name: user.username,
        email: user.email,
        contact,
        type,
        carType,
        serviceDate: serviceDate.toISOString(),
        message
      };

      const response = await axios.post(`${BASE_URL}/review`, reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Review saved:', response.data);

      setType('');
      setContact('');
      setCarType('');
      setServiceDate(new Date());
      setMessage('');

      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error saving review:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      toast.error('Error submitting review. Check whether you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="contact-container my-5">
      <Row>
        <Col md={4} className="contact-info">
          <h2>Contact Us</h2>
          <div className="contact-item">
            <span>+1 (123) 456-7890</span>
          </div>
          <div className="contact-item">
            <span>info@autoservice.com</span>
          </div>
          <div className="contact-item">
            <span>123 Auto Street, Car City, ST 12345</span>
          </div>
        </Col>
        <Col md={8} className="contact-form" style={{ backgroundColor: '#e6f7ff' }}>
          <h2>Leave a Review</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={user?.username || ''}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={user?.email || ''}
                disabled
              />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Message type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                isInvalid={!!errors.type}
              >
                <option value="" disabled>Select message type</option>
                <option value="inquiry">Inquiry</option>
                <option value="feedback">Feedback</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="contact">
              <Form.Label>Contact number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                isInvalid={!!errors.contact}
              />
              <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="carType">
              <Form.Label>Car Type</Form.Label>
              <Form.Control
                as="select"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                isInvalid={!!errors.carType}
              >
                <option value="" disabled>Select car type</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="bus">Bus</option>
                <option value="lorry">Lorry</option>
                <option value="motorcycle">Motorcycle</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.carType}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="Date">
              <Form.Label>Date</Form.Label><br/>
              <DatePicker
                selected={serviceDate}
                onChange={(date) => setServiceDate(date)}
                className={`form-control ${errors.serviceDate ? 'is-invalid' : ''}`}
                dateFormat="MMMM d, yyyy"
              />
              {errors.serviceDate && <div className="invalid-feedback">{errors.serviceDate}</div>}
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                isInvalid={!!errors.message}
              />
              <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}
               style={{ fontSize: '12px', padding: '15px 60px', marginRight: '5px', borderRadius: '15px', backgroundColor: 'rgb(0, 87, 163)', borderColor: '#4CAF50' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
