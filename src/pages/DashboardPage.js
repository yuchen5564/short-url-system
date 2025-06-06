// src/pages/DashboardPage.js
import React from 'react';
import { Layout } from 'antd';
import DashboardSidebar from '../Component/DashboardSidebar';
import DashboardHeader from '../Component/DashboardHeader';
import StatisticsCards from '../Component/StatisticsCards';
import { ActivityPanel } from '../Component/ActivityLists';
import UrlForm from '../Component/UrlForm';
import UrlTable from '../Component/UrlTable';

const { Content } = Layout;

const DashboardPage = ({
  collapsed,
  setCollapsed,
  activeKey,
  setActiveKey,
  user,
  urls,
  stats,
  onCreateUrl,
  onDeleteUrl,
  onUpdateUrl,  // 新增這個 prop
  onNotificationClick,
  onLogout,
  onProfile,
  onSettings
}) => {
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

  // 渲染不同頁面內容
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
              <UrlForm onSubmit={onCreateUrl} />
            </div>
          </div>
        );
        
      case 'links':
        return (
          <div className="content-container">
            <div className="url-table-container">
              <UrlTable 
                urls={urls}
                onDelete={onDeleteUrl}
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
          onNotificationClick={onNotificationClick}
          onLogout={onLogout}
          onProfile={onProfile}
          onSettings={onSettings}
        />
        
        <Content className="dashboard-content">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;