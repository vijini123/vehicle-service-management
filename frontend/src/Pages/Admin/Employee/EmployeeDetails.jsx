import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import { BASE_URL } from '../../../Utils/config';
import {message} from 'antd'
import PdfGenerator from '../../../Utils/Pdfs/EmployeePDF'

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    name: '',
    email: '',
    type: '',
    contact: '',
    passport: '',
    address: '',
    nic: '',
    age: '',
    salary: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(employee =>
        Object.values(employee).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employee`);
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const toggle = () => {
    setModal(!modal);
    setErrors({});
  };

  const handleInputChange = (e) => {
    setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let salary = '';
    switch (type) {
      case 'detailer': salary = '50000'; break;
      case 'manager': salary = '80000'; break;
      case 'advisor': salary = '85000'; break;
      case 'technicians': salary = '75000'; break;
      case 'specialist': salary = '88000'; break;
      case 'administrative': salary = '125000'; break;
      default: salary = '';
    }
    setCurrentEmployee({ ...currentEmployee, type, salary });
    setErrors({ ...errors, type: '' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!currentEmployee.name) formErrors.name = 'Name is required';
    if (!currentEmployee.email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(currentEmployee.email)) formErrors.email = 'Email is invalid';
    if (!currentEmployee.type) formErrors.type = 'Employee type is required';
    if (!currentEmployee.contact) formErrors.contact = 'Contact number is required';
    else if (!/^\d{10}$/.test(currentEmployee.contact)) formErrors.contact = 'Contact number should be 10 digits';
    if (!currentEmployee.address) formErrors.address = 'Address is required';
    if (!currentEmployee.nic) formErrors.nic = 'NIC number is required';
    if (!currentEmployee.age) formErrors.age = 'Age is required';
    else if (currentEmployee.age < 18 || currentEmployee.age > 65) formErrors.age = 'Age should be between 18 and 65';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (validateForm()) {
      try {
        await axios.post(`${BASE_URL}/employee`, currentEmployee);
        fetchEmployees();
        toggle();
        message.success("Employee added successfully")
      } catch (error) {
        toast.error('Failed to add employee');
      }
    }
  };

  const handleUpdateEmployee = async () => {
    if (validateForm()) {
      try {
        await axios.post(`${BASE_URL}/employee/${currentEmployee._id}`, currentEmployee);
        fetchEmployees();
        toggle();
        message.success("Employee updated successfully")
      } catch (error) {
        toast.error('Failed to update employee');
      }
    }
  };

  const handleDeleteEmployee = async (id) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        await axios.delete(`${BASE_URL}/employee/${id}`);
        fetchEmployees();
        message.success("Employee deleted successfully")
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    });
  };

  const openUpdateModal = (employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    toggle();
  };

  const handleExportPDF = () => {
    const headers = ['Name', 'Email', 'Type', 'Contact', 'Address', 'NIC', 'Age', 'Salary'];
    const data = filteredEmployees;
    const title = 'Employee Details';
  
    PdfGenerator.generatePdf(data, title, headers);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Employee Details</h2>
      <div className="d-flex justify-content-between mb-3">
        <Button style={{backgroundColor: 'rgb(119, 255, 8)', color:'black',height: '40px', width:'15%'}} size="sm" onClick={handleExportPDF}>
          Generate PDF
        </Button>
        <div className="d-flex">
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
            className="mr-2"
            size="sm"
            style={{height: '40px', width:'100%'}}
          />
          <Button size="sm" style={{backgroundColor: 'rgb(22, 112, 0)', borderColor: 'rgb(22, 112, 0)', height: '40px', width:'100%', marginLeft:'10px'}} onClick={() => { setIsEditing(false); setCurrentEmployee({}); toggle(); }}>
            <FaPlus /> Add New Employee
          </Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Contact</th>
            <th>Address</th>
            <th>NIC</th>
            <th>Passport</th>
            <th>Age</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.type}</td>
              <td>{employee.contact}</td>
              <td>{employee.address}</td>
              <td>{employee.nic}</td>
              <td>{employee.passport}</td>
              <td>{employee.age}</td>
              <td>{employee.salary}</td>
              <td>
                <Button style={{marginbottom: '5px',fontSize: '10px', backgroundColor:'rgb(0, 90, 112)'}} onClick={() => openUpdateModal(employee)} className="mr-2">
                  <FaEdit /> Update
                </Button>
                <Button style={{backgroundColor: 'red', borderColor: 'red', marginTop: '5px',fontSize: '10px'}} onClick={() => handleDeleteEmployee(employee._id)} className="mr-2">
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEditing ? 'Update Employee' : 'Add New Employee'}</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input type="text" name="name" id="name" value={currentEmployee.name || ''} onChange={handleInputChange} required 
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="email" name="email" id="email" value={currentEmployee.email || ''} onChange={handleInputChange} required 
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="type">Employee Type</Label>
                  <Input type="select" name="type" id="type" value={currentEmployee.type || ''} onChange={handleTypeChange} required 
                    className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', appearance: 'none'}}>
                    <option value="" disabled>Select employee type</option>
                    <option value="detailer">Detailer</option>
                    <option value="manager">Service Manager</option>
                    <option value="advisor">Service Advisor</option>
                    <option value="technicians">Technicians</option>
                    <option value="specialist">Parts Specialist</option>
                    <option value="administrative">Administrative Staff</option>
                  </Input>
                  {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="contact">Contact Number</Label>
                  <Input type="text" name="contact" id="contact" value={currentEmployee.contact || ''} onChange={handleInputChange} required 
                    className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                  {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input type="textarea" name="address" id="address" value={currentEmployee.address || ''} onChange={handleInputChange} required 
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', minHeight: '100px'}} />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="nic">NIC Number</Label>
                  <Input type="text" name="nic" id="nic" value={currentEmployee.nic || ''} onChange={handleInputChange} required 
                    className={`form-control ${errors.nic ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                  {errors.nic && <div className="invalid-feedback">{errors.nic}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="passport">passport Number</Label>
                  <Input type="text" name="passport" id="passport" value={currentEmployee.passport || ''} onChange={handleInputChange} required 
                    className={`form-control`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                </FormGroup>
                <FormGroup>
                  <Label for="age">Age</Label>
                  <Input type="number" name="age" id="age" value={currentEmployee.age || ''} onChange={handleInputChange} required 
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </FormGroup>
                <FormGroup>
                  <Label for="salary">Salary (LKR)</Label>
                  <Input type="number" name="salary" id="salary" value={currentEmployee.salary || ''} onChange={handleInputChange} disabled 
                    className="form-control" 
                    style={{borderRadius: '10px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: '#f8f9fa'}} />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button 
          style={{backgroundColor: 'rgb(0, 99, 142)', borderColor: 'rgb(0, 99, 142)', paddingLeft: '25px', paddingRight: '25px',fontSize: '17px'}}
           onClick={isEditing ? handleUpdateEmployee : handleAddEmployee}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EmployeeDetails;
