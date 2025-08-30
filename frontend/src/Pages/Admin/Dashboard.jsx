import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCircle, FaBookmark, FaStar } from 'react-icons/fa';
import { BASE_URL } from '../../Utils/config';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Dashboard.css'; // Create this file for custom styles

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployee] = useState(true);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [inventorys, setInventorys] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsResponse = await axios.get(`${BASE_URL}/review`);
        setReviews(reviewsResponse.data);

        const bookingsResponse = await axios.get(`${BASE_URL}/booking`);
        setBookings(bookingsResponse.data);

        const vehiclesResponse = await axios.get(`${BASE_URL}/vehicle`);
        setVehicles(vehiclesResponse.data);

        const inventoryResponse = await axios.get(`${BASE_URL}/inventory`);
        setInventorys(inventoryResponse.data);

        const supplierResponse = await axios.get(`${BASE_URL}/supplier`);
        setSuppliers(supplierResponse.data);

        const employeeResponse = await axios.get(`${BASE_URL}/employee`);
        setEmployee(employeeResponse.data);
        setEmployeeLeaves(employeeResponse.data.filter(employee => employee.leaveDate || employee.leaveReason));
        // Animate cards on load
        $('.card').addClass('animate__animated animate__fadeInUp');
      } catch (error) {
        toast.error('Error fetching data');
      }
    };
    fetchData();
    // Add hover effect to cards
    $('.card').hover(
      function() { $(this).addClass('shadow-lg').css('cursor', 'pointer'); },
      function() { $(this).removeClass('shadow-lg'); }
    );
  }, []);

  
  const handleAcceptLeave = async (employeeId) => {
    try {
      await axios.post(`${BASE_URL}/employee/${employeeId}`, { status: 'accepted' });
      toast.success('Leave request accepted');
      // Refresh the employee leaves data
      const employeeResponse = await axios.get(`${BASE_URL}/employee`);
      setEmployeeLeaves(employeeResponse.data.filter(employee => employee.leaveDate || employee.leaveReason));
    } catch (error) {
      toast.error('Error accepting leave request');
    }
  };
  
  const handleRejectLeave = async (employeeId) => {
    try {
      await axios.post(`${BASE_URL}/employee/${employeeId}`, { status: 'rejected' });
      toast.success('Leave request rejected');
      // Refresh the employee leaves data
      const employeeResponse = await axios.get(`${BASE_URL}/employee`);
      setEmployeeLeaves(employeeResponse.data.filter(employee => employee.leaveDate || employee.leaveReason));
    } catch (error) {
      toast.error('Error rejecting leave request');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container-fluid py-4">
        <h1 className="text-center mb-4 text-white">Admin Dashboard</h1>
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div className="card1 card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title text-white">
                📝 Reviews
                </h5>
                <p className="card-text display-4">{reviews.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card2 card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title  text-white">
                🕡 Appoinments
                </h5>
                <p className="card-text display-4">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card3 card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title  text-white">
                  🚗 Vehicles
                </h5>
                <p className="card-text display-4">{vehicles.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-12 col-md-4 mb-4">
            <div className="card4 card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title text-white">
                ⚒️ Inventary Items
                </h5>
                <p className="card-text display-4">{inventorys.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card5 card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title text-white">
                🧑🏻‍💻 Employees
                </h5>
                <p className="card-text display-4">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card6 card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title text-white">
                  🧑🏻‍🔧 Suppliers
                </h5>
                <p className="card-text display-4">{suppliers.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                Recent Reviews
              </div>
              <div className="card-body scrollable">
                {reviews.slice(0, 100).map((review) => (
                  <div key={review._id} className="mb-3 review-item">
                    <h6>{review.message}</h6>
                    <p className="text-muted">
                      By {review.name} 
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card">
              <div className="card-header bg-success text-white">
                Recent Bookings
              </div>
              <div className="card-body scrollable">
                {bookings.slice(0, 100).map((booking) => (
                  <div key={booking._id} className="mb-3 booking-item">
                    <h6>Booking for {booking.service}</h6>
                    <p className="text-muted">
                      By {booking.name}
                    </p>
                    <p className="text-muted">
                      Date: {booking.date}<br/>
                      Time: {booking.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="card">
              <div className="card-header bg-info text-white">
                Employee Leave Requests
              </div>
              <div className="card-body scrollable">
                {employeeLeaves.map((employee) => (
                  <div key={employee._id} className="mb-3 employee-leave-item">
                    <h6>By: {employee.name}</h6>
                    <p className="text-muted">
                      Reason: {employee.reason}
                    </p>
                    <p className="text-muted">
                      Leave Date: {new Date(employee.leaveDate).toLocaleDateString()}
                    </p>
                    <p className={`text-${employee.status === 'accepted' ? 'success' : employee.status === 'rejected' ? 'danger' : 'muted'}`}>
                      Status: {employee.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1) : 'Pending'}
                    </p>
                    {!employee.status && (
                      <div>
                        <button className="btn btn-success btn-sm mr-2" onClick={() => handleAcceptLeave(employee._id)}>Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleRejectLeave(employee._id)}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;