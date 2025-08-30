import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, message, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthContext } from '../../../context/AuthContext';

const PackageBookings = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/packageBooking?email=${user.email}`);
      setBookings(response.data.filter((packageBooking) => packageBooking.email === user.email));
      setFilteredBookings(response.data.filter((packageBooking) => packageBooking.email === user.email));
    } catch (error) {
      message.error('Failed to fetch package bookings');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/editPackageBooking/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/packageBooking/${id}`);
      message.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      message.error('Failed to delete booking');
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = bookings.filter(
      (booking) =>
        booking.title.toLowerCase().includes(value.toLowerCase()) ||
        booking.vehicleType.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBookings(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Package Bookings Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
  
    // Add custom header
    doc.text('Generated on: ' + new Date().toLocaleString(), 14, 30);
    doc.text('Total Bookings: ' + filteredBookings.length, 14, 36);
  
    // Define the columns
    const tableColumn = ["Name", "Email", "Vehicle Type", "Package Name", "Description", "Price"];
    const tableRows = [];
  
    // Add data to rows
    filteredBookings.forEach(booking => {
      const bookingData = [
        booking.name,
        booking.email,
        booking.vehicleType,
        booking.title,
        booking.description,
        booking.price
      ];
      tableRows.push(bookingData);
    });
  
    // Add the table to the document
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  
    doc.save('package_bookings_report.pdf');
  };
  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vehicle Type',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: 'Package id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Package name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Package Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Package Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => handleUpdate(record._id)} type="primary" style={{ marginRight: 8 }}>
            Update
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="primary" danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>My Package Bookings</h1>
      <Input.Search
        placeholder="Search by package title or vehicle type"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button onClick={exportToPDF} type="primary" style={{ marginBottom: 16, marginLeft: 8 }}>
        Export to PDF
      </Button>
      <Table columns={columns} dataSource={filteredBookings} rowKey="_id" />
    </div>
  );
};

export default PackageBookings;
