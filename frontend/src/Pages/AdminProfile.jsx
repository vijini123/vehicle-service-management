import React, { useState,useContext } from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import AccountInfo from '../Pages/Admin/Account';
import ManageVehicles from '../Pages/User/Vehicles/VehicleDetails';
import ManageInventory from './Admin/Inventory/InventoryDetails';
import ManageEmployee from './Admin/Employee/EmployeeDetails';
import ManageSupplier from './Admin/Supplier/SupplierDetails'
import Dashboard from './Admin/Dashboard';
import { AuthContext } from '../context/AuthContext';
import Access from '../Components/AccessDenied/AccesDenid';
import ManageHelpRequests from './Admin/RequestHelp/RequestHelps'

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useContext(AuthContext);

    if (user.email !== 'admin@gmail.com') {
        return <Access/>;
    }

  return (
    <Container fluid className="mt-4">
      <Row className="min-vh-100">
        <Col md={3} lg={2} className="bg-dark text-white p-0">
          <Nav variant="pills" className="flex-column">
            <h4 className='d-flex align-items-center py-3 px-3 bg-primary'>Admin Dashboard</h4>
            <Nav.Item>
              <Nav.Link
                eventKey="dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
                className="d-flex align-items-center py-3 px-3 text-white hover-bg-primary"
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="account"
                active={activeTab === 'account'}
                onClick={() => setActiveTab('account')}
                className="d-flex align-items-center py-3 px-3 text-white hover-bg-primary"
              >
                <i className="fas fa-user-circle me-2"></i>
                Account
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="inventory"
                active={activeTab === 'inventory'}
                onClick={() => setActiveTab('inventory')}
                className="d-flex align-items-center py-3 px-3 text-white hover-bg-primary"
              >
                <i className="fas fa-car me-2"></i>
                Manage Inventory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="suppliers"
                active={activeTab === 'suppliers'}
                onClick={() => setActiveTab('suppliers')}
                className="d-flex align-items-center py-3 px-3 text-white hover-bg-primary"
              >
                <i className="fas fa-calendar-alt me-2"></i>
                Manage Supplier
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="employee"
                active={activeTab === 'employee'}
                onClick={() => setActiveTab('employee')}
                className="d-flex align-items-center py-3 px-3 text-white hover-bg-primary"
              >
                <i className="fas fa-star me-2"></i>
                Manage Employee
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="helpRequests"
                active={activeTab === 'helpRequests'}
                onClick={() => setActiveTab('helpRequests')}
                className="d-flex align-items-center py-3 px-3 text-white hover-bg-primary"
              >
                <i className="fas fa-star me-2"></i>
                Manage Help Requests
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} lg={10} className="bg-light">
          <Tab.Content className="p-4">
            <Tab.Pane active={activeTab === 'dashboard'}>
              <Dashboard />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'account'}>
              <AccountInfo />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'inventory'}>
              <ManageInventory />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'suppliers'}>
              <ManageSupplier />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'employee'}>
              <ManageEmployee />
            </Tab.Pane>
            <Tab.Pane active={activeTab === 'helpRequests'}>
              <ManageHelpRequests />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminProfile;