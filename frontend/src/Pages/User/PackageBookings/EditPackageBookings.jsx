import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Select} from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../Utils/config';

const UpdatePackageBooking = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/packageBooking/${id}`);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch booking details');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/packageBooking/${id}`, values);
      message.success('Booking updated successfully');
      navigate(-1);
    } catch (error) {
      message.error('Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Update Package Booking</h1>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="email" label="Email"  rules={[{ required: true, type: 'email' }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="vehicleType" label="Vehicle Type" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="car">Car</Select.Option>
            <Select.Option value="van">Van</Select.Option>
            <Select.Option value="bus">Bus</Select.Option>
            <Select.Option value="lorry">Lorry</Select.Option>
            <Select.Option value="jeep">Jeep</Select.Option>
            <Select.Option value="motorcycle">Motorcycle</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="title" label="Package Name" rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="description" label="Package Description" rules={[{ required: true }]}>
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item name="price" label="Package Price" rules={[{ required: true }]}>
          <Input type="number" disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Booking
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePackageBooking;
