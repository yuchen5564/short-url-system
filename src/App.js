// src/App.js
import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import 'antd/dist/reset.css';
import './Component/styles/main.css';

// 導入頁面組件
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingPage from './pages/LoadingPage';

// 導入模態框組件
import LogoutModal from './Component/LogoutModal';
import UserProfileModal from './Component/UserProfileModal';

// Firebase
import { auth, db } from './firebaseAuth/firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc } from "firebase/firestore";
import { signIn } from './firebaseAuth/firebase';

const App = () => {
  // 頁面狀態
  const [currentPage, setCurrentPage] = useState('home');
  const [authLoading, setAuthLoading] = useState(true);
  
  // 用戶狀態
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  
  // UI狀態
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // 模態框狀態
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // 數據狀態
  const [urls, setUrls] = useState([]);

  // Firebase 身分驗證狀態監聽
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Firebase Auth State Changed:', firebaseUser);
      setAuthLoading(false);
      
      if (firebaseUser) {
        // 用戶已登入
        setFirebaseUser(firebaseUser);
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          avatar: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('shortlink_user', JSON.stringify(userData));
        
        // 如果在登入或註冊頁面，跳轉到儀表板
        // if (currentPage === 'login' || currentPage === 'register') {
        //   setCurrentPage('dashboard');
        // }

        setCurrentPage('dashboard');
        // 載入用戶的 URL 數據
        fetchUserUrls();
      } else {
        // 用戶未登入
        setFirebaseUser(null);
        setUser(null);
        setUrls([]);
        localStorage.removeItem('shortlink_user');
        
        // 如果在需要登入的頁面，跳轉到首頁
        if (currentPage === 'dashboard') {
          setCurrentPage('home');
        }
      }
    });

    return () => unsubscribe();
  }, [currentPage]);

  // 載入用戶的 URL 數據
  const fetchUserUrls = async () => {
    if (!firebaseUser) return;
    
    try {
      const urlsQuery = query(
        collection(db, "urlInfo"), 
        orderBy('ptime', 'desc')
      );
      const querySnapshot = await getDocs(urlsQuery);
      const urlsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        shortUrl: `https://s.merlinkuo.tw/${doc.data().shortCode}`,
        alias: doc.data().shortCode,
        clicks: doc.data().clicks || 0,
        createdAt: doc.data().ptime,
        status: 'active'
      }));
      
      setUrls(urlsData);
      console.log('載入 URLs:', urlsData);
    } catch (error) {
      console.error('載入 URLs 失敗:', error);
      message.error('載入數據失敗');
    }
  };

  // 計算統計數據
  const stats = {
    totalUrls: urls.length,
    totalClicks: urls.reduce((sum, url) => sum + (url.clicks || 0), 0),
    todayClicks: 234,
    activeUsers: 1847,
    trends: {
      totalUrls: 12,
      totalClicks: 8,
      todayClicks: -3,
      activeUsers: 15
    }
  };

  // 處理登入
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      console.log('登入資訊:', values);
      
      const result = await signIn(values.email, values.password);
      if (result.error) {
        throw new Error(result.error);
      }
      
      message.success('登入成功！歡迎回來');
      // Firebase onAuthStateChanged 會自動處理後續邏輯
    } catch (error) {
      console.error('登入錯誤:', error);
      message.error('登入失敗：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 處理註冊
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      console.log('註冊資訊:', values);
      
      // 創建新用戶
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        values.email, 
        values.password
      );
      
      // 更新用戶顯示名稱
      await updateProfile(userCredential.user, {
        displayName: values.name
      });
      
      message.success('註冊成功！歡迎加入 ShortLink');
      // Firebase onAuthStateChanged 會自動處理後續邏輯
    } catch (error) {
      console.error('註冊錯誤:', error);
      let errorMessage = '註冊失敗';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = '此信箱已被註冊';
          break;
        case 'auth/weak-password':
          errorMessage = '密碼強度不足，請使用至少6個字符';
          break;
        case 'auth/invalid-email':
          errorMessage = '信箱格式不正確';
          break;
        default:
          errorMessage = error.message;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 處理登出
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      console.log('用戶登出:', user?.email);
      
      await signOut(auth);
      
      // 清除本地狀態
      setActiveKey('overview');
      setCollapsed(false);
      
      message.success('已成功登出');
    } catch (error) {
      console.error('登出錯誤:', error);
      message.error('登出失敗，請稍後再試');
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  // 處理用戶資料更新
  const handleUpdateProfile = async (values) => {
    setProfileLoading(true);
    try {
      console.log('更新用戶資料:', values);
      
      if (firebaseUser) {
        // 更新 Firebase 用戶資料
        await updateProfile(firebaseUser, {
          displayName: values.name
        });
      }
      
      // 更新本地狀態
      const updatedUser = { ...user, ...values };
      setUser(updatedUser);
      localStorage.setItem('shortlink_user', JSON.stringify(updatedUser));
      
      message.success('個人資料更新成功');
      setShowProfileModal(false);
    } catch (error) {
      console.error('更新資料錯誤:', error);
      message.error('更新失敗，請稍後再試');
    } finally {
      setProfileLoading(false);
    }
  };

  // 處理新增短網址 - 簡化版本，因為 UrlForm 現在直接處理 Firestore
  const handleCreateUrl = async (urlData) => {
    // UrlForm 組件現在直接處理 Firestore 操作
    // 這個函數主要用於更新 UI 狀態和重新載入數據
    
    try {
      // 重新載入用戶的 URL 數據以反映新創建的項目
      await fetchUserUrls();
      
      // 可選：切換到連結列表頁面查看新創建的項目
      setTimeout(() => {
        setActiveKey('links');
      }, 1500);
      
    } catch (error) {
      console.error('更新數據失敗:', error);
    }
  };

  // 處理刪除網址 - 更新版本，包含 Firestore 操作
  const handleDeleteUrl = async (id) => {
    if (!firebaseUser) {
      message.error('請先登入');
      return;
    }
  
    try {
      // 從 Firestore 刪除
      await deleteDoc(doc(db, "urlInfo", id));
      
      // 更新本地狀態
      setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      
      message.success('短網址已刪除');
    } catch (error) {
      console.error('刪除短網址錯誤:', error);
      message.error('刪除失敗，請稍後再試');
      throw error; // 重新拋出錯誤，讓 UrlTable 知道操作失敗
    }
  };


  // 首頁快速創建
  const handleQuickCreate = (url) => {
    if (!user) {
      message.info('請先註冊登入以使用完整功能');
      setCurrentPage('register');
      return;
    }
    
    // 跳轉到創建頁面
    setActiveKey('create');
    setCurrentPage('dashboard');
    message.info('請在創建頁面完成設定');
  };

  // 處理通知點擊
  const handleNotificationClick = () => {
    message.info('通知功能開發中...');
  };

  // 處理設置點擊
  const handleSettingsClick = () => {
    setActiveKey('settings');
  };

  const handleUpdateUrl = (updatedData) => {
    // 更新本地狀態中的 URL 數據
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === updatedData.id ? updatedData : url
      )
    );
    
    console.log('URL 資料已更新:', updatedData);
  };
  

  // 如果正在檢查身分驗證狀態，顯示載入畫面
  if (authLoading) {
    return <LoadingPage message="檢查登入狀態中..." />;
  }

  // 根據當前頁面和用戶狀態渲染
  const renderPage = () => {
    // 如果用戶已登入且試圖訪問登入/註冊頁面，重定向到儀表板
    if (user && (currentPage === 'login' || currentPage === 'register')) {
      return (
        <DashboardPage
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          user={user}
          urls={urls}
          stats={stats}
          onCreateUrl={handleCreateUrl}  // 確保傳入這個函數
          onDeleteUrl={handleDeleteUrl}
          onNotificationClick={handleNotificationClick}
          onLogout={() => setShowLogoutModal(true)}
          onProfile={() => setShowProfileModal(true)}
          onSettings={handleSettingsClick}
        />
      );
    }

    // 如果用戶未登入且試圖訪問儀表板，重定向到首頁
    if (!user && currentPage === 'dashboard') {
      return (
        <HomePage
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onQuickCreate={handleQuickCreate}
        />
      );
    }

    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onLogin={handleLogin}
            loading={loading}
          />
        );
      case 'register':
        return (
          <RegisterPage
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onRegister={handleRegister}
            loading={loading}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            user={user}
            urls={urls}
            stats={stats}
            onCreateUrl={handleCreateUrl}  // 確保傳入這個函數
            onDeleteUrl={handleDeleteUrl}
            onNotificationClick={handleNotificationClick}
            onLogout={() => setShowLogoutModal(true)}
            onProfile={() => setShowProfileModal(true)}
            onSettings={handleSettingsClick}
          />
        );
      default:
        return (
          <HomePage
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onQuickCreate={handleQuickCreate}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      
      {/* 登出確認彈窗 */}
      <LogoutModal
        visible={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={logoutLoading}
        userName={user?.name}
      />
      
      {/* 用戶資料彈窗 */}
      <UserProfileModal
        visible={showProfileModal}
        onCancel={() => setShowProfileModal(false)}
        onUpdate={handleUpdateProfile}
        user={user}
        loading={profileLoading}
      />
    </>
  );
};

export default App;