// src/Component/DashboardHeader.js
import React from 'react';
import { Layout, Button, Typography, Space, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProfileOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const DashboardHeader = ({ 
  collapsed, 
  onToggleCollapse, 
  title,
  user,
  onNotificationClick,
  onUserClick,
  onLogout,
  onProfile,
  onSettings 
}) => {
  
  // 用戶下拉選單項目
  const userMenuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: '個人資料',
      onClick: onProfile
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '帳戶設定',
      onClick: onSettings
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      onClick: onLogout,
      danger: true
    }
  ];

  return (
    <Header className="dashboard-header">
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="header-toggle"
        />
        <Title level={3} className="header-title">
          {title}
        </Title>
      </div>
      
      <Space size="middle">
        <Button 
          type="text" 
          icon={<BellOutlined />}
          onClick={onNotificationClick}
          className="transition-all"
        />
        
        <Dropdown 
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="user-avatar-container cursor-pointer">
            <Space>
              <Avatar 
                icon={<UserOutlined />}
                src={user?.avatar}
                size="default"
              />
              <span className="user-name">{user?.name || user?.email}</span>
            </Space>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default DashboardHeader;