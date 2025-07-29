// src/Component/TagStatistics.js
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Tag, 
  Typography, 
  Progress, 
  Space,
  Statistic,
  Empty,
  Divider
} from 'antd';
import { 
  TagOutlined, 
  LinkOutlined, 
  BarChartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { getUserTags } from '../firebaseAuth/firebase';

const { Title, Text } = Typography;

const TagStatistics = ({ user, urls = [] }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // 載入用戶標籤
  const loadTags = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await getUserTags(user.uid);
      if (result.success) {
        setTags(result.tags);
      }
    } catch (error) {
      console.error('載入標籤失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTags();
    }
  }, [user]);

  // 計算標籤統計
  const getTagStatistics = () => {
    const tagStats = tags.map(tag => {
      const urlsWithTag = urls.filter(url => 
        url.tags && url.tags.includes(tag.id)
      );
      
      const totalClicks = urlsWithTag.reduce((sum, url) => 
        sum + (url.clicks || 0), 0
      );

      return {
        ...tag,
        urlCount: urlsWithTag.length,
        totalClicks,
        urls: urlsWithTag
      };
    });

    // 按 URL 數量排序
    return tagStats.sort((a, b) => b.urlCount - a.urlCount);
  };

  const tagStatistics = getTagStatistics();
  const totalUrls = urls.length;
  const totalTags = tags.length;
  const urlsWithTags = urls.filter(url => url.tags && url.tags.length > 0).length;

  // 最受歡迎的標籤（按 URL 數量）
  const mostPopularTag = tagStatistics.length > 0 ? tagStatistics[0] : null;

  if (totalTags === 0) {
    return (
      <Card title={
        <Space>
          <BarChartOutlined />
          標籤統計
        </Space>
      }>
        <Empty 
          description="還沒有創建任何標籤"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <div>
      {/* 總覽統計 */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            標籤統計總覽
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="總標籤數"
              value={totalTags}
              prefix={<TagOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="已標記短網址"
              value={urlsWithTags}
              prefix={<LinkOutlined />}
              suffix={`/ ${totalUrls}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="標記覆蓋率"
              value={totalUrls > 0 ? ((urlsWithTags / totalUrls) * 100).toFixed(1) : 0}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>

        {mostPopularTag && (
          <>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Space direction="vertical">
                <Text type="secondary">
                  <TrophyOutlined /> 最受歡迎標籤
                </Text>
                <Tag 
                  color={mostPopularTag.color} 
                  style={{ 
                    fontSize: '16px', 
                    padding: '8px 16px',
                    borderRadius: 16 
                  }}
                >
                  {mostPopularTag.name}
                </Tag>
                <Text type="secondary">
                  {mostPopularTag.urlCount} 個短網址使用此標籤
                </Text>
              </Space>
            </div>
          </>
        )}
      </Card>

      {/* 詳細標籤統計 */}
      <Card 
        title="各標籤使用情況"
        size="small"
        loading={loading}
      >
        {tagStatistics.length === 0 ? (
          <Empty 
            description="沒有標籤數據"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {tagStatistics.map(tag => {
              const percentage = totalUrls > 0 ? 
                ((tag.urlCount / totalUrls) * 100) : 0;
              
              return (
                <Col xs={24} sm={12} md={8} key={tag.id}>
                  <Card size="small" style={{ height: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                      <Tag 
                        color={tag.color} 
                        style={{ 
                          fontSize: '14px', 
                          padding: '4px 12px',
                          borderRadius: 12,
                          marginBottom: 8
                        }}
                      >
                        {tag.name}
                      </Tag>
                      {tag.description && (
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#999',
                          marginBottom: 8
                        }}>
                          {tag.description}
                        </div>
                      )}
                    </div>
                    
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: '12px' }}>使用次數</Text>
                        <Text strong>{tag.urlCount}</Text>
                      </div>
                      
                      <Progress 
                        percent={percentage} 
                        size="small"
                        strokeColor={tag.color}
                        showInfo={false}
                      />
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: '#999'
                      }}>
                        <span>占比 {percentage.toFixed(1)}%</span>
                        {/* <span>點擊 {tag.totalClicks}</span> */}
                      </div>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>
    </div>
  );
};

export default TagStatistics;