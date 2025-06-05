// src/Component/ActivityLists.js
import React from 'react';
import { Card, List, Avatar, Typography, Button, Row, Col } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Text } = Typography;

// 最近活動組件
export const RecentActivity = ({ 
  urls = [], 
  title = "最近活動",
  maxItems = 5,
  onViewMore 
}) => {
  const recentUrls = urls.slice(0, maxItems);

  return (
    <Card 
      title={title} 
      extra={
        onViewMore && (
          <Button type="link" onClick={onViewMore}>
            查看更多
          </Button>
        )
      }
    >
      <List
        dataSource={recentUrls}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<LinkOutlined />} />}
              title={item.alias}
              description={`${item.clicks || 0} 次點擊`}
            />
            <Text type="secondary">{item.createdAt}</Text>
          </List.Item>
        )}
        locale={{ emptyText: '暫無活動記錄' }}
      />
    </Card>
  );
};

// 熱門連結組件
export const PopularLinks = ({ 
  urls = [], 
  title = "熱門連結",
  maxItems = 5,
  onViewMore 
}) => {
  const sortedUrls = [...urls]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, maxItems);

  const getRankStyle = (index) => {
    const colors = ['#faad14', '#d9d9d9', '#fa8c16', '#1890ff'];
    return {
      backgroundColor: colors[index] || '#1890ff'
    };
  };

  return (
    <Card 
      title={title} 
      extra={
        onViewMore && (
          <Button type="link" onClick={onViewMore}>
            查看更多
          </Button>
        )
      }
    >
      <List
        dataSource={sortedUrls}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar style={getRankStyle(index)}>
                  {index + 1}
                </Avatar>
              }
              title={item.alias}
              description={`${item.clicks || 0} 次點擊`}
            />
          </List.Item>
        )}
        locale={{ emptyText: '暫無熱門連結' }}
      />
    </Card>
  );
};

// 組合活動面板
export const ActivityPanel = ({ 
  urls = [], 
  onViewMoreActivity,
  onViewMorePopular 
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <RecentActivity 
          urls={urls} 
          onViewMore={onViewMoreActivity}
        />
      </Col>
      <Col span={12}>
        <PopularLinks 
          urls={urls} 
          onViewMore={onViewMorePopular}
        />
      </Col>
    </Row>
  );
}; 