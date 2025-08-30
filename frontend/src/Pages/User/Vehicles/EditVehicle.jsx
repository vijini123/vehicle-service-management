import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { BASE_URL } from '../../../Utils/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { message } from 'antd';

const EditVehicle = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState({
    type: '',
    number: '',
    front: '',
    rear: '',
    serviceDate: '',
    brand: '',
    manufacture: '',
    milage: '',
    fuel: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        console.log(vehicleId)
        const response = await axios.get(`${BASE_URL}/vehicle/${vehicleId}`);
        setVehicle(response.data);
        setIsLoading(false);
        message.success("Vehicle Update Successfully")
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        message.error('Error loading vehicle details. Please try again.');
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setVehicle(prevState => ({
      ...prevState,
      serviceDate: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BASE_URL}/vehicle/${vehicleId}`, vehicle, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Vehicle updated:', response.data);
      toast.success('Vehicle updated successfully!');
      navigate('/userProfile');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Error updating vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading vehicle details...</div>;
  }

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">Edit Your Vehicle</h2>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={vehicle.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select vehicle type</option>
                    {['Car', 'Van', 'Bus', 'Lorry', 'Motorcycle', 'Jeep', 'Other'].map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number Plate</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    value={vehicle.number}
                    onChange={handleChange}
                    placeholder="Enter vehicle number"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Front Tyre Condition</Form.Label>
                  <Form.Select
                    name="front"
                    value={vehicle.front}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select tyre condition</option>
                    {['Excellent', 'Good', 'Normal', 'Bad'].map(condition => (
                      <option key={condition} value={condition.toLowerCase()}>{condition}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rear Tyre Condition</Form.Label>
                  <Form.Select
                    name="rear"
                    value={vehicle.rear}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select tyre condition</option>
                    {['Excellent', 'Good', 'Normal', 'Bad'].map(condition => (
                      <option key={condition} value={condition.toLowerCase()}>{condition}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Service Date</Form.Label>
                  <DatePicker
                    selected={new Date(vehicle.serviceDate)}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Brand</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={vehicle.brand}
                    onChange={handleChange}
                    placeholder="Enter vehicle brand"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Manufacture Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="manufacture"
                    value={vehicle.manufacture}
                    onChange={handleChange}
                    placeholder="Enter manufacture year"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Mileage</Form.Label>
                  <Form.Control
                    min={0}
                    type="number"
                    name="milage"
                    value={vehicle.milage}
                    onChange={handleChange}
                    placeholder="Enter mileage"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Fuel Type</Form.Label>
                  <Form.Select
                    name="fuel"
                    value={vehicle.fuel}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select fuel type</option>
                    {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'].map(fuelType => (
                      <option key={fuelType} value={fuelType.toLowerCase()}>{fuelType}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Vehicle'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditVehicle;
