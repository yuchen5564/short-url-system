// src/App.js
import React, { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import 'antd/dist/reset.css';
import './Component/styles/main.css'; // 引入主樣式檔案

// 導入組件
import NavigationHeader from './Component/NavigationHeader';
import HeroSection from './Component/HeroSection';
import StatisticsCards from './Component/StatisticsCards';
import FeatureCards from './Component/FeatureCards';
import UsageSteps from './Component/UsageSteps';
import AppFooter from './Component/AppFooter';
import { AuthCard, LoginForm, RegisterForm } from './Component/AuthForms';
import DashboardSidebar from './Component/DashboardSidebar';
import DashboardHeader from './Component/DashboardHeader';
import UrlForm from './Component/UrlForm';
import UrlTable from './Component/UrlTable';
import { ActivityPanel } from './Component/ActivityLists';

// 圖標
import { LinkOutlined, RocketOutlined } from '@ant-design/icons';

// Firebase Auth
import { signIn } from './firebaseAuth/firebase';
import AuthContext from "./firebaseAuth/AuthContext";

const { Content } = Layout;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('overview');
  const [loading, setLoading] = useState(false);

  // 模擬數據
  const [urls, setUrls] = useState([
    {
      id: 1,
      originalUrl: 'https://www.example.com/very-long-article-title-here',
      shortUrl: 'https://short.ly/abc123',
      alias: 'abc123',
      clicks: 1247,
      createdAt: '2024-01-15',
      lastClicked: '2024-01-20',
      status: 'active'
    },
    {
      id: 2,
      originalUrl: 'https://github.com/user/repository-name',
      shortUrl: 'https://short.ly/gh456',
      alias: 'gh456',
      clicks: 856,
      createdAt: '2024-01-18',
      lastClicked: '2024-01-19',
      status: 'active'
    },
    {
      id: 3,
      originalUrl: 'https://docs.google.com/document/d/123456789',
      shortUrl: 'https://short.ly/doc789',
      alias: 'doc789',
      clicks: 432,
      createdAt: '2024-01-20',
      lastClicked: '2024-01-21',
      status: 'active'
    }
  ]);

  const stats = {
    totalUrls: urls.length,
    totalClicks: urls.reduce((sum, url) => sum + url.clicks, 0),
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
      // 這裡整合 Firebase Auth
      console.log('登入資訊:', values);
      
      // 模擬登入
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await signIn(values.email, values.password);
      if (res.error) {
        throw new Error(res.error);
      }
      
      setUser({ 
        email: values.email, 
        name: values.email.split('@')[0] 
      });
      setCurrentPage('dashboard');
      message.success('登入成功！');
    } catch (error) {
      message.error('登入失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理註冊
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // 這裡整合 Firebase Auth
      console.log('註冊資訊:', values);
      
      // 模擬註冊
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('註冊成功！請登入您的帳號');
      setCurrentPage('login');
    } catch (error) {
      message.error('註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  // 處理新增短網址
  const handleCreateUrl = (values) => {
    const newUrl = {
      id: urls.length + 1,
      originalUrl: values.originalUrl,
      shortUrl: `https://short.ly/${values.customAlias || 'auto' + Math.random().toString(36).substr(2, 6)}`,
      alias: values.customAlias || 'auto' + Math.random().toString(36).substr(2, 6),
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastClicked: null,
      status: 'active'
    };
    
    setUrls([...urls, newUrl]);
    message.success('短網址創建成功！');
    setActiveKey('links');
  };

  // 處理刪除網址
  const handleDeleteUrl = (id) => {
    setUrls(urls.filter(url => url.id !== id));
    message.success('短網址已刪除');
  };

  // 首頁快速創建
  const handleQuickCreate = (url) => {
    if (!user) {
      message.info('請先註冊登入以使用完整功能');
      setCurrentPage('register');
      return;
    }
    
    const newUrl = {
      id: urls.length + 1,
      originalUrl: url,
      shortUrl: `https://short.ly/quick${Math.random().toString(36).substr(2, 6)}`,
      alias: `quick${Math.random().toString(36).substr(2, 6)}`,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastClicked: null,
      status: 'active'
    };
    
    setUrls([...urls, newUrl]);
    message.success('短網址創建成功！');
  };

  // 頁面標題對應
  const getPageTitle = () => {
    const titles = {
      'overview': '儀表板總覽',
      'create': '新增短網址',
      'links': '我的連結',
      'analytics': '分析報告',
      'settings': '系統設置'
    };
    return titles[activeKey] || '儀表板';
  };

  // 首頁
  const HomePage = () => (
    <Layout className="app-layout">
      <NavigationHeader 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <Content style={{ marginTop: 64, padding: 0 }}>
        <HeroSection 
          onCreateUrl={handleQuickCreate}
          onRegister={() => setCurrentPage('register')}
        />
        
        <div className="stats-section stats-section--homepage">
          <StatisticsCards 
            stats={{
              totalUrls: 2847293,
              totalClicks: 18472841,
              activeUsers: 89374
            }}
            layout="grid"
            showTrends={false}
          />
        </div>
        
        <FeatureCards />
        
        <UsageSteps 
          onGetStarted={() => setCurrentPage('register')}
        />
      </Content>

      <AppFooter />
    </Layout>
  );

  // 登入頁面
  const LoginPage = () => (
    <Layout className="app-layout">
      <NavigationHeader 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <AuthCard
        title="歡迎回來"
        subtitle="登入您的 ShortLink 帳號"
        icon={<LinkOutlined style={{ color: 'white', fontSize: 24 }} />}
      >
        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => setCurrentPage('register')}
          loading={loading}
        />
      </AuthCard>
    </Layout>
  );

  // 註冊頁面
  const RegisterPage = () => (
    <Layout className="app-layout">
      <NavigationHeader 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <AuthCard
        title="開始您的旅程"
        subtitle="創建 ShortLink 帳號，免費使用所有功能"
        icon={<RocketOutlined style={{ color: 'white', fontSize: 24 }} />}
      >
        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
          loading={loading}
        />
      </AuthCard>
    </Layout>
  );

  // 儀表板頁面
  const DashboardPage = () => {
    const renderContent = () => {
      switch (activeKey) {
        case 'overview':
          return (
            <div className="content-container">
              <StatisticsCards stats={stats} />
              <div className="activity-panel">
                <ActivityPanel 
                  urls={urls}
                  onViewMoreActivity={() => setActiveKey('links')}
                  onViewMorePopular={() => setActiveKey('analytics')}
                />
              </div>
            </div>
          );
          
        case 'create':
          return (
            <div className="content-container">
              <div className="content-card content-card--form">
                <UrlForm onSubmit={handleCreateUrl} />
              </div>
            </div>
          );
          
        case 'links':
          return (
            <div className="content-container">
              <div className="url-table-container">
                <UrlTable 
                  urls={urls}
                  onDelete={handleDeleteUrl}
                  onView={(record) => console.log('查看:', record)}
                />
              </div>
            </div>
          );
          
        case 'analytics':
          return (
            <div className="content-container">
              <div className="content-card content-card--center">
                <h2>分析功能開發中</h2>
                <p>詳細的點擊分析、地理位置統計、設備分析等功能正在開發中...</p>
              </div>
            </div>
          );
          
        case 'settings':
          return (
            <div className="content-container">
              <div className="content-card content-card--center">
                <h2>系統設置</h2>
                <p>帳戶設置、域名配置、API設置等功能正在開發中...</p>
              </div>
            </div>
          );
          
        default:
          return null;
      }
    };

    return (
      <Layout className="dashboard-layout">
        <DashboardSidebar
          collapsed={collapsed}
          activeKey={activeKey}
          onMenuClick={({ key }) => setActiveKey(key)}
        />
        
        <Layout>
          <DashboardHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            title={getPageTitle()}
            user={user}
          />
          
          <Content className="dashboard-content">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    );
  };

  // 根據當前頁面和用戶狀態渲染
  const renderPage = () => {
    if (user && currentPage !== 'home') {
      return <DashboardPage />;
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return user ? <DashboardPage /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return renderPage();
};

export default App;