import Navb from './Component/Navb';
import { Container, Card } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import './Component/main.css';
import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebaseAuth/firebase';
import dayjs from 'dayjs';

const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
  

function Create() { 
    const [description, setDescription] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [shortUrl, setShortUrl] = useState("");
    const [pastOriginalUrl, setPastOriginalUrl] = useState("");

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
        } catch (err) {
            setError('複製到剪貼簿失敗');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        var today = new Date();
        var datePost = dayjs(today).format('YYYY/MM/DD HH:mm:ss');
    
        // Define Firestore document reference
        
        try {
            var code = shortCode || generateRandomCode();

            if (shortCode) {
                // 檢查自訂代碼是否已存在
                const urlRef = doc(db, 'urlInfo', shortCode);
                const urlSnap = await getDoc(urlRef);
                
                if (urlSnap.exists()) {
                  throw new Error('This code has been used, please try another one.');
                }
            }else{
                var urlRef = doc(db, 'urlInfo', code);
                var urlSnap = await getDoc(urlRef);
                while(urlSnap.exists()){
                    code = generateRandomCode();
                    urlRef = doc(db, 'urlInfo', code);
                    urlSnap = await getDoc(urlRef);
                }
            }
            
            const docRef = doc(db, "urlInfo", code);
            await setDoc(docRef, {
                ptime: datePost,
                description: description,
                shortCode: code,
                originalUrl: originalUrl,
            });

            setSuccess(true);
            setShortUrl(`https://s.merlinkuo.tw/${code}`);
            setPastOriginalUrl(originalUrl);
            // setTimeout(() => {setSuccess(false);}, 3000);
            clearForm();
        } catch (e) {
            setError(e);
        }
        
    };
    
    const clearForm = () => {
        setDescription("");
        setShortCode("");
        setOriginalUrl(""); // Reset to the default category
    };

    return (
        <>
            <Navb />
            <Container fluid className='mt-5'>

                <Row className='justify-content-center'>
                    <Col md={10}>
                        <h1 style={{ 'font-family': 'Inter-sb' }}>Create</h1>
                        <hr className="my-4" />
                        <Form onSubmit={handleSubmit}> 
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control required type="text" placeholder="About this link" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Short Code</Form.Label>
                                <Form.Control type="text" placeholder="Enter short code" value={shortCode} onChange={(e) => setShortCode(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Original URL</Form.Label>
                                <Form.Control required type="text" placeholder="Enter original URL" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} />
                            </Form.Group>
                            
                            
                            <hr className="my-4" />

                            <Button variant="primary" type="submit">Submit</Button>
                            {' '}
                            <Button variant="danger" type="clear" onClick={clearForm}>Clear</Button>
                            <p></p>
                            {error ? <Alert variant='danger'>Something worng, please try again. ({error.toString()})</Alert> : <p></p>}
                            {success ? <Card className="mt-4" style={{ width: '25rem' }}>
                                    <Card.Body>
                                        <Card.Title>Your short URL is ready: </Card.Title>
                                        <div className="d-flex justify-content-between align-items-center">
                                        <a
                                            href={shortUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none"
                                        >
                                            {shortUrl}
                                        </a>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={copyToClipboard}
                                            size="sm"
                                        >
                                            Copy
                                        </Button>
                                        </div>
                                        <Card.Text className="text-muted mt-2">
                                        Original URL: {pastOriginalUrl}
                                        </Card.Text>
                                    </Card.Body>
                                    </Card> 
                                    
                            : <p></p>}
                        </Form>
                    </Col>
                </Row>

            </Container>
        </>
    );
}
export default Create;