import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

import Login from './Login';

import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseAuth/firebase";
import { useContext } from "react";
import AuthContext from "../firebaseAuth/AuthContext";
import './main.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Short URL System <span></span>
            {user? <Button color="inherit" href="./list">List</Button>:<span></span>}
            {user? <Button color="inherit" href="./create">Create</Button>:<span></span>}
          </Typography>
          {!user? <Button variant="contained" color="info" onClick={() => { setLoginModalShow(true) }}>Login</Button>:
          <Button variant="contained" color="error" onClick={() => {handleLogout();}}>Logout</Button>}
        </Toolbar>
      </AppBar>
    </Box>

      <LoginWindows
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)}
      />
    </>
  );
}

export default Navb;