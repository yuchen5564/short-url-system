import Navb from './Component/Navb';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from './firebaseAuth/firebase';

import DeleteWindows from './Component/DeleteWindows';
import EditWindows from './Component/EditWindows';

import './Component/main.css';

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

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

    const columns = [
        { field: 'description', headerName: 'Description', width: 200 },
        { 
            field: 'shortCode', 
            headerName: 'Shorten URL', 
            width: 300,
            renderCell: (params) => {
                const fullUrl = `https://s.merlinkuo.tw/${params.value}`;
                return (fullUrl);
            }
        },
        { field: 'ptime', headerName: 'Create Time', width: 200 },
    ];

    return (
        <>
            <Navb />
            <Container fluid className='mt-5'>
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <h1 style={{ 'fontFamily': 'Inter-sb' }}>List</h1><br />
                        <Box sx={{ height: 400, width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <DataGrid
                                    rows={urlList}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[5,10,15,20]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </div>
                        </Box>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default List;