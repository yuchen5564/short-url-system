// src/pages/LoginPage.js
import React from 'react';
import { Layout } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import NavigationHeader from '../Component/NavigationHeader';
import { AuthCard, LoginForm } from '../Component/AuthForms';

const LoginPage = ({ 
  currentPage, 
  setCurrentPage, 
  onLogin, 
  loading 
}) => {
  return (
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
          onSubmit={onLogin}
          onSwitchToRegister={() => setCurrentPage('register')}
          loading={loading}
        />
      </AuthCard>
    </Layout>
  );
};

export default LoginPage;