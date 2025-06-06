// src/pages/HomePage.js
import React from 'react';
import { Layout } from 'antd';
import NavigationHeader from '../Component/NavigationHeader';
import HeroSection from '../Component/HeroSection';
import StatisticsCards from '../Component/StatisticsCards';
import FeatureCards from '../Component/FeatureCards';
import UsageSteps from '../Component/UsageSteps';
import AppFooter from '../Component/AppFooter';

const { Content } = Layout;

const HomePage = ({ 
  currentPage, 
  setCurrentPage, 
  onQuickCreate 
}) => {
  return (
    <Layout className="app-layout">
      <NavigationHeader 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      <Content style={{ marginTop: 64, padding: 0 }}>
        <HeroSection 
          onCreateUrl={onQuickCreate}
          onRegister={() => setCurrentPage('register')}
        />
        
        {/* <div className="stats-section stats-section--homepage">
          <StatisticsCards 
            stats={{
              totalUrls: 2847293,
              totalClicks: 18472841,
              activeUsers: 89374
            }}
            layout="grid"
            showTrends={false}
          />
        </div> */}
        
        {/* <FeatureCards /> */}
        
        <UsageSteps 
          onGetStarted={() => setCurrentPage('register')}
        />
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default HomePage;