import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AuthContext from "../firebaseAuth/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { signIn } from '../firebaseAuth/firebase';
import { useContext } from "react";

import './main.css';


function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, seterror] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setEmail("");
      setPassword("");
      const res = await signIn(email, password);
      if (res.error) {
        if (res.error) seterror(res.error);
      }
    };

    const { user } = useContext(AuthContext);
    if (user) {
      return <Navigate replace to="/list" />;
    }

    return (
        <>

            {error ? <Alert variant='danger'>{error}</Alert> : <p></p>}
            <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="floatingInput" label="Account" className="mb-3" requird>
                    <Form.Control required type="email" placeholder="name@example.com"  value={email} onChange={(e) => setEmail(e.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password" requird>
                    <Form.Control required type="password" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)} />
                </FloatingLabel>
                <hr className="my-4" />
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>

        </>
    );
}
export default Login;