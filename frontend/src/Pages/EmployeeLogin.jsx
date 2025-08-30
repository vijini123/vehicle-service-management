import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Card, CardBody, InputGroup, InputGroupText } from 'reactstrap';
import { toast } from 'react-toastify';
import { FaEnvelope, FaIdCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../Utils/config'
import {message} from 'antd'

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [showNic, setShowNic] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/employee`);
      const employeesDB = response.data;
      const employee = employeesDB.find(emp => emp.email === email && emp.nic === nic);
      
      if (employee) {
        localStorage.setItem('employeeEmail', email);
        localStorage.setItem('employeeNic', nic);
        localStorage.setItem('employeeId', employee._id);
        message.success('Login successful!');
        navigate('/employeeProfile');
      } else {
        message.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      message.error('An error occurred. Please try again later.');
    }
  };

  return (
    <Container fluid className="bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col sm="12" md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody className="p-5">
              <h2 className="text-center mb-4">Employee Login</h2>
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <InputGroup>
                    <InputGroupText>
                      <FaEnvelope />
                    </InputGroupText>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <Label for="nic">NIC Number</Label>
                  <InputGroup>
                    <InputGroupText>
                      <FaIdCard />
                    </InputGroupText>
                    <Input
                      type={showNic ? "text" : "password"}
                      name="nic"
                      id="nic"
                      placeholder="Enter your NIC number"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      required
                    />
                    <Button color="secondary" onClick={() => setShowNic(!showNic)}>
                      {showNic ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </FormGroup>
                <Button color="primary" block className="mt-4">Login</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeLogin;