import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../Utils/config';
import { useAuth } from '../../../context/AuthContext';
import Toaster from '../../../Utils/Toaster';
import DatePicker from 'react-datepicker';
const EditBooking = () => {
  const { user } = useAuth();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        console.log(bookingId);
        const response = await axios.get(`${BASE_URL}/booking/${bookingId}`);
        setBooking(response.data);
        setService(response.data.service);
        setDate(new Date(response.data.date)); // Set the date using the new Date() constructor
        setTime(new Date(`2000-01-01T${response.data.time}:00`)); // Set the time using the new Date() constructor with the time string
        setVehicle(response.data.vehicle);
        setNote(response.data.note);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        Toaster.justToast('error', 'Failed to fetch booking details');
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedBooking = {
        name: booking.name,
        email: booking.email,
        service,
        date: date.toISOString().slice(0, 10), // Convert date to ISO string and extract the date part
        time: time.toISOString().slice(11, 16), // Convert time to ISO string and extract the time part
        vehicle,
        note,
      };
console.log(bookingId);
      await axios.post(`${BASE_URL}/booking/${bookingId}`, updatedBooking);
      Toaster.justToast('success', 'Booking updated successfully');
      navigate('/userProfile');
    } catch (error) {
      console.error('Error updating booking:', error);
      Toaster.justToast('error', 'Failed to update booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container my-5">
      <h2>Edit Appoinment</h2>
      {booking && (
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
            <label htmlFor="service">Service Type</label>
            <select
              className="form-control"
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="" disabled>Select service type</option>
              <option value="oilChange">Oil change</option>
              <option value="bodyWash">Body wash</option>
              <option value="fullService">Full service</option>
              <option value="wheelAlignment">Wheel alignment</option>
              <option value="sensorChecking">Sensor checking</option>
            </select>
          </div>
          <div className="me-3" controlId="date-time">
                <label>Date</label><br/>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  required
                />
              </div>
              <div className="me-3" controlId="date-time">
                <label>Time</label><br/>
                <DatePicker
                  selected={time}
                  onChange={(time) => setTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  className="form-control"
                  required
                />
              </div>
          <div className="form-group" controlId="date-time">
            <label htmlFor="vehicle">Vehicle Type</label>
            <select
              className="form-control"
              id="vehicle"
              value={vehicle}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="" disabled>Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                  <option value="lorry">Lorry</option>
                  <option value="motorcycle">Motorcycle</option>
              </select>
          </div>
          <div className="form-group">
            <label htmlFor="note">Additional Note</label>
            <textarea
              className="form-control"
              id="note"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary mr-2" disabled={isSubmitting}>
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

export default EditBooking;
