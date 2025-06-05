// src/Component/DashboardHeader.js
import React from 'react';
import { Layout, Button, Typography, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const DashboardHeader = ({ 
  collapsed, 
  onToggleCollapse, 
  title,
  user,
  onNotificationClick,
  onUserClick 
}) => {
  return (
    <Header style={{ 
      padding: '0 24px', 
      background: '#fff', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        <Title level={3} style={{ margin: 0, marginLeft: 16 }}>
          {title}
        </Title>
      </div>
      
      <Space>
        <Button 
          type="text" 
          icon={<BellOutlined />}
          onClick={onNotificationClick}
        />
        <Avatar 
          icon={<UserOutlined />}
          src={user?.avatar}
          onClick={onUserClick}
          style={{ cursor: 'pointer' }}
        />
      </Space>
    </Header>
  );
};

export default DashboardHeader;