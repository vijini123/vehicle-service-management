import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import { BASE_URL } from '../../../Utils/config';
import {message} from 'antd'
import PdfGenerator from '../../../Utils/Pdfs/SupplierPDF'

const SupplierDetails = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState({
    name: '',
    email: '',
    contact: '',
    type: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setFilteredSuppliers(
      suppliers.filter(supplier =>
        Object.values(supplier).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, suppliers]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/supplier`);
      setSuppliers(response.data);
      setFilteredSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    }
  };

  const toggle = () => {
    setModal(!modal);
    setErrors({});
  };

  const handleInputChange = (e) => {
    setCurrentSupplier({ ...currentSupplier, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
//search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
//validation
  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!currentSupplier.name.trim()) {
      errors.name = 'Name is required';
      formIsValid = false;
    }

    if (!currentSupplier.email.trim()) {
      errors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(currentSupplier.email)) {
      errors.email = 'Email is invalid';
      formIsValid = false;
    }

    if (!currentSupplier.contact.trim()) {
      errors.contact = 'Phone number is required';
      formIsValid = false;
    } else if (!/^\d{10}$/.test(currentSupplier.contact)) {
      errors.contact = 'Phone number must be 10 digits';
      formIsValid = false;
    }

    if (!currentSupplier.city.trim()) {
      errors.city = 'Address is required';
      formIsValid = false;
    }

    if (!currentSupplier.type) {
      errors.type = 'Supplier type is required';
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleAddSupplier = async () => {
    if (validateForm()) {
      try {
        await axios.post(`${BASE_URL}/supplier`, currentSupplier);
        fetchSuppliers();
        toggle();
        message.success("Supplier added successfully")
      } catch (error) {
        toast.error('Failed to add supplier');
      }
    }
  };

  const handleUpdateSupplier = async () => {
    if (validateForm()) {
      try {
        await axios.post(`${BASE_URL}/supplier/${currentSupplier._id}`, currentSupplier);
        fetchSuppliers();
        toggle();
        message.success("Supplier updated successfully")
      } catch (error) {
        toast.error('Failed to update supplier');
      }
    }
  };

  const handleDeleteSupplier = async (id) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        await axios.delete(`${BASE_URL}/supplier/${id}`);
        fetchSuppliers();
        message.success("Supplier deleted successfully")
      } catch (error) {
        toast.error('Failed to delete supplier');
      }
    });
  };

  const openUpdateModal = (supplier) => {
    setCurrentSupplier(supplier);
    setIsEditing(true);
    toggle();
  };
//pdf export
  const handleExportPDF = () => {
    const headers = ['Name', 'Email', 'City', 'Type', 'Contact'];
    const data = filteredSuppliers.map(supplier => [
      supplier.name,
      supplier.email,
      supplier.city,
      supplier.type,
      supplier.contact
    ]);
    
    const title = 'Supplier Details';
    const generatedDate = new Date().toLocaleString();
    const numberOfItems = filteredSuppliers.length;

    PdfGenerator.generatePdf(data, title, headers, numberOfItems, generatedDate);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Supplier Details</h2>
      <div className="d-flex justify-content-between mb-3">
        <Button size="sm" style={{backgroundColor: 'rgb(1, 126, 175)', borderColor: 'rgb(1, 126, 175)'}} onClick={() => { setIsEditing(false); setCurrentSupplier({}); toggle(); }}>
          <FaPlus /> Add New Supplier
        </Button>
        <div className="d-flex">
          <Input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={handleSearch}
            className="mr-2"
            size="sm"
          />
          <Button color="success" size="sm" onClick={handleExportPDF}>
            <FaFileExport /> Export PDF
          </Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Type</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.name}</td>
              <td>{supplier.email}</td>
              <td>{supplier.city}</td>
              <td>{supplier.type}</td>
              <td>{supplier.contact}</td>
              <td>
                <Button color="warning" style={{marginRight: '5px',fontSize: '10px'}} onClick={() => openUpdateModal(supplier)} className="mr-2">
                  <FaEdit /> Update
                </Button>
                <Button style={{backgroundColor: 'red', borderColor: 'red', marginLeft: '5px',fontSize: '10px'}}onClick={() => handleDeleteSupplier(supplier._id)} className="mr-2">
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEditing ? 'Update Supplier' : 'Add New Supplier'}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input 
                type="text" 
                name="name" 
                id="name" 
                value={currentSupplier.name || ''} 
                onChange={handleInputChange}
                invalid={!!errors.name}
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input 
                type="email" 
                name="email" 
                id="email" 
                value={currentSupplier.email || ''} 
                onChange={handleInputChange}
                invalid={!!errors.email}
              />
              <FormFeedback>{errors.email}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="contact">Phone</Label>
              <Input
                type="tel"
                name="contact"
                id="contact"
                value={currentSupplier.contact || ''}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                maxLength="10"
                title="Please enter a 10-digit phone number"
                invalid={!!errors.contact}
              />
              <FormFeedback>{errors.contact}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="city">Address</Label>
              <Input 
                type="textarea" 
                name="city" 
                id="city" 
                value={currentSupplier.city || ''} 
                onChange={handleInputChange}
                invalid={!!errors.city}
              />
              <FormFeedback>{errors.city}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="type">Supplier Type</Label>
              <Input type="select" name="type" id="type" value={currentSupplier.type || ''} onChange={handleInputChange} invalid={!!errors.type}>
                <option value="">Select a type</option>
                <option value="parts">Parts</option>
                <option value="tools">Tools</option>
                <option value="lubricants">Lubricants</option>
                <option value="tires">Tires</option>
              </Input>
              <FormFeedback>{errors.type}</FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={isEditing ? handleUpdateSupplier : handleAddSupplier}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SupplierDetails;
