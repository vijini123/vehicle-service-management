  import React, { useState, useContext } from 'react';
  import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
  import AccountInfo from '../Pages/User/Account/Account';
  import MyVehicles from '../Pages/User/Vehicles/VehicleDetails';
  import MyBookings from './User/Bookings/BookingDetails';
  import MyReviews from './User/Reviews/ReviewDetails';
  import MyPackageBookings from './User/PackageBookings/PackageBookings';
  import ServiceHelpRequests from './User/ServiceHelpRequests/ServiceHelpRequests';
  import '../Styles/UserProfile.css';
  import AccessDenied from '../Components/AccessDenied/AccesDenid';
  import { AuthContext } from '../context/AuthContext';
import ManageServiceRequests from './User/ServiceHelpRequests/ManageServiceRequests';
  const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('account');
    const { user } = useContext(AuthContext);

    if (user.email.includes('employee')) {
      return <AccessDenied />;
    }

    return (
      <Container fluid className="user-profile-container mt-0">
        <Row className="min-vh-100">
          <Col md={2} className="sidebarr d-flex flex-column">
            <Nav variant="pills" className="flex-column flex-grow-1">
              <h5 className='top_name d-flex align-items-center py-2 px-3 user-profile-heading'>My Account</h5>
              <Nav.Item className="mb-3">
                  <Nav.Link
                    eventKey="account"
                    active={activeTab === 'account'}
                    onClick={() => setActiveTab('account')}
                    className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                  >
                    <i className="fas fa-user-circle me-2"></i>
                    Account
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                  <Nav.Link
                    eventKey="vehicles"
                    active={activeTab === 'vehicles'}
                    onClick={() => setActiveTab('vehicles')}
                    className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                  >
                    <i className="fas fa-car me-2"></i>
                    My Vehicles
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                  <Nav.Link
                    eventKey="bookings"
                    active={activeTab === 'bookings'}
                    onClick={() => setActiveTab('bookings')}
                    className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    My Appoinments
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                  <Nav.Link
                    eventKey="reviews"
                    active={activeTab === 'reviews'}
                    onClick={() => setActiveTab('reviews')}
                    className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                  >
                    <i className="fas fa-star me-2"></i>
                    My Reviews
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                  <Nav.Link
                    eventKey="packagebookings"
                    active={activeTab === 'packageBookings'}
                    onClick={() => setActiveTab('packageBookings')}
                    className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                  >
                    <i className="fas fa-star me-2"></i>
                    My Package Bookings
                  </Nav.Link>
                </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link
                  eventKey="addServiceHelp"
                  active={activeTab === 'addServiceHelp'}
                  onClick={() => setActiveTab('addServiceHelp')}
                  className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                >
                  <i className="fas fa-hands-helping me-2"></i>
                  Add Help Requests
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-3">
                <Nav.Link
                  eventKey="serviceHelp"
                  active={activeTab === 'serviceHelp'}
                  onClick={() => setActiveTab('serviceHelp')}
                  className="d-flex align-items-center py-2 px-3 rounded-pill transition-all hover:bg-primary hover:text-white"
                >
                  <i className="fas fa-hands-helping me-2"></i>
                  Help Requests
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={10}>
            <Tab.Content className="tab-contents">
              <Tab.Pane active={activeTab === 'account'}>
                <AccountInfo />
              </Tab.Pane>
              <Tab.Pane active={activeTab === 'vehicles'}>
                <MyVehicles />
              </Tab.Pane>
              <Tab.Pane active={activeTab === 'bookings'}>
                <MyBookings />
              </Tab.Pane>
              <Tab.Pane active={activeTab === 'reviews'}>
                <MyReviews />
              </Tab.Pane>
              <Tab.Pane active={activeTab === 'packageBookings'}>
                <MyPackageBookings />
              </Tab.Pane>
              <Tab.Pane active={activeTab === 'addServiceHelp'}>
                <ServiceHelpRequests />
              </Tab.Pane>
              <Tab.Pane active={activeTab === 'serviceHelp'}>
                <ManageServiceRequests />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    );
  };

  export default UserProfile;