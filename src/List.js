import Table from 'react-bootstrap/Table';
import Navb from './Component/Navb';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as Icon from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from './firebaseAuth/firebase';

import DeleteWindows from './Component/DeleteWindows';
import EditWindows from './Component/EditWindows';

import './Component/main.css';


function List() {
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [document, setDoc] = useState(null);
    const [urlList, setUrlList] = useState([]);

    const fetchPost = async () => {
        await getDocs(query(collection(db, "urlInfo"), orderBy('ptime', 'desc')))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setUrlList(newData);
            });
    }

    useEffect(() => {
        fetchPost();
    }, []);

    const handleEditShow = (item) => {
        setDoc(item);
        setEditModalShow(true);
    };

    const handleDeleteShow = (item) => {
        setDoc(item);
        setDeleteModalShow(true);
    };

    const copyToClipboard = (item) => {
        try {
            navigator.clipboard.writeText(`https://s.merlinkuo.tw/${item.shortCode}`);
        } catch (err) {
            // setError('複製到剪貼簿失敗');
        }
    };

    return (
        <>
            <Navb />
            <Container fluid className='mt-5'>
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <h1 style={{ 'fontFamily': 'Inter-sb' }}>List</h1><br />
                        <Table striped border hover responsive>
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>Shorten URL</th>
                                    <th>Create Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {urlList?.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <Button variant="outline-primary" onClick={() => handleEditShow(item)}>
                                                <Icon.PencilSquare />
                                            </Button>{' '}
                                            <Button variant="outline-danger" onClick={() => handleDeleteShow(item)}>
                                                <Icon.Trash />
                                            </Button>
                                        </td>
                                        <td>{item.description}</td> 
                                        <td>https://s.merlinkuo.tw/{item.shortCode}</td>  
                                        <td>{item.ptime}</td> 
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <DeleteWindows
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                doc={document}
            />
            <EditWindows
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                doc={document}
            />
        </>
    );
}

export default List;
