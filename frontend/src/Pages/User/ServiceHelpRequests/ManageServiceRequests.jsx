import React, { useState, useEffect, useContext } from 'react';
import { Button, Table, Card, CardBody, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faExclamationTriangle, faMapMarkerAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { BASE_URL } from '../../../Utils/config';
import { message } from 'antd';
import { AuthContext } from '../../../context/AuthContext.js';

const ManageServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/service-help-requests`);
      if (response.data && Array.isArray(response.data)) {
        const userRequests = response.data.filter(request => request.email === user.email);
        setRequests(userRequests);
        console.log(userRequests)
      } else {
        setRequests([]);
      }
    } catch (error) {
      message.error('Failed to fetch service help requests');
      setRequests([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/service-help-requests/${id}`, {
        data: { userName: user.username }
      });
      message.success('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      message.error('Failed to delete request');
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/service-help-requests/${editingRequest._id}`, editingRequest);
      message.success('Request updated successfully');
      setIsModalOpen(false);
      fetchRequests();
    } catch (error) {
      message.error('Failed to update request');
    }
  };
  
  const getRemainingTime = (createdAt) => {
    const timeDiff = 30 * 60 * 1000 - (Date.now() - new Date(createdAt));
    if (timeDiff <= 0) return 'Time expired';
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = ((timeDiff % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setEditingRequest(prev => ({
          ...prev,
          location: { lat: e.latlng.lat, lng: e.latlng.lng }
        }));
      },
    });

    return editingRequest ? (
      <Marker position={[editingRequest.location.lat, editingRequest.location.lng]} />
    ) : null;
  };

  return (
    <div className="manage-service-requests container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3><FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" /> Your Service Help Requests</h3>
        <Button color="primary" onClick={fetchRequests}>
          <FontAwesomeIcon icon={faSync} className="mr-2" /> Refresh
        </Button>
      </div>
      <Card className="shadow">
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Description</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Remaining Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.description}</td>
                  <td>
                    {request.location && request.location.lat && request.location.lng
                      ? `${request.location.lat.toFixed(4)}, ${request.location.lng.toFixed(4)}`
                      : 'Location not available'}
                  </td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>{getRemainingTime(request.createdAt)}</td>
                  <td>
                    {Date.now() - new Date(request.createdAt) < 30 * 60 * 1000 && (
                      <>
                        <Button color="warning" style={{marginRight: '5px',fontSize: '10px'}} onClick={() => handleEdit(request)} className="mr-2">
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </Button>
                        <Button style={{backgroundColor: 'red', borderColor: 'red', marginLeft: '5px',fontSize: '10px'}} onClick={() => handleDelete(request._id)}>
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Edit Request</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={editingRequest?.description || ''}
                onChange={(e) => setEditingRequest(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Location</Label>
              {editingRequest && (
                <MapContainer center={[editingRequest.location.lat, editingRequest.location.lng]} zoom={13} style={{ height: '200px', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              )}
              <p>Latitude: {editingRequest?.location.lat.toFixed(4)}, Longitude: {editingRequest?.location.lng.toFixed(4)}</p>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>Update</Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ManageServiceRequests;