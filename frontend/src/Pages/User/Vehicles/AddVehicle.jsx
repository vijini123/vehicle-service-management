import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { BASE_URL } from '../../../Utils/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext'
import { message } from 'antd'

const AddVehicle = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [front, setFront] = useState('');
  const [rear, setRear] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [brand, setBrand] = useState('');
  const [manufacture, setManufacture] = useState('');
  const [milage, setMilage] = useState('');
  const [fuel, setFuel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (!type) formErrors.type = "Vehicle type is required";
    if (!number) formErrors.number = "Number plate is required";
    if (!front) formErrors.front = "Front tyre condition is required";
    if (!rear) formErrors.rear = "Rear tyre condition is required";
    if (!serviceDate) formErrors.serviceDate = "Last service date is required";
    if (!brand) formErrors.brand = "Vehicle brand is required";
    if (!manufacture) formErrors.manufacture = "Manufacture year is required";
    else if (isNaN(manufacture) || manufacture < 1900 || manufacture > new Date().getFullYear()) 
      formErrors.manufacture = "Invalid manufacture year";
    if (!milage) formErrors.milage = "Milage is required";
    else if (isNaN(milage) || milage < 0) formErrors.milage = "Invalid milage";
    if (!fuel) formErrors.fuel = "Fuel type is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    try {
      const vehicleData = {
        user: user._id,
        name: user.username,
        email: user.email,
        type,
        number,
        front,
        rear,
        serviceDate,
        brand,
        manufacture,
        milage,
        fuel,
      };
  
      console.log('Submitting vehicle data:', vehicleData);
  
      const response = await axios.post(`${BASE_URL}/vehicle`, vehicleData, {
        headers: {
          'Content-Type': 'application/json' 
        }
      });
  
      console.log('Vehicle saved:', response.data);
  
      setType('');
      setNumber('');
      setFront('');
      setRear('');
      setServiceDate('');
      setBrand('');
      setManufacture('');
      setMilage('');
      setFuel('');
  
      message.success("Vehicle saved successfully!");
      navigate('/userProfile')
    } catch (error) {
      console.error('Error saving vehicle:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      toast.error('Error submitting Vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container className="Vehicle-container my-5 md-auto">
      <Row>
        <Col md={6} className="Vehicle-form mx-auto" style={{ backgroundColor: '#e6f7ff' }}>
          <h2>Add your vehicle</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="number">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={user?.username || ''}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={user?.email || ''}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="service">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    isInvalid={!!errors.type}
                  >
                    <option value="" disabled>Select vehicle type</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                    <option value="lorry">Lorry</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="jeep">Jeep</option>
                    <option value="other">Other</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="number">
                  <Form.Label>Number Plate</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your number"
                    onChange={(e) => setNumber(e.target.value)}
                    value={number}
                    isInvalid={!!errors.number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.number}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="front">
                  <Form.Label>Front Tyre</Form.Label>
                  <Form.Control
                    as="select"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    isInvalid={!!errors.front}
                  >
                    <option value="" disabled>Select tyre condition</option>
                    <option value="excelent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="normal">Normal</option>
                    <option value="bad">Bad</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.front}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="rear">
                  <Form.Label>Rear Tyre</Form.Label>
                  <Form.Control
                    as="select"
                    value={rear}
                    onChange={(e) => setRear(e.target.value)}
                    isInvalid={!!errors.rear}
                  >
                    <option value="" disabled>Select tyre condition</option>
                    <option value="excelent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="normal">Normal</option>
                    <option value="bad">Bad</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.rear}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="d-flex align-items-center" controlId="date-time">
                  <div className="me-3">
                    <Form.Label>Last Service Date</Form.Label><br />
                    <DatePicker
                      selected={serviceDate}
                      onChange={(date) => setServiceDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className={`form-control ${errors.serviceDate ? 'is-invalid' : ''}`}
                    />
                    {errors.serviceDate && <div className="invalid-feedback">{errors.serviceDate}</div>}
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="brand">
                  <Form.Label>Vehicle brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter vehicle brand"
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                    isInvalid={!!errors.brand}
                  />
                  <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="manufacture">
                  <Form.Label>Manufacture year</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter manufacture year"
                    onChange={(e) => setManufacture(e.target.value)}
                    value={manufacture}
                    isInvalid={!!errors.manufacture}
                  />
                  <Form.Control.Feedback type="invalid">{errors.manufacture}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="milage">
                  <Form.Label>Mileage</Form.Label>
                  <Form.Control
                    min={0}
                    type="number"
                    placeholder="Enter mileage"
                    onChange={(e) => setMilage(e.target.value)}
                    value={milage}
                    isInvalid={!!errors.milage}
                  />
                  <Form.Control.Feedback type="invalid">{errors.milage}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="fuel">
                  <Form.Label>Fuel type</Form.Label>
                  <Form.Control
                    as="select"
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    isInvalid={!!errors.fuel}
                  >
                    <option value="" disabled>Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="other">Other</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.fuel}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Empty column for spacing */}
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Save vehicle'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddVehicle;
