import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseAuth/firebase';


const RedirectHandler = () => {
  const { shortCode } = useParams();
  console.log(shortCode);
  const navigate = useNavigate();  

  useEffect(() => {
    const redirect = async () => {
        try {
          // 獲取短網址文檔
          const urlRef = doc(db, 'urlInfo', shortCode);
          const urlSnap = await getDoc(urlRef);
          console.log(urlSnap.data());
  
          if (urlSnap.exists()) {
        //     // 更新訪問計數
        //     // await updateDoc(urlRef, {
        //     //   visits: (urlSnap.data().visits || 0) + 1
        //     // });
  
        //     // 重定向到原始網址
            window.location.href = urlSnap.data().originalUrl;
          } else {
            navigate('/404');
          }
        } catch (error) {
          // console.log('Error during redirect:', error);
          // navigate('/error');
        }
      };
  
      redirect();
  }, [shortCode, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p className="h5">重定向中...</p>
      </div>
    </Container>
  );
};

export default RedirectHandler;