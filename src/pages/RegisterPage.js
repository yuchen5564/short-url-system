// src/pages/RegisterPage.js
import React from 'react';
import { Layout, Alert, Button, Typography, Divider } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import NavigationHeader from '../Component/NavigationHeader';
import { AuthCard, RegisterForm } from '../Component/AuthForms';

const { Text } = Typography;

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
        subtitle="創建 Short Link 帳號，免費使用所有功能"
        icon={<RocketOutlined style={{ color: 'white', fontSize: 24 }} />}
      >
        {/* <RegisterForm
          onSubmit={onRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
          loading={loading}
        /> */}
        <Alert
          message="Sorry, this feature is not available yet."
          description="We will be launching this feature soon. Stay tuned!"
          type="error"
        />
        <Divider>或</Divider>
        <div className="text-center">
          <Text type="secondary">已經有帳號？</Text>
          <Button type="link" onClick={() => setCurrentPage('login')}>
            立即登入
          </Button>
        </div>
      </AuthCard>
    </Layout>
  );
};

export default RegisterPage;