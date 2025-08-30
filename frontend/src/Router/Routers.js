import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import ThankYou from '../Pages/ThankYou'
import About from '../Pages/About'
import UserProfile from '../Pages/UserProfile'
import Contact from '../Pages/Contact'
import Booking from '../Pages/Bookings'
import Packages from '../Pages/Packages'
import PackageBookings from '../Pages/User/PackageBookings/PackageBookings'
import EditPackageBooking from '../Pages/User/PackageBookings/EditPackageBookings'

import AddVehicle from '../Pages/User/Vehicles/AddVehicle'
import VehicleDetails from '../Pages/User/Vehicles/VehicleDetails'
import VehicleEdit from '../Pages/User/Vehicles/EditVehicle'

import ReviewDetails from '../Pages/User/Reviews/ReviewDetails'
import EditReview from '../Pages/User/Reviews/EditReview'

import BookingDetails from '../Pages/User/Bookings/BookingDetails'
import EditBooking from '../Pages/User/Bookings/EditBookings'

import AdminProfile from '../Pages/AdminProfile'
import EmployeeDetails from '../Pages/Admin/Employee/EmployeeDetails'
import EmployeeProfile from '../Pages/Employee/EmployeeProfile';
import EmployeeLogin from '../Pages/EmployeeLogin'

// In your routes

const Routers = () => {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/home"/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packageBookings" element={<PackageBookings />} />
        <Route path="/editPackageBooking/:id" element={<EditPackageBooking />} />
        
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/vehicleAdd" element={<AddVehicle />} />
        <Route path="/vehicles/edit/:vehicleId" element={<VehicleEdit />} />
        <Route path="/vehicleDetails" element={<VehicleDetails />} />
        <Route path="/reviewDetails" element={<ReviewDetails />} />
        <Route path="/user/reviews/edit/:reviewId" element={<EditReview />} />
        <Route path="/bookingDetails" element={<BookingDetails />} />
        <Route path="/user/bookings/edit/:bookingId" element={<EditBooking />} />


        <Route path="/adminProfile" element={<AdminProfile />} />

        <Route path="/employeeDetails" element={<EmployeeDetails />} />
        <Route path="/employeeProfile" element={<EmployeeProfile />} />
        <Route path="/employeeLogin" element={<EmployeeLogin />} />

    </Routes>
  );
};

export default Routers;







