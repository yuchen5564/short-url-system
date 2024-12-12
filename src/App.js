import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from 'react-bootstrap';
import './App.css';
import Navb from './Component/Navb';


function App() {
  return (
    <>
      <Navb />
      <Container fluid className='mt-5'>
      <Row className='justify-content-center'>
        <Col md={7}>
          <h1 style={{ 'font-family': 'Inter-sb' }}>Welcome</h1><br />
        </Col>
      </Row>

      </Container>
      
    </>
  );
}

export default App;
