// src/pages/LoadingPage.js
import React from 'react';
import { Layout, Spin } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const LoadingPage = ({ message = "載入中..." }) => {
  return (
    <Layout className="app-layout">
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="auth-logo mb-16">
            <LinkOutlined style={{ color: 'white', fontSize: 24 }} />
          </div>
          <h3 style={{ marginBottom: 16 }}>Short Link</h3>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#666' }}>{message}</p>
        </div>
      </div>
    </Layout>
  );
};

export default LoadingPage;