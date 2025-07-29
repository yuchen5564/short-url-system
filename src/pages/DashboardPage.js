// src/pages/DashboardPage.js
import React from 'react';
import { Layout } from 'antd';
import DashboardSidebar from '../Component/DashboardSidebar';
import DashboardHeader from '../Component/DashboardHeader';
import StatisticsCards from '../Component/StatisticsCards';
import { ActivityPanel } from '../Component/ActivityLists';
import UrlForm from '../Component/UrlForm';
import UrlTable from '../Component/UrlTable';
import TagStatistics from '../Component/TagStatistics';
import TagManagementPage from './TagManagementPage';

const { Content } = Layout;

const DashboardPage = ({
  collapsed,
  setCollapsed,
  activeKey,
  setActiveKey,
  user,
  urls,
  stats,
  loading,
  onCreateUrl,
  onDeleteUrl,
  onUpdateUrl,
  onRefresh, // 新增重新整理函數 prop
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
      'tags': '標籤管理',
      'analytics': '分析報告',
      'settings': '系統設定'
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
              <UrlForm 
                onSubmit={onCreateUrl}
                user={user}
              />
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
                onUpdate={onUpdateUrl}
                onRefresh={onRefresh}
                loading={loading}
                onView={(record) => {}}
                user={user}
              />
            </div>
          </div>
        );
        
      case 'tags':
        return (
          <div className="content-container">
            <TagManagementPage user={user} />
          </div>
        );
        
      case 'analytics':
        return (
          <div className="content-container">
            <TagStatistics user={user} urls={urls} />
            <div className="content-card content-card--center" style={{ marginTop: 24 }}>
              <h3>更多分析功能開發中</h3>
              <p>詳細的點擊分析、地理位置統計、設備分析等功能正在開發中...</p>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="content-container">
            <div className="content-card content-card--center">
              <h2>系統設定</h2>
              <p>帳戶設定、域名配置、API設定等功能正在開發中...</p>
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