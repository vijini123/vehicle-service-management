import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CusSwal from '../../../Utils/CustomSwal/CusSwal';
import { BASE_URL } from '../../../Utils/config';
import {message} from 'antd'
import PdfGenerator from '../../../Utils/Pdfs/SupplierPDF';

const InventoryDetails = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    quantity: '',
    price: '',
    type: '',
    brand: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/supplier`);
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    }
  };
  useEffect(() => {
    setFilteredInventory(
      inventory.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, inventory]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/inventory`);
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
      }
    };

    const renderTypeCell = (type) => {
      return (
        <td>
          {type.split('|').join(' - ')}
        </td>
      );
    };

  const toggle = () => {
    setModal(!modal);
    setErrors({});
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'type') {
      const [name, email, type] = e.target.value.split('|');
      setCurrentItem({ ...currentItem, type: `${name}|${email}|${type}` });
    } else {
      setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
    }
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!currentItem.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!currentItem.quantity || currentItem.quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
      isValid = false;
    }

    if (!currentItem.price || currentItem.price <= 0) {
      newErrors.price = 'Price must be a positive number';
      isValid = false;
    }

    if (!currentItem.type) {
      newErrors.type = 'Type is required';
      isValid = false;
    }

    if (!currentItem.brand.trim()) {
      newErrors.brand = 'Brand is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddItem = async () => {
    if (validateForm()) {
      try {
        await axios.post(`${BASE_URL}/inventory`, currentItem);
        fetchInventory();
        toggle();
        message.success("Item added successfully")
      } catch (error) {
        toast.error('Failed to add item');
      }
    }
  };

  const handleUpdateItem = async () => {
    if (validateForm()) {
      try {
        await axios.post(`${BASE_URL}/inventory/${currentItem._id}`, currentItem);
        fetchInventory();
        toggle();
        message.success("Item updated successfully");

        if (currentItem.quantity <= 10) {
          const [supplierName, supplierEmail, supplierType] = currentItem.type.split('|');
          await axios.post(`${BASE_URL}/email/send-low-inventory-alert`, {
            supplierEmail,
            itemName: currentItem.name,
            quantity: currentItem.quantity
          });
          message.info(`Supplier ${supplierName} has been notified about low inventory`);
        }
      } catch (error) {
        toast.error('Failed to update item');
      }
    }
  };

  const handleDeleteItem = async (id) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        await axios.delete(`${BASE_URL}/inventory/${id}`);
        fetchInventory();
        message.success("Item deleted successfully")
      } catch (error) {
        toast.error('Failed to delete item');
      }
    });
  };

  const openUpdateModal = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
    toggle();
  };
//genarate pdf
  const handleExportPDF = () => {
    const headers = ['Name', 'Quantity', 'Price', 'Type', 'Brand'];
    const data = filteredInventory.map(item => [
      item.name,
      item.quantity,
      item.price,
      item.type,
      item.brand
    ]);
    const title = 'Inventory Details';
    const generatedDate = new Date().toLocaleString();
    const numberOfItems = filteredInventory.length;

    PdfGenerator.generatePdf(data, title, headers, numberOfItems, generatedDate);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Inventory Details</h2>
      <div className="d-flex justify-content-between mb-3">
        <Button size='sm' style={{backgroundColor: 'rgb(1, 126, 175)', borderColor: 'rgb(1, 126, 175)'}} onClick={() => { setIsEditing(false); setCurrentItem({}); toggle(); }}>
          <FaPlus /> Add New Item
        </Button>
        <div className="d-flex">
          <Input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={handleSearch}
            className="mr-2"
          />
          <Button color="success" size='sm' onClick={handleExportPDF}>
            <FaFileExport /> Export PDF
          </Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Supplier Name</th>
            <th>Supplier Email</th>
            <th>Supplier Type</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.type.split('|')[0]}</td>
              <td>{item.type.split('|')[1]}</td>
              <td>{item.type.split('|')[2]}</td>
              <td>{item.brand}</td>
              <td>{item.price}</td>
              <td>
                <Button color="warning" style={{marginRight: '5px'}} onClick={() => openUpdateModal(item)} className="mr-2">
                  <FaEdit /> Update
                </Button>
                <Button style={{backgroundColor: 'red', borderColor: 'red', marginLeft: '5px'}} onClick={() => handleDeleteItem(item._id)} className="mr-2">
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEditing ? 'Update Item' : 'Add New Item'}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Item Name</Label>
              <Input type="text" name="name" id="name" value={currentItem.name || ''} onChange={handleInputChange} required invalid={!!errors.name} />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="type">Supplier</Label>
              <Input 
                type="select" 
                name="type" 
                id="type" 
                value={currentItem.type || ''} 
                onChange={handleInputChange} 
                invalid={!!errors.type}
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={`${supplier.name}|${supplier.email}|${supplier.type}`}>
                    {`${supplier.name} - ${supplier.email} - ${supplier.type}`}
                  </option>
                ))}
              </Input>
              <FormFeedback>{errors.type}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="quantity">Item Quantity</Label>
              <Input type="number" name="quantity" id="quantity" value={currentItem.quantity || ''} onChange={handleInputChange} invalid={!!errors.quantity} />
              <FormFeedback>{errors.quantity}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="price">Item Price</Label>
              <Input type="number" name="price" id="price" value={currentItem.price || ''} onChange={handleInputChange} invalid={!!errors.price} />
              <FormFeedback>{errors.price}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="brand">Item Brand</Label>
              <Input type="text" name="brand" id="brand" value={currentItem.brand || ''} onChange={handleInputChange} invalid={!!errors.brand} />
              <FormFeedback>{errors.brand}</FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={isEditing ? handleUpdateItem : handleAddItem}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default InventoryDetails;
