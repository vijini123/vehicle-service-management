import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaIdCard, FaCalendarCheck, FaCalendarAlt, FaIdBadge, FaSignOutAlt, FaCommentAlt, FaList, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../../Utils/config';
import '../../Styles/EmployeeProfile.css'
import {message} from 'antd'

const EmployeeProfile = () => {
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [attendance, setAttendance] = useState('');
  const [leaveDate, setLeaveDate] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [leaveDateError, setLeaveDateError] = useState('');
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('employeeEmail');
    const storedNic = localStorage.getItem('employeeNic');
    const storedEmployeeId = localStorage.getItem('employeeId');
  
    if (storedEmail && storedNic && storedEmployeeId) {
      setEmail(storedEmail);
      setNic(storedNic);
      setEmployeeId(storedEmployeeId);
    } else {
      navigate('/employeeLogin');
    }
    checkAttendanceStatus();
  }, []);

  const checkAttendanceStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employee/${employeeId}`);
      if (response.data.attendanceSubmitted) {
        setAttendanceSubmitted(true);
        const createdAt = new Date(response.data.createdAt);
        const nextSubmissionTime = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
        updateRemainingTime(nextSubmissionTime);
      }
    } catch (error) {
      console.error('Error checking attendance status:', error);
    }
  };

  const updateRemainingTime = (nextSubmissionTime) => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = nextSubmissionTime - now;
      
      if (timeDiff <= 0) {
        clearInterval(interval);
        setAttendanceSubmitted(false);
        setRemainingTime(null);
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleAttendance = async (e) => {
    e.preventDefault();
    if (!attendance) {
      message.error('Please select an attendance option');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/employee/${employeeId}`, { attendance });
      message.success("Attendance marked successfully!");
      setAttendanceSubmitted(true);
      checkAttendanceStatus();
    } catch (error) {
      console.error('Error marking attendance:', error);
      message.error('Failed to mark attendance');
    }
  };

  const handleRefresh = () => {
    checkAttendanceStatus();
  };
  
  const validateLeaveDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);

    if (selectedDate <= today) {
      setLeaveDateError('Leave date must be in the future');
      return false;
    } else if (selectedDate < minDate) {
      setLeaveDateError('Leave date must 7 days after from today');
      return false;
    }
    setLeaveDateError('');
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeNic');
    localStorage.removeItem('employeeId');
    navigate('/employeeLogin');
  };
  const handleLeaveRequest = async (e) => {
    e.preventDefault();
    if (!validateLeaveDate(leaveDate)) {
      return;
    }
    try {
      await axios.post(`${BASE_URL}/employee/${employeeId}`, { leaveDate, reason });
      message.success("Leave request submitted successfully!");
      setReason('');
      setLeaveDate('');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      message.error('Failed to submit leave request');
    }
  };
    return (
      <div className="employee-profile-container">
        <Container fluid>
          <Row>
            <Col md={4}>
              <Card className="employee-profile-card">
                <CardBody>
                  <CardTitle tag="h2" className="text-center mb-4">
                    <FaUser className="profile-icon" />
                    Employee Profile
                  </CardTitle>
                  <div className="employee-info">
                    <CardText>
                      <FaIdBadge className="info-icon" />
                      <strong>Employee ID:</strong> {employeeId}
                    </CardText>
                    <CardText>
                      <FaEnvelope className="info-icon" />
                      <strong>Email:</strong> {email}
                    </CardText>
                    <CardText>
                      <FaIdCard className="info-icon" />
                      <strong>NIC:</strong> {nic}
                    </CardText>
                  </div>
                  <Button color="danger" block onClick={handleLogout} className="logout-btn">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={8}>
              <Card className="employee-profile-card">
                <CardBody>
                  {!attendanceSubmitted ? (
                    <Form onSubmit={handleAttendance} className="mb-4">
                      <FormGroup>
                        <Label for="attendance" className="d-flex align-items-center">
                          <FaCalendarCheck className="form-icon" />
                          Mark Attendance
                        </Label>
                        <Input
                          type="select"
                          name="attendance"
                          id="attendance"
                          value={attendance}
                          onChange={(e) => setAttendance(e.target.value)}
                          required
                        >
                          <option value="">Select</option>
                          <option value="yes">Present</option>
                          <option value="no">Absent</option>
                        </Input>
                      </FormGroup>
                      <Button color="primary" type="submit" block className="mt-2">Mark Attendance</Button>
                    </Form>
                  ) : (
                    <div className="mb-4">
                      <p>Attendance submitted for today.</p>
                      <p className="font-weight-bold">{remainingTime}</p>
                      <Button color="info" onClick={handleRefresh} block className="mt-2">
                        <FaSync className="me-2" />
                        Refresh
                      </Button>
                    </div>
                  )}
                  <Form onSubmit={handleLeaveRequest} className="mb-4">
                    <FormGroup>
                      <Label for="leaveDate" className="d-flex align-items-center">
                        <FaCalendarAlt className="form-icon" />
                        Request Leave
                      </Label>
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <FaCommentAlt />
                        </span>
                        <Input
                          type="text"
                          name="reason"
                          id="reason"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Enter reason for leave"
                          required
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <FaCalendarAlt />
                        </span>
                        <Input
                          type="date"
                          name="leaveDate"
                          id="leaveDate"
                          value={leaveDate}
                          onChange={(e) => {
                            setLeaveDate(e.target.value);
                            validateLeaveDate(e.target.value);
                          }}
                          min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      {leaveDateError && <div className="text-danger">{leaveDateError}</div>}
                    </FormGroup>
                    <Button color="info" type="submit" block className="mt-2">Request Leave</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

export default EmployeeProfile;
