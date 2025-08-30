import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPaperPlane, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BASE_URL } from '../../../Utils/config';
import { message } from 'antd';
import { AuthContext } from '../../../context/AuthContext.js';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ServiceHelpRequests = () => {
  const colomboCoordinates = [6.9271, 79.8612]; // Coordinates for Colombo, Sri Lanka
  const [newRequest, setNewRequest] = useState({ description: '', location: { lat: colomboCoordinates[0], lng: colomboCoordinates[1] } });
  const { user } = useContext(AuthContext);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...newRequest,
        userName: user.username,
        email: user.email
      };

      await axios.post(`${BASE_URL}/service-help-requests`, requestData);
      message.success('Request sent successfully');
      setNewRequest({ description: '', location: { lat: colomboCoordinates[0], lng: colomboCoordinates[1] } });
    } catch (error) {
      message.error('Failed to send request');
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setNewRequest(prev => ({ ...prev, location: e.latlng }));
      },
    });

    return newRequest.location ? (
      <Marker position={[newRequest.location.lat, newRequest.location.lng]} />
    ) : null;
  };

  return (
    <div className="service-help-requests container mt-4">
      <Card className="shadow">
        <CardHeader className="bg-primary text-white">
          <h3><FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Submit Service Help Request</h3>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label><FontAwesomeIcon icon={faUser} className="mr-2" /> User Name</Label>
              <Input type="text" value={user.username} disabled />
            </FormGroup>
            <FormGroup>
              <Label><FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Email</Label>
              <Input type="email" value={user.email} disabled />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Describe your service need..."
              />
            </FormGroup>
            <FormGroup>
              <Label><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Select Location</Label>
              <div style={{ height: '300px', width: '100%', marginBottom: '1rem' }}>
                <MapContainer 
                  center={colomboCoordinates} 
                  zoom={8} 
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={setMap}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
            </FormGroup>
            <Button color="primary" type="submit" block>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Send Request
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ServiceHelpRequests;