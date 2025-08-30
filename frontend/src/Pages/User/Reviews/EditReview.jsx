import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../Utils/config';
import { useAuth } from '../../../context/AuthContext';
import Toaster from '../../../Utils/Toaster';

const EditReview = () => {
  const { user } = useAuth();
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [type, setType] = useState(null);
  const [contact, setContact] = useState('');
  const [carType, setCarType] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidContact, setIsValidContact] = useState(true);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/review/${reviewId}`);
        setReview(response.data);
        setType(response.data.type);
        setContact(response.data.contact);
        setCarType(response.data.carType);
        setServiceDate(new Date(response.data.serviceDate));
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching review details:', error);
        Toaster.justToast('error', 'Failed to fetch review details');
      }
    };

    fetchReviewDetails();
  }, [reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contact.length !== 10 || !/^\d{10}$/.test(contact)) {
      setIsValidContact(false);
      return;
    }
    setIsValidContact(true);
    setIsSubmitting(true);

    try {
      const updatedReview = {
        name: review.name,
        email: review.email,
        type,
        contact,
        carType,
        serviceDate: serviceDate.toISOString(),
        message,
      };

      await axios.post(`${BASE_URL}/review/${reviewId}`, updatedReview);
      Toaster.justToast('success', 'Review updated successfully');
      navigate('/userProfile');
    } catch (error) {
      console.error('Error updating review:', error);
      Toaster.justToast('error', 'Failed to update review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container my-5">
      <h2>Edit Review</h2>
      {review && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name" value={user.username} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" value={user.email} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="type">Message Type</label>
            <select
              className="form-control"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select message type</option>
              <option value="inquiry">Inquiry</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="carType">Car Type</label>
            <select
              className="form-control"
              id="carType"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
            >
              <option value="">Select car type</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="bus">Bus</option>
              <option value="lorry">Lorry</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact number</label>
            <input
              type="text"
              className={`form-control ${!isValidContact ? 'is-invalid' : ''}`}
              id="contact"
              placeholder="Enter your contact number"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setIsValidContact(true);
              }}
              required
            />
            {!isValidContact && (
              <div className="invalid-feedback">
                Please enter a valid 10-digit contact number.
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="serviceDate">Service Date</label>
            <input
              type="date"
              className="form-control"
              id="serviceDate"
              value={serviceDate.toISOString().slice(0, 10)}
              onChange={(e) => setServiceDate(new Date(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              className="form-control"
              id="message"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting} style={{ fontSize: '12px', padding: '5px 50px', marginRight: '5px', borderRadius: '5px', backgroundColor: 'rgb(0, 87, 163)', borderColor: '#4CAF50' }}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditReview;
