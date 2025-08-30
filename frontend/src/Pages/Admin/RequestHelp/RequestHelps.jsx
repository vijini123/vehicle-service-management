import React, { useState, useEffect } from 'react';
import { Table, Button, Card, CardBody, CardHeader, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSync, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { BASE_URL } from '../../../Utils/config';
import { message } from 'antd';
import 'leaflet/dist/leaflet.css';

const ManageServiceHelp = () => {
  const [requests, setRequests] = useState([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/service-help-requests`);
      setRequests(response.data);
    } catch (error) {
      message.error('Failed to fetch service help requests');
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsMapModalOpen(true);
  };

  const handleDeleteRequest = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/service-help-requests/${id}`);
      message.success('Request deleted successfully');
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      message.error('Failed to delete request');
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow">
        <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Service Help Requests</h3>
          <Button color="light" onClick={fetchRequests}>
            <FontAwesomeIcon icon={faSync} className="mr-2" /> Refresh
          </Button>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Description</th>
                <th>Location</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.userName}</td>
                  <td>{request.email}</td>
                  <td>{request.description}</td>
                  <td>
                    <Button
                      color="link"
                      onClick={() => handleLocationClick(request.location)}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      View Location
                    </Button>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      onClick={() => handleDeleteRequest(request._id)}
                      style={{ backgroundColor: '#dc3545', color: '#fff', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isMapModalOpen} toggle={() => setIsMapModalOpen(!isMapModalOpen)} size="lg">
        <ModalHeader toggle={() => setIsMapModalOpen(!isMapModalOpen)}>Request Location</ModalHeader>
        <ModalBody>
          {selectedLocation && (
            <MapContainer center={[selectedLocation.lat, selectedLocation.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            </MapContainer>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ManageServiceHelp;