import React from 'react'
import './Footer.css'
import { Container, Row, Col, ListGroup, ListGroupItem} from 'reactstrap'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'

const quick_links = [
  {
    path:'/home',
    display:'Home'
  },
  {
    path:'/about',
    display:'About'
  },
  {
    path:'/contact',
    display:'Contact Us'
  },
]

const quick_links2 = [
  {
    path:'/Booking',
    display:'Bookings'
  },
  {
    path:'/login',
    display:'Login'
  },
  {
    path:'/register',
    display:'Register'
  },
]

const Footer = () => {

  const year = new Date().getFullYear()

  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col lg='3'>
            <div className="logo">
              <div className="logo__img">
                <img src={logo} alt="logo" />
              </div>
              <p>
                Feel better service with SAVONTA
              </p>
              <div className="social__links d-flex align-items-center gap-4">
                <span>
                  <Link to='#'><i class="ri-facebook-fill"></i></Link>
                </span>
                <span>
                  <Link to='#'><i class="ri-whatsapp-line"></i></Link>
                </span>
                <span>
                  <Link to='#'><i class="ri-instagram-line"></i></Link>
                </span>
                <span>
                  <Link to='#'><i class="ri-youtube-line"></i></Link>
                </span>
              </div>
            </div>
          </Col>
          <Col lg='3'>
            <h5 className="footer__link-title">
              Discover
            </h5>
            <ListGroup className='footer__quick-links'>
              {quick_links.map((item,index) => (
                <ListGroupItem key={index} className='ps-0 border-0'>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg='3'>
          <h5 className="footer__links-title">
              Quick Links
            </h5>
            <ListGroup className='footer__quick-links'>
              {quick_links2.map((item,index) => (
                <ListGroupItem key={index} className='ps-0 border-0'>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg='3'>
          <h5 className="footer__links-title">
              Contact Us
            </h5>
            <ListGroup className='footer__quick-links'>
                <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                  <h6 className='mb-0 d-flex align-items-center gap-2'>
                    <span><i class="ri-map-pin-line"></i></span>
                    Address:
                  </h6>
                  <p className='mb-0'>
                    Malabe,SriLanka
                  </p>
                </ListGroupItem>

                <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                  <h6 className='mb-0 d-flex align-items-center gap-2'>
                    <span><i class="ri-mail-line"></i></span>
                    Email:
                  </h6>
                  <p className='mb-0'>
                    savonta@gmail.com
                  </p>
                </ListGroupItem>

                <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                  <h6 className='mb-0 d-flex align-items-center gap-2'>
                    <span><i class="ri-phone-line"></i></span>
                    Phone:
                  </h6>
                  <p className='mb-0'>
                  +94 73 1234 567
                  </p>
                </ListGroupItem>
            </ListGroup>
          </Col>
          <hr />
          <Col lg='12'>
            <div class="container topbar bg-primary d-none d-lg-block">
                <div class="d-flex justify-content-between">
                    <div class="top-info ps-2">
                        <small class="me-3"><i class="fas fa-map-marker-alt me-2 text-secondary"></i> <a class="text-white">+94 73 1234 567</a></small>
                        <small class="me-3"><i class="fas fa-envelope me-2 text-secondary"></i><a class="text-white">savonta@gmail.com</a></small>
                    </div>
                    <div class="top-link pe-2">
                        <small class="text-white mx-2">Copyright {year} | All rights reserved SAVONTA service (PVT) ltd..</small>
                    </div>
                </div>
            </div>
            </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
