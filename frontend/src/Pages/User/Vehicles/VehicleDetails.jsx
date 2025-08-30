import React, { useEffect, useState, useContext } from 'react';
import Toaster from '../../../Utils/Toaster';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import PdfGenerator from '../../../Utils/Pdfs/PdfGenerator';
import ResponseHandler from '../../../Utils/ResponseHandler';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';

export default function VehicleManage() {
  const { user, dispatch } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
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
      const response = await axios.get(`${BASE_URL}/vehicle?email=${user.email}`);
      setVehicles(response.data.filter((vehicles) => vehicles.email === user.email));
      setFilteredVehicles(response.data.filter((vehicles) => vehicles.email === user.email));
      console.log(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
      Toaster.dismissLoadingToast();
    }
  };

  const generatePdf = () => {
    Toaster.loadingToast('Generating Pdf');
    try {
      const headers = ['Name', 'Email', 'Type', 'Number', 'Front Tyre', 'Rear Tyre', 'Brand', 'Last Service', 'Fuel Type', 'Mileage', 'Manufacture'];
      PdfGenerator.generatePdf(filteredVehicles, "Filtered Vehicles List", headers);
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
    const filteredVehicles = vehicles.filter((vehicle) =>
      Object.values(vehicle).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredVehicles(filteredVehicles);
  };
  

  const handleVehicleEdit = (vehicle) => {
    console.log(vehicle._id);
    navigate(`/vehicles/edit/${vehicle._id}`);
    setIsEditing(true);
  };

  const handleDelete = async (vehicleId) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        console.log(vehicleId);
        await axios.delete(`${BASE_URL}/vehicle/${vehicleId}`);
        setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleId));
        setFilteredVehicles(filteredVehicles.filter(vehicle => vehicle._id !== vehicleId));
        Toaster.justToast('success', 'Vehicle deleted successfully');
      } catch (err) {
        console.error(err);
        Toaster.justToast('error', 'Failed to delete Vehicle');
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
                  navigate(`/vehicleAdd`);
              }}>Add New</button>
         </div>
              <div className="card-body p-4">
                <h3>My Vehicles</h3>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Number</th>
                        <th>Front Tyre</th>
                        <th>Reear Tyre</th>
                        <th>Brand</th>
                        <th>Last service</th>
                        <th>Fuel type</th>
                        <th>Milage</th>
                        <th>Manufacture</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    {filteredVehicles && filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td>{vehicle.name}</td>
                          <td>{vehicle.email}</td>
                          <td>{vehicle.type}</td>
                          <td>{vehicle.number}</td>
                          <td>{vehicle.front}</td>
                          <td>{vehicle.rear}</td>
                          <td>{vehicle.brand}</td>
                          <td>{new Date(vehicle.serviceDate).toLocaleDateString()}</td>
                          <td>{vehicle.fuel}</td>
                          <td>{vehicle.milage}</td>
                          <td>{vehicle.manufacture}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleVehicleEdit(vehicle, vehicle._id)}
                               style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px', borderRadius: '5px', backgroundColor: 'rgb(0, 87, 163)', borderColor: '#4CAF50' }}

                            >
                              Update
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(vehicle._id)}
                              style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#f44336', borderColor: '#f44336' }}

                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))) : (
                        <tr>
                          <td colSpan={6}>No vehicles found.</td>
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