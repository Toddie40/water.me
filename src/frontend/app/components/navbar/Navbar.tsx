'use client'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css'

const NavigationBar = () => {
    return (
        <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="/"><div className='navbarTitle'>water.me</div></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/"><div className='navbarLink'>Status</div></Nav.Link>
            <Nav.Link href="library"><div className='navbarLink'>Library</div></Nav.Link>
            <Nav.Link href="logs"><div className='navbarLink'>Logs</div></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}


export default NavigationBar;