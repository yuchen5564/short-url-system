// src/Component/NavigationHeader.js
import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const NavigationHeader = ({ 
  currentPage, 
  onNavigate, 
  showAuthButtons = true,
  fixed = true 
}) => {
  const headerClass = fixed 
    ? 'navigation-header navigation-header--fixed' 
    : 'navigation-header';

  return (
    <Header className={headerClass}>
      <div className="nav-brand" onClick={() => onNavigate('home')}>
        <div className="nav-brand__logo">
          <LinkOutlined style={{ color: 'white', fontSize: 20 }} />
        </div>
        <Title level={3} className="nav-brand__title">
          ShortLink
        </Title>
      </div>
      
      {showAuthButtons && (
        <Space size="large">
          {currentPage === 'home' && (
            <>
              <Button type="text" onClick={() => onNavigate('login')}>
                登入
              </Button>
              <Button type="primary" onClick={() => onNavigate('register')}>
                註冊
              </Button>
            </>
          )}
          {currentPage !== 'home' && (
            <Button type="text" onClick={() => onNavigate('home')}>
              返回首頁
            </Button>
          )}
        </Space>
      )}
    </Header>
  );
};

export default NavigationHeader;