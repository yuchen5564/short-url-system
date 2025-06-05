import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseAuth/firebase"; // Ensure your firebase config and auth are set up correctly
// import Navb from './Navb';
import Spinner from 'react-bootstrap/Spinner';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const ProtectedRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

    if (loading) {
      return <>
      {/* <Navb></Navb> */}
      <Container fluid className='mt-5'>
        <Row className='justify-content-center'>
            <Col md={1}>
              <Spinner animation="border" />
            </Col>
        </Row>
      </Container>
      </>; // or a spinner/loader component
    }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
