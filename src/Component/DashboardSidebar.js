// src/Component/DashboardSidebar.js
import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  PlusOutlined,
  LinkOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const DashboardSidebar = ({ 
  collapsed, 
  activeKey, 
  onMenuClick,
  theme = 'light'
}) => {
  const menuItems = [
    {
      key: 'overview',
      icon: <DashboardOutlined />,
      label: '總覽',
    },
    {
      key: 'create',
      icon: <PlusOutlined />,
      label: '新增短網址',
    },
    {
      key: 'links',
      icon: <LinkOutlined />,
      label: '我的連結',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '分析報告',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '設定',
    },
  ];

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed} 
      theme={theme}
    >
      <div style={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Title 
          level={4} 
          style={{ 
            margin: 0, 
            color: theme === 'light' ? '#1890ff' : 'white' 
          }}
        >
          {collapsed ? <LinkOutlined /> : 'Short Link'}
        </Title>
      </div>
      
      <Menu
        theme={theme}
        mode="inline"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={onMenuClick}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default DashboardSidebar;