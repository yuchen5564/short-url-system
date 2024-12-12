import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

import Login from './Login';

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseAuth/firebase";
import { useContext } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import AuthContext from "../firebaseAuth/AuthContext";
import './main.css';

function LoginWindows(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Login />
      </Modal.Body>
    </Modal>
  );

}

// const logoutSuccess = () => toast.success("Logout Successful", { position: "top-center" });
// const logoutError = () => toast.error("Logout Failed", { position: "top-center" });




function Navb() {
  const { user } = useContext(AuthContext);
  const [loginModalShow, setLoginModalShow] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };
  

  
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" style={{ 'font-family': 'Inter-sb' }} fixed="top">
        <Container>
          <Navbar.Brand href="./">Short URL System</Navbar.Brand>
          <Nav className="me-auto">
            {/* <Nav.Link href="./">Home</Nav.Link> */}
            {user? <Nav.Link href="./list">List</Nav.Link>:<p></p>}
            {user? <Nav.Link href="./create">Create</Nav.Link>:<p></p>}
          </Nav>
          {!user? <Button variant="primary" onClick={() => { setLoginModalShow(true) }}>Login</Button>:
          <Button variant="danger" onClick={() => {handleLogout();}}>Logout</Button>}
        
        </Container>
      </Navbar>
      <br /><br />
      <LoginWindows
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)}
      />
    </>
  );
}

export default Navb;