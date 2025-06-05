// src/Component/UsageSteps.js
import React from 'react';
import { Steps, Row, Col, Typography, Button } from 'antd';
import {
  UserOutlined,
  LinkOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const UsageSteps = ({ 
  onGetStarted,
  title = "三步驟開始使用",
  steps,
  ctaText = "免費開始使用" 
}) => {
  const defaultSteps = [
    {
      title: '註冊帳號',
      description: '免費註冊，立即開始',
      icon: <UserOutlined />
    },
    {
      title: '創建短網址',
      description: '貼上連結，一鍵生成',
      icon: <LinkOutlined />
    },
    {
      title: '分析數據',
      description: '追蹤成效，優化策略',
      icon: <BarChartOutlined />
    }
  ];

  const stepList = steps || defaultSteps;

  return (
    <div style={{ padding: '80px 50px', background: 'white' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <Title level={2}>{title}</Title>
      </div>
      
      <Row justify="center">
        <Col xs={24} lg={16}>
          <Steps
            direction="horizontal"
            size="large"
            current={-1} // 不突出顯示任何步驟
            items={stepList}
            responsive
          />
        </Col>
      </Row>
      
      {onGetStarted && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={onGetStarted}
            style={{ 
              height: 50, 
              paddingLeft: 32, 
              paddingRight: 32,
              borderRadius: 8
            }}
          >
            {ctaText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsageSteps;