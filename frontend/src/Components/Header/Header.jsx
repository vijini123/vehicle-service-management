import React, { useRef, useEffect, useContext, useState } from 'react';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Button, Toast } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';
const nav_links = [
  {
    path: '/home',
    display: '🏚Home'
  },
  {
    path: '/booking',
    display: '🕡Bookings'
  },
  {
    path: '/packages',
    display: '🧰Packages'
  },
  {
    path: '/about',
    display: '👨🏻‍🔧About Us'
  },
  {
    path: '/contact',
    display: '📞Contact Us'
  },
]

const Header = () => {
  const headerRef = useRef(null)
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    alert('Logged out successfully')
    navigate('/')
  }

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky-top')
      } else {
        headerRef.current.classList.remove('sticky-top')
      }
    })
  }

  useEffect(() => {
    stickyHeaderFunc()

    return () => window.removeEventListener('scroll', stickyHeaderFunc)
  }, [])

  return (
    <Navbar bg="light" expand="lg" className="header shadow-sm" ref={headerRef} expanded={expanded}>
      <Container>
      <Navbar.Brand as={Link} to="/" className="fs-2 fw-bold company">
        SAVONTA
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto fs-5 d-flex justify-content-center">
            {nav_links.map((item, index) => (
              <Nav.Link
                as={NavLink}
                to={item.path}
                key={index}
                onClick={() => setExpanded(false)}
                className={({ isActive }) => isActive ? "active fw-bold color-blue" : "text-dark"}
                style={({ isActive }) => isActive ? { borderBottom: '2px solid #0078c9' } : {}}
              >
                {item.display}
              </Nav.Link>
            ))}
          </Nav>
          <Nav>
            {user ? (
              <>
                <NavDropdown className="fs-5" title={user.username} id="primary-nav-dropdown ">
                  <NavDropdown.Item as={Link} to={user.email === 'admin@gmail.com' ? '/adminProfile' : '/userProfile'} className="dropdown-item-hover">
                    <i className="fas fa-user me-2"></i>Profile⚙️
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logout} className="btn btn-danger dropdown-item-hover" style={{color: 'white', backgroundColor: '#f90000', margin:' 0 10px 0px 10px'}}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-light text-primary fw-bold">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
