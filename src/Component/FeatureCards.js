// src/Component/FeatureCards.js
import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  ThunderboltOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const FeatureCards = ({ 
  features,
  title = "為什麼選擇 Short Link？",
  subtitle = "我們提供企業級的短網址服務，幫助您更好地管理和分析您的連結"
}) => {
  const defaultFeatures = [
    {
      icon: ThunderboltOutlined,
      title: '極速創建',
      description: '一鍵創建專業短網址，支援自訂別名，讓您的品牌更加突出',
      colorClass: 'feature-icon--blue'
    },
    {
      icon: BarChartOutlined,
      title: '詳細分析',
      description: '即時追蹤點擊數據、地理位置、設備資訊，洞察用戶行為',
      colorClass: 'feature-icon--green'
    },
    {
      icon: SafetyCertificateOutlined,
      title: '安全可靠',
      description: '企業級安全保障，支援連結到期設定，確保您的數據安全',
      colorClass: 'feature-icon--purple'
    }
  ];

  const featureList = features || defaultFeatures;

  return (
    <div className="features-section">
      <div className="features-header">
        <Title level={2} className="features-title">{title}</Title>
        <Paragraph className="features-subtitle">
          {subtitle}
        </Paragraph>
      </div>
      
      <Row gutter={[32, 32]}>
        {featureList.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <Card hoverable className="feature-card">
              <feature.icon className={`feature-icon ${feature.colorClass}`} />
              <Title level={4}>{feature.title}</Title>
              <Paragraph>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeatureCards;