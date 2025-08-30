import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { BASE_URL } from '../Utils/config';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Access from '../Components/AccessDenied/AccesDenid';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  service: Yup.string().required('Service type is required'),
  date: Yup.date().required('Date is required').min(new Date(), 'Date must be in the future'),
  vehicle: Yup.string().required('Vehicle type is required'),
  note: Yup.string().max(500, 'Note must be at most 500 characters')
});

const Contact = () => {
  const { user } = useContext(AuthContext);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [errors, setErrors] = useState({});
  const [existingBookings, setExistingBookings] = useState([]);
  
  useEffect(() => {
    const fetchExistingBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/booking`);
        setExistingBookings(response.data);
      } catch (error) {
        console.error('Error fetching existing bookings:', error);
      }
    };
    fetchExistingBookings();
  }, []);
  
  const sendConfirmationEmail = async (email, bookingDetails) => {
    try {
      await axios.post(`${BASE_URL}/email/send-confirmation-email`, { email, bookingDetails });
      console.log('Confirmation email sent');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      try {
        const bookingData = {
          user: user._id,
          name: user.username,
          email: user.email,
          service,
          date: date ? date.toISOString().slice(0, 10) : null,
          time: time ? time.toISOString().slice(11, 16) : null,
          vehicle,
          note,
        };
  
        await validationSchema.validate(bookingData, { abortEarly: false });
  
        // Check if the date already exists in the database
        const dateExists = existingBookings.some(
          (booking) => booking.date === bookingData.date
        );
  
        if (dateExists) {
          setErrors({ ...errors, date: 'This date is already booked' });
          setIsSubmitting(false);
          return;
        }
  
        console.log('Submitting booking data:', bookingData);
  
        const response = await axios.post(`${BASE_URL}/booking`, bookingData, {
          headers: {
            'Content-Type': 'application/json' 
          }
        });
  
        console.log('Booking saved:', response.data);
        await sendConfirmationEmail(user.email, bookingData);

        setService('');
        setDate('');
        setTime('');
        setVehicle('');
        setNote('');
        setErrors({});
  
        toast.success('Booking saved successfully!');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const newErrors = {};
          error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
          });
          setErrors(newErrors);
        } else {
          console.error('Error saving booking:', error);
          if (error.response) {
            console.error('Server response:', error.response.data);
          }
          toast.error('Error submitting booking. Check whether you are logged in.');
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  return (
    <Container className="booking-container my-5">
      <Row>
        <Col md={6} className="booking-info" >
          <Col md={12}>
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
          <Col md={12}>
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
          <Col md={12}>
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
        </Col>
        <Col md={6} className="booking-form" style={{ backgroundColor: '#e6f7ff' }}>
          <h2>Book your appointment</h2>
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
            <Form.Group controlId="service">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                as="select"
                value={service}
                onChange={(e) => setService(e.target.value)}
                isInvalid={!!errors.service}
              >
                <option value="" disabled>Select service type</option>
                <option value="oilChange">Oil change</option>
                <option value="bodyWash">Body wash</option>
                <option value="fullService">Full service</option>
                <option value="wheelAlignment">Wheel alignment</option>
                <option value="sensorChecking">Sensor checking</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="d-flex align-items-center " controlId="date-time">
              <div className="me-3">
                <Form.Label>Date</Form.Label><br/>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                />
                {errors.date && <div className="invalid-feedback d-block">{errors.date}</div>}
              </div>
              <div>
                <Form.Label>Time</Form.Label><br/>
                <DatePicker
                  selected={time}
                  onChange={(time) => setTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                />
                {errors.time && <div className="invalid-feedback d-block">{errors.time}</div>}
              </div>
            </Form.Group>

            <Form.Group controlId="vehicle">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                as="select"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                isInvalid={!!errors.vehicle}
              >
                <option value="" disabled>Select vehicle type</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="bus">Bus</option>
                <option value="lorry">Lorry</option>
                <option value="motorcycle">Motorcycle</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.vehicle}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="note">
              <Form.Label>Additional Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your message"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                isInvalid={!!errors.note}
              />
              <Form.Control.Feedback type="invalid">{errors.note}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Appointment'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
