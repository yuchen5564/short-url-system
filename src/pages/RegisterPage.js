// src/pages/RegisterPage.js
import React from 'react';
import { Layout } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import NavigationHeader from '../Component/NavigationHeader';
import { AuthCard, RegisterForm } from '../Component/AuthForms';

const RegisterPage = ({ 
  currentPage, 
  setCurrentPage, 
  onRegister, 
  loading 
}) => {
  return (
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
          onSubmit={onRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
          loading={loading}
        />
      </AuthCard>
    </Layout>
  );
};

export default RegisterPage;