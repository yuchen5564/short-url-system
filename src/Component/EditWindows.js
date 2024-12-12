import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebaseAuth/firebase';

function EditWindows(props) {
    const docId = props.doc ? props.doc.id : '';
    const [description, setDescription] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");

    useEffect(() => {
        if (props.doc) {
            setDescription(props.doc.description);
            setShortCode(props.doc.shortCode);
            setOriginalUrl(props.doc.originalUrl);
        }
    }, [props.doc]);

    const saveChanges = async () => {
        if (docId) {
            const docRef = doc(db, "urlInfo", docId);
            await updateDoc(docRef, {
                description,
                originalUrl
            });
            window.location.reload();
        } else {
            console.error("Document ID is invalid");
        }
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit ({props.doc.description})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required type="text" placeholder="About this link" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Short Code</Form.Label>
                        <Form.Control disabled readOnly type="text" placeholder="Enter short code" value={shortCode} onChange={(e) => setShortCode(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Original URL</Form.Label>
                        <Form.Control required type="text" placeholder="Enter original URL" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={saveChanges}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditWindows;