
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { doc, deleteDoc} from "firebase/firestore";
import { db } from '../firebaseAuth/firebase';

function DeleteWindows(props) {
    const docId = props.doc ? props.doc.id : '';

    const del = async () => {
        await deleteDoc(doc(db, 'urlInfo', docId));
        window.location.reload();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete ({docId})
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Are you sure you want to delete ? <br /><br />
                    This action cannot be undo !
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={del}>Confirm</Button>  {/*onClick={del}*/}
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteWindows;