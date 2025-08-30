  import React, { useState, useEffect, useContext } from 'react';
  import { Container, Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
  import $ from 'jquery';
  import axios from 'axios';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import './Account.css';
  import { BASE_URL } from '../../Utils/config';
import { AuthContext } from '../../context/AuthContext';
import Toaster from '../../Utils/Toaster';
import CusSwal from '../../Utils/CustomSwal/CusSwal';
import { Navigate } from 'react-router-dom';
import {message} from 'antd'
  const Account = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [adminname, setAdminName] = useState()
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      // Simulating API call to fetch users
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BASE_URL}/users`);
          if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            console.error('Received non-array data:', response.data);
            setUsers(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
      // Enhanced jQuery animations
      $('.admin-card').addClass('animated fadeInDown');
      $('.users-table').addClass('animated fadeInUp');

      // Add hover effects
      $('.admin-card, .users-table').hover(
        function() { $(this).css('transform', 'scale(1.02)'); },
        function() { $(this).css('transform', 'scale(1)'); }
      );

      // Animate table rows
      $('.users-table tbody tr').each(function(index) {
        $(this).css('animation-delay', `${index * 0.1}s`);
        $(this).addClass('animated fadeInUp');
      });

      setAdminName(user.username);
    }, [user.username]);
    

    const handleUpdate = async () => {
      setShowModal(true);
    };
    
    const handleSaveChanges = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/user/${user._id}`, {
          username: adminname
        });
        if (response.data) {
          dispatch({ type: 'UPDATE_USER', payload: response.data });
          Toaster.justToast('success', 'Admin details updated successfully');
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error updating admin details:', error);
        Toaster.justToast('error', 'Failed to update admin details');
      }
    };
    

    const handleDelete = () => {
      if (window.confirm('Are you sure you want to delete this account?')) {
        message.error("You cannot delete your self")
      }
    };

    const handleUserDelete = async (userId) => {
      console.log(userId);
      CusSwal.deleteConfiramation(async () => {
        try {
          console.log(userId);
          await axios.delete(`${BASE_URL}/users/${userId}`);
          message.success('User deleted successfully');
          const response = await axios.get(`${BASE_URL}/users`);
          if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            setUsers(response.data.data);
          }
        } catch (err) {
          console.error(err);
          Toaster.justToast('error', 'Failed to delete user');
        }
      });
    };

    return (
      <Container fluid className="admin-account-container">
        <Row>
          <Col md={4}>
            <Card className="admin-card mb-4">
              <Card.Body>
                <Card.Title className="text-center mb-4">Admin Account</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {user.username}<br />
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Role:</strong> {user.role}
                </Card.Text>
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="primary" className="btn-update" onClick={handleUpdate}>Update</Button>
                  <Button variant="danger" className="btn-delete" onClick={handleDelete}>Delete</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="users-table">
              <Card.Body>
                <Card.Title className="text-center mb-4">Registered Users</Card.Title>
                <Table striped bordered hover responsive className="table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registration Date</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                  {loading ? (
                    <tr><td colSpan="4">Loading...</td></tr>
                    ) : Array.isArray(users) && users.length > 0 ? (
                    users
                    .filter(user => user.email !== 'admin@gmail.com')
                    .map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button className='btn btn-danger' onClick={() => handleUserDelete(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                    ) : (
                    <tr><td colSpan="4">No users found</td></tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Admin Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAdminName">
                <Form.Label>Admin Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new admin name"
                  value={adminname}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </Form.Group>
              {/* Add more form fields here if needed */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };

  export default Account;