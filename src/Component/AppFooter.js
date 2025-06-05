// src/Component/AppFooter.js
import React from 'react';
import { Layout, Space, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = ({ 
  links,
  copyright = "© 2024 ShortLink. 版權所有",
  background = "#001529",
  textColor = "white"
}) => {
  const defaultLinks = [
    { label: '服務條款', href: '/terms' },
    { label: '隱私政策', href: '/privacy' },
    { label: 'API 文檔', href: '/api' },
    { label: '聯絡我們', href: '/contact' }
  ];

  const footerLinks = links || defaultLinks;

  return (
    <Footer style={{ 
      textAlign: 'center', 
      background, 
      color: textColor, 
      padding: '40px 50px' 
    }}>
      <div style={{ marginBottom: 20 }}>
        <Space size="large">
          {footerLinks.map((link, index) => (
            <Text 
              key={index}
              style={{ 
                color: textColor, 
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.8'}
              onClick={() => {
                if (link.onClick) {
                  link.onClick();
                } else if (link.href) {
                  window.open(link.href, '_blank');
                }
              }}
            >
              {link.label}
            </Text>
          ))}
        </Space>
      </div>
      <Text style={{ color: `rgba(${textColor === 'white' ? '255,255,255' : '0,0,0'},0.6)` }}>
        {copyright}
      </Text>
    </Footer>
  );
};

export default AppFooter;