import { Container } from 'react-bootstrap';
import './Component/styles/main.css';

function NotFound() {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
            <h1>404 - The short URL cannot be found</h1>
            <p className="mb-4">The short URL you visited does not exist</p>
        </div>
        </Container>
    );
}

export default NotFound;