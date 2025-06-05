// src/Component/UrlTable.js
import React from 'react';
import { Table, Button, Space, Tag, Tooltip, Typography, notification } from 'antd';
import { 
  CopyOutlined, 
  EyeOutlined, 
  ExportOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const UrlTable = ({ 
  urls = [], 
  onDelete, 
  onView, 
  loading = false,
  pagination = true 
}) => {
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notification.success({
      message: '複製成功',
      description: '短網址已複製到剪貼板',
      placement: 'topRight'
    });
  };

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleView = (record) => {
    if (onView) {
      onView(record);
    }
  };

  const columns = [
    {
      title: '連結',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      render: (text, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text strong style={{ color: '#1890ff' }}>{text}</Text>
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text)}
            />
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.originalUrl && record.originalUrl.length > 50 ? 
              record.originalUrl.substring(0, 50) + '...' : 
              record.originalUrl
            }
          </Text>
        </div>
      ),
    },
    {
      title: '點擊數',
      dataIndex: 'clicks',
      key: 'clicks',
      render: (clicks) => (
        <Tag color="blue">{clicks ? clicks.toLocaleString() : 0}</Tag>
      ),
    },
    {
      title: '建立日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活躍' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看詳情">
            <Button 
              type="text" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="訪問原網址">
            <Button 
              type="text" 
              size="small" 
              icon={<ExportOutlined />}
              onClick={() => window.open(record.originalUrl, '_blank')}
            />
          </Tooltip>
          <Tooltip title="刪除">
            <Button 
              type="text" 
              size="small" 
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const paginationConfig = pagination ? {
    total: urls.length,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 條記錄`
  } : false;

  return (
    <Table
      columns={columns}
      dataSource={urls}
      loading={loading}
      pagination={paginationConfig}
      rowKey="id"
    />
  );
};

export default UrlTable;