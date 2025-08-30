import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config'
import Toaster from '../../../Utils/Toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Account = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({
    ...user,
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    contactN: user.contactN || '',
    city: user.city || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/users/${user._id}`, userDetails);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.data });
      setIsEditing(false);
      Toaster.justToast('success', 'Profile updated successfully');
    } catch (err) {
      console.error(err);
      Toaster.justToast('error', 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await axios.delete(`${BASE_URL}/users/${user._id}`);
        Toaster.updateLoadingToast('success', ' ❌ Successfully deleted!', () => navigate('/'));
        dispatch({ type: 'LOGOUT' });
        navigate('/')   
      } catch (err) {
        console.error(err);
        Toaster.justToast('error', 'Failed to delete account');
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={12}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h2>User Profile</h2>
                <div>
                  <Button variant="primary" onClick={() => setIsEditing(!isEditing)} className="me-2">
                    {isEditing ? 'Cancel' : 'Update'}
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>Delete Account</Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdate}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={userDetails.username} 
                      onChange={(e) => setUserDetails({...userDetails, username: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={userDetails.email} 
                      onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={userDetails.firstname} 
                      onChange={(e) => setUserDetails({...userDetails, firstname: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={userDetails.lastname} 
                      onChange={(e) => setUserDetails({...userDetails, lastname: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={userDetails.contactN} 
                      onChange={(e) => setUserDetails({...userDetails, contactN: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={userDetails.city} 
                      onChange={(e) => setUserDetails({...userDetails, city: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                  {isEditing && (
                    <Button variant="success" type="submit" className='btn-success'>Save Changes</Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Account;
