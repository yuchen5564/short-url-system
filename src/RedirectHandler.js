import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { db } from './firebaseAuth/firebase';


const RedirectHandler = () => {
  const { shortCode } = useParams();
  console.log(shortCode);
  const navigate = useNavigate();
  const [originalUrl, setOriginalUrl] = useState("");

  useEffect(() => {
    const redirect = async () => {
        try {
          // 獲取短網址文檔
          const urlRef = doc(db, 'urlInfo', shortCode);
          const urlSnap = await getDoc(urlRef);
          console.log(urlSnap.data());
  
        //   if (urlSnap.exists()) {
        //     // 更新訪問計數
        //     // await updateDoc(urlRef, {
        //     //   visits: (urlSnap.data().visits || 0) + 1
        //     // });
  
        //     // 重定向到原始網址
            window.location.href = urlSnap.data().originalUrl;
        //     console.log(urlSnap.data().originalUrl);
        //   } else {
        //     // navigate('/404');
        //   }
        } catch (error) {
          console.log('Error during redirect:', error);
        //   navigate('/error');
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

// // 404 頁面組件
// export const NotFound = () => (
//   <Container className="text-center py-5">
//     <h1>404 - 找不到此短網址</h1>
//     <p className="mb-4">您訪問的短網址不存在或已過期</p>
//     <Link to="/" className="btn btn-primary">
//       返回首頁
//     </Link>
//   </Container>
// );

// // 錯誤頁面組件
// export const ErrorPage = () => (
//   <Container className="text-center py-5">
//     <h1>系統錯誤</h1>
//     <p className="mb-4">抱歉，處理您的請求時發生錯誤</p>
//     <Link to="/" className="btn btn-primary">
//       返回首頁
//     </Link>
//   </Container>
// );

export default RedirectHandler;