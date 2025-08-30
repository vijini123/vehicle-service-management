import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../Styles/Packages.css';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../Utils/config';
import { message } from 'antd';
import { FaUser, FaEnvelope, FaCar, FaBox, FaFileAlt, FaDollarSign, FaCreditCard, FaCalendarAlt, FaLock } from 'react-icons/fa';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingData, setBookingData] = useState({ 
    name: '', 
    email: '', 
    vehicleType: '',
    cardNumber: '',
    expire: '',
    cvv: ''
  });
  const [newPackage, setNewPackage] = useState({ title: '', description: '', price: '' });
  const [editMode, setEditMode] = useState(false);
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/package`);
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
    setEditMode(false);
    setBookingData({ name: user.username, email: user.email, vehicleType: '', cardNumber: '', expire: '', cvv: '' });
    setErrors({});
  };

  const validateForm = () => {
    let formErrors = {};
    if (!bookingData.name) formErrors.name = "Name is required";
    if (!bookingData.email) formErrors.email = "Email is required";
    if (!bookingData.vehicleType) formErrors.vehicleType = "Vehicle type is required";
    if (!bookingData.cardNumber) formErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(bookingData.cardNumber)) formErrors.cardNumber = "Card number must be 16 digits";
    if (!bookingData.expire) formErrors.expire = "Expiration date is required";
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(bookingData.expire)) formErrors.expire = "Invalid expiration date format (MM/YY)";
    if (!bookingData.cvv) formErrors.cvv = "CVV is required";
    else if (!/^\d{3}$/.test(bookingData.cvv)) formErrors.cvv = "CVV must be 3 digits";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const bookingPayload = {
          name: bookingData.name,
          email: bookingData.email,
          vehicleType: bookingData.vehicleType,
          title: selectedPackage.title,
          description: selectedPackage.description,
          price: selectedPackage.price,
          cardNumber: bookingData.cardNumber,
          expire: bookingData.expire,
          cvv: bookingData.cvv
        };
        console.log("Booking payload:", bookingPayload);
        await axios.post(`${BASE_URL}/packageBooking`, bookingPayload);
        message.success('Booking successful!');
        setShowModal(false);
      } catch (error) {
        toast.error('Booking failed. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleNewPackageChange = (e) => {
    setNewPackage({ ...newPackage, [e.target.name]: e.target.value });
  };

  const validateNewPackage = () => {
    let formErrors = {};
    if (!newPackage.title) formErrors.title = "Title is required";
    if (!newPackage.description) formErrors.description = "Description is required";
    if (!newPackage.price) formErrors.price = "Price is required";
    else if (isNaN(newPackage.price) || Number(newPackage.price) <= 0) formErrors.price = "Price must be a positive number";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    if (validateNewPackage()) {
      try {
        await axios.post(`${BASE_URL}/package`, newPackage);
        message.success('Package added successfully!');
        fetchPackages();
        setNewPackage({ title: '', description: '', price: '' });
        setErrors({});
      } catch (error) {
        toast.error('Failed to add package. Please try again.');
      }
    }
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setNewPackage(pkg);
    setEditMode(true);
    setShowModal(true);
    setErrors({});
  };

  const handleUpdatePackage = async (e) => {
    e.preventDefault();
    if (validateNewPackage()) {
      try {
        await axios.post(`${BASE_URL}/package/${selectedPackage._id}`, newPackage);
        message.success('Package updated successfully!');
        fetchPackages();
        setShowModal(false);
        setErrors({});
      } catch (error) {
        toast.error('Failed to update package. Please try again.');
      }
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`${BASE_URL}/package/${id}`);
        message.success('Package deleted successfully!');
        fetchPackages();
      } catch (error) {
        toast.error('Failed to delete package. Please try again.');
      }
    }
  };

  return (
    <div className="packages-container">
      <h1 className="packages-title">Exciting Service Packages</h1>
      
      {user && user.email === 'admin@gmail.com' && (
        <div className="admin-form">
          <h2>Add New Package</h2>
          <Form onSubmit={handleAddPackage}>
            <Form.Group>
              <Form.Control type="text" name="title" value={newPackage.title} onChange={handleNewPackageChange} placeholder="Package Name" required />
              {errors.title && <Form.Text className="text-danger">{errors.title}</Form.Text>}
            </Form.Group>
            <Form.Group>
              <Form.Control as="textarea" name="description" value={newPackage.description} onChange={handleNewPackageChange} placeholder="Description" required />
              {errors.description && <Form.Text className="text-danger">{errors.description}</Form.Text>}
            </Form.Group>
            <Form.Group>
              <Form.Control type="number" min={0} name="price" value={newPackage.price} onChange={handleNewPackageChange} placeholder="Price" required />
              {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
            </Form.Group>
            <Button className='mt-3' variant="success" type="submit">Add Package</Button>
          </Form>
        </div>
      )}

      <div className="package-grid">
        {packages.map((pkg) => (
          <Card key={pkg._id} className="package-card">
            <Card.Body>
              <Card.Title>{pkg.title}</Card.Title>
              <Card.Text>{pkg.description.substring(0, 100)}...</Card.Text>
              <Card.Text className="package-price">LKR: {pkg.price}/=</Card.Text>
              {user && user.email === 'admin@gmail.com' ? (
                <div>
                  <Button variant="primary" onClick={() => handleEditPackage(pkg)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDeletePackage(pkg._id)}>Delete</Button>
                </div>
              ) : (
                <Button variant="primary" onClick={() => handlePackageClick(pkg)}>Book Now</Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Package' : selectedPackage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editMode ? (
            <Form onSubmit={handleUpdatePackage}>
              <Form.Group>
                <Form.Control type="text" name="title" value={newPackage.title} onChange={handleNewPackageChange} placeholder="Package Name" required />
                {errors.title && <Form.Text className="text-danger">{errors.title}</Form.Text>}
              </Form.Group>
              <Form.Group>
                <Form.Control as="textarea" name="description" value={newPackage.description} onChange={handleNewPackageChange} placeholder="Description" required />
                {errors.description && <Form.Text className="text-danger">{errors.description}</Form.Text>}
              </Form.Group>
              <Form.Group>
                <Form.Control type="number" min={0} name="price" value={newPackage.price} onChange={handleNewPackageChange} placeholder="Price" required />
                {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
              </Form.Group>
              <Button variant="primary" type="submit">Update Package</Button>
            </Form>
          ) : (
            <>
              <h4>Book This Package</h4>
              <Form onSubmit={handleBookingSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaBox /></InputGroup.Text>
                      <Form.Control type="text" name="title" value={selectedPackage?.title} onChange={handleInputChange} required readOnly />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaFileAlt /></InputGroup.Text>
                      <Form.Control as="textarea" name="description" value={selectedPackage?.description} onChange={handleInputChange} required readOnly />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaDollarSign /></InputGroup.Text>
                      <Form.Control type="text" min={0} name="price" value={selectedPackage?.price} onChange={handleInputChange} required readOnly />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaUser /></InputGroup.Text>
                      <Form.Control type="text" name="name" value={bookingData.name} onChange={handleInputChange} placeholder="Your Name" required readOnly/>
                    </InputGroup>
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                  </div>
                  <div className="col-md-6">
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                      <Form.Control type="email" name="email" value={bookingData.email} onChange={handleInputChange} placeholder="Your Email" required readOnly/>
                    </InputGroup>
                    {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaCar /></InputGroup.Text>
                      <Form.Select name="vehicleType" value={bookingData.vehicleType} required onChange={handleInputChange}>
                        <option value="">Select Vehicle Type</option>
                        <option value="car">Car</option>
                        <option value="van">Van</option>
                        <option value="lorry">Lorry</option>
                        <option value="bus">Bus</option>
                        <option value="jeep">Jeep</option>
                        <option value="motorcycle">Motorcycle</option>
                      </Form.Select>
                    </InputGroup>
                    {errors.vehicleType && <Form.Text className="text-danger">{errors.vehicleType}</Form.Text>}
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaCreditCard /></InputGroup.Text>
                      <Form.Control type="text" minLength={16} maxLength={16} name="cardNumber" value={bookingData.cardNumber} onChange={handleInputChange} placeholder="Card Number" required />
                    </InputGroup>
                    {errors.cardNumber && <Form.Text className="text-danger">{errors.cardNumber}</Form.Text>}
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                      <Form.Control type="text" name="expire" value={bookingData.expire} onChange={handleInputChange} placeholder="MM/YY" required />
                    </InputGroup>
                    {errors.expire && <Form.Text className="text-danger">{errors.expire}</Form.Text>}
                    <InputGroup className="mb-3">
                      <InputGroup.Text><FaLock /></InputGroup.Text>
                      <Form.Control type="text" name="cvv" minLength={3} maxLength={3} value={bookingData.cvv} onChange={handleInputChange} placeholder="CVV" required />
                    </InputGroup>
                    {errors.cvv && <Form.Text className="text-danger">{errors.cvv}</Form.Text>}
                  </div>
                </div>
                <Button className='mt-3' variant="primary" type="submit">
                  Book Now
                </Button>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Packages;
