// src/Component/StatisticsCards.js
import React from 'react';
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { 
  LinkOutlined, 
  RiseOutlined, 
  BarChartOutlined, 
  TeamOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const StatisticsCards = ({ 
  stats, 
  layout = 'horizontal', // 'horizontal' or 'grid'
  showTrends = true 
}) => {
  const defaultStats = {
    totalUrls: 0,
    totalClicks: 0,
    todayClicks: 0,
    activeUsers: 0,
    trends: {
      totalUrls: 0,
      totalClicks: 0,
      todayClicks: 0,
      activeUsers: 0
    }
  };

  const data = { ...defaultStats, ...stats };

  const statsConfig = [
    {
      title: '總連結數',
      value: data.totalUrls,
      icon: LinkOutlined,
      color: '#1890ff',
      trend: data.trends?.totalUrls || 12
    },
    {
      title: '總點擊數',
      value: data.totalClicks,
      icon: RiseOutlined,
      color: '#52c41a',
      trend: data.trends?.totalClicks || 8
    },
    {
      title: '今日點擊',
      value: data.todayClicks,
      icon: BarChartOutlined,
      color: '#722ed1',
      trend: data.trends?.todayClicks || -3
    },
    {
      title: '活躍用戶',
      value: data.activeUsers,
      icon: TeamOutlined,
      color: '#fa8c16',
      trend: data.trends?.activeUsers || 15
    }
  ];

  const StatCard = ({ item }) => (
    <Card>
      <Statistic
        title={item.title}
        value={item.value}
        prefix={<item.icon style={{ color: item.color }} />}
        suffix={
          showTrends && (
            <Text type={item.trend > 0 ? 'success' : 'danger'}>
              {item.trend > 0 ? '+' : ''}{item.trend}%
            </Text>
          )
        }
      />
    </Card>
  );

  if (layout === 'horizontal') {
    return (
      <Row gutter={[16, 16]}>
        {statsConfig.map((item, index) => (
          <Col span={6} key={index}>
            <StatCard item={item} />
          </Col>
        ))}
      </Row>
    );
  }

  // Grid layout for homepage
  return (
    <Row gutter={[32, 32]} justify="center">
      {statsConfig.slice(0, 3).map((item, index) => (
        <Col xs={24} sm={8} style={{ textAlign: 'center' }} key={index}>
          <Statistic
            title={item.title}
            value={item.value}
            suffix="+"
            valueStyle={{ color: item.color, fontSize: '2.5rem' }}
          />
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;