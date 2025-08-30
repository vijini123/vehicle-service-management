import React, { useEffect, useState, useContext } from 'react';
import Toaster from '../../../Utils/Toaster';
import { bookingHeader } from '../../../Utils/TableHeaders';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import PdfGenerator from '../../../Utils/Pdfs/BookingPDF';
import ResponseHandler from '../../../Utils/ResponseHandler';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';

export default function BookingManage() {
  const { user, dispatch } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log(user.email)
      const response = await axios.get(`${BASE_URL}/booking?email=${user.email}`);
      setBookings(response.data.filter((booking) => booking.email === user.email));
      setFilteredBookings(response.data.filter((booking) => booking.email === user.email));
      console.log(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
      Toaster.dismissLoadingToast();
    }
  };

  const generatePdf = () => {
    Toaster.loadingToast('Generating Pdf');
    try {
      console.log(bookings);
      PdfGenerator.generatePdf(filteredBookings, "Bookings List", bookingHeader);
      Toaster.justToast('success', 'Creating The Pdf For You', () => {});
    } catch (error) {
      Toaster.justToast('error', 'Generation failed', () => {});
    } finally {
      Toaster.dismissLoadingToast();
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredBookings = bookings.filter((booking) =>
      booking.service.toLowerCase().includes(query) || 
    booking.vehicle.toLowerCase().includes(query)
    );
    setFilteredBookings(filteredBookings);
  };

  const handleBookingEdit = (booking) => {
    console.log(booking._id);
    navigate(`/user/bookings/edit/${booking._id}`);
    setIsEditing(true);
  };

  const handleDelete = async (bookingId) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        console.log(bookingId);
        await axios.delete(`${BASE_URL}/booking/${bookingId}`);
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        setFilteredBookings(filteredBookings.filter(booking => booking._id !== bookingId));
        Toaster.justToast('success', 'Booking deleted successfully');
      } catch (err) {
        console.error(err);
        Toaster.justToast('error', 'Failed to delete booking');
      }
    });
  };

  return (
    <div className="body-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex align-items-stretch">
            <div className="card w-100 shadow-sm">
            <div className='d-flex justify-content-end align-items-center mb-4'>
              
        <form className="position-relative">
                      <input
                          value={searchQuery}
                          onChange={handleSearch}
                          type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search" />
                      <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                  </form>
              <button className='btn btn-outline-dark mx-2' onClick={generatePdf}>Export</button>
              <button className='btn text-white' style={{backgroundColor:'#1681e5'}} onClick={() => {
                  navigate(`/booking`);
              }}>Add New</button>
         </div>
              <div className="card-body p-4">
              <h3>My Appoinments</h3>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Service Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Vehicle Type</th>
                        <th>Additional Note</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredBookings && filteredBookings.length > 0 ? (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.name}</td>
                          <td>{booking.email}</td>
                          <td>{booking.service}</td>
                          <td>{booking.date}</td>
                          <td>{booking.time}</td>
                          <td>{booking.vehicle}</td>
                          <td>{booking.note}</td>
                          <td>
                            <button
                              className="btn btn-sm me-2"
                              style={{ backgroundColor: '#007bff', color: '#ffff', borderColor: '#007bff' }}
                              onClick={() => handleBookingEdit(booking, booking._id)}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ backgroundColor: '#dc3545', color: '#ffff', borderColor: '#dc3545' }}
                              onClick={() => handleDelete(booking._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))) : (
                        <tr>
                          <td colSpan={6}>No bookings found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}