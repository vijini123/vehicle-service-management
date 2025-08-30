import React, { useState, useContext } from 'react'
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../Styles/Register.css'
import logo from '../assets/images/logo.png'
import { AuthContext } from '../context/AuthContext'
import { BASE_URL } from '../Utils/config'
import Toaster from '../context/Toaster'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import AuthYup from '../Validations/AuthYup';

const Register = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: AuthYup.registerSchema,
    onSubmit: async (values) => {
      Toaster.loadingToast('Creating user account...');

      try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        const result = await res.json();
  
        if (!res.ok) Toaster.updateLoadingToast('error', result.message || 'Registration failed. Please try again.');
        ;
  
        dispatch({type: 'REGISTER_SUCCESS'});
        Toaster.justToast('success', result.message, () => {
          navigate('/login')
          Toaster.dismissLoadingToast()
      })
      }  catch (err) {
        Toaster.updateLoadingToast('error', 'An error occurred. Please try again.');
      }
    },
  });

  return (
    <>
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
      <section className="register-section">
        <Container>
          <Row>
            <Col lg='6' className='m-auto'>
              <div className="register-container">
                <div className="register-form-wrapper">
                  <h2 className="register-title">Create Your Account</h2>
                  <Form onSubmit={formik.handleSubmit} className="register-form">
                    <FormGroup>
                      <input
                        type="text"
                        placeholder='Username'
                        id='username'
                        className="register-input"
                        {...formik.getFieldProps('username')}
                      />
                      {formik.touched.username && formik.errors.username && (
                        <div className="error-message">{formik.errors.username}</div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="email"
                        placeholder='Email'
                        id='email'
                        className="register-input"
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="error-message">{formik.errors.email}</div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        placeholder='Password'
                        id='password'
                        className="register-input"
                        {...formik.getFieldProps('password')}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="error-message">{formik.errors.password}</div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        placeholder='Confirm Password'
                        id='confirmPassword'
                        className="register-input"
                        {...formik.getFieldProps('confirmPassword')}
                      />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="error-message">{formik.errors.confirmPassword}</div>
                      )}
                    </FormGroup>
                    <Button className='btn register-btn' type='submit'>Create Account</Button>
                  </Form>
                  <p className="login-link">Already have an account? <Link to='/login'>Login to your account</Link></p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Register;
