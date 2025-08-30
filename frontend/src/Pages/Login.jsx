import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../Styles/Login.css'
import loginImg from '../assets/images/logo.png'
import { AuthContext } from '../context/AuthContext'
import { BASE_URL } from '../Utils/config'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toaster from '../context/Toaster';
import logo from '../assets/images/logo.png'

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined
  })

  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleClick = async (e) => {
    e.preventDefault();
    Toaster.loadingToast('Logging in...');

    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const result = await res.json();
      if (res.ok) {
        console.log(result.data);

        // Check if the user is an admin
        if (credentials.email === 'admin@gmail.com' && credentials.password === 'admin12345') {
          dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
          Toaster.updateLoadingToast('success', 'Login successful!', () => navigate('/adminProfile'));
        } 
        if (credentials.email.includes('employee') && credentials.password === 'employee12345') {
          dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
          Toaster.updateLoadingToast('success', 'Login successful!', () => navigate('/employeeProfile'));
        } 
        else {
          dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
          Toaster.updateLoadingToast('success', 'Login successful!', () => navigate('/'));
        }
      } else {
        Toaster.updateLoadingToast('error', result.message);
        dispatch({ type: 'LOGIN_FAILURE', payload: result.message });
      }
    } catch (err) {
      Toaster.updateLoadingToast('error', 'An error occurred. Please try again.');
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
    }
  }
  return <>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <section className='login-section'>
      <Container>
        <Row className="justify-content-center align-items-center" >
          <Col md="6" lg="5">
            <Card className="shadow-lg login-card">
              <CardBody>
                <div className="d-flex justify-content-center mb-4">
                  <img src={logo} alt="Logo" style={{ maxWidth: '100px' }} />
                </div>
                <CardTitle tag="h4" className="text-center mb-4">Log in to your account</CardTitle>
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="email" placeholder='Email' required id='email' className="form-control" onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder='Password' required id='password' className="form-control" onChange={handleChange} />
                  </FormGroup>
                  <FormGroup className='remember d-flex justify-content-between align-items-center'>
                    <div>
                      <input type="checkbox" className="form-check-input" onChange={handleChange} />
                      <label className="form-check-label">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                  </FormGroup>
                  <Button className='btn btn-primary w-100' type='submit'>Login</Button>
                </Form>
                <div className="text-center mt-3">
                  Don't have an account? <Link to='/register'>Create Account</Link>
                </div>
                <div className="text-center mt-3">
                  <Link to='/employeeLogin'>Log in as employee</Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  </>
}

export default Login
