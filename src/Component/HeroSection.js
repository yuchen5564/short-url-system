// src/Component/HeroSection.js
import React, { useState } from 'react';
import { Typography, Space, Input, Button } from 'antd';

const { Title, Paragraph, Text } = Typography;

const HeroSection = ({ 
  onCreateUrl,
  onRegister 
}) => {
  const [urlInput, setUrlInput] = useState('');

  const handleQuickCreate = () => {
    if (urlInput && onCreateUrl) {
      onCreateUrl(urlInput);
    }
  };

  return (
    <div className="hero-section fade-in">
      <Title level={1} className="hero-title">
        簡化您的連結，放大您的影響力
      </Title>
      
      <Paragraph className="hero-subtitle">
        使用 ShortLink 創建專業的短網址，追蹤點擊數據，提升您的數位行銷效果
      </Paragraph>
      
      <Space direction="vertical" size="large" className="hero-input-container">
        <Input
          size="large"
          placeholder="貼上您的長網址..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="hero-input"
          suffix={
            <Button 
              type="primary" 
              style={{ border: 'none', height: 36 }}
              onClick={handleQuickCreate}
            >
              立即縮短
            </Button>
          }
        />
        
        <Text className="hero-hint">
          免費試用，無需註冊 • 支援自訂別名 • 詳細分析報告
        </Text>
      </Space>
    </div>
  );
};

export default HeroSection;