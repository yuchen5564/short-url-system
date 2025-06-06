// src/Component/UrlTable.js
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Typography, notification, Input, Row, Col } from 'antd';
import { 
  CopyOutlined, 
  EyeOutlined, 
  ExportOutlined, 
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import UrlDetailModal from './UrlDetailModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const { Text } = Typography;

const UrlTable = ({ 
  urls = [], 
  onDelete, 
  onUpdate,
  loading = false,
  pagination = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notification.success({
      message: '複製成功',
      description: '短網址已複製到剪貼板',
      placement: 'topRight'
    });
  };

  const handleView = (record) => {
    setSelectedUrl(record);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedUrl(record);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrl || !onDelete) return;

    setDeleteLoading(true);
    try {
      await onDelete(selectedUrl.id);
      setShowDeleteModal(false);
      setSelectedUrl(null);
    } catch (error) {
      console.error('刪除失敗:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = (updatedData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    setShowDetailModal(false);
    setSelectedUrl(null);
  };

  // 過濾數據
  const filteredUrls = urls.filter(url => 
    (url.originalUrl && url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (url.shortCode && url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (url.description && url.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    {
      title: '連結資訊',
      dataIndex: 'shortCode',
      key: 'shortCode',
      width: '40%',
      render: (text, record) => (
        <div>
          <Text type="secondary" style={{ fontSize: '20px' }}>
            {record.description || '無描述'}
          </Text>
          <br />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text strong style={{ color: '#1890ff' }}>
              https://s.merlinkuo.tw/{text}
            </Text>
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(`https://s.merlinkuo.tw/${text}`)}
            />
          </div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.originalUrl && record.originalUrl.length > 60 ? 
              record.originalUrl.substring(0, 60) + '...' : 
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
      width: '15%',
      sorter: (a, b) => (a.clicks || 0) - (b.clicks || 0),
      render: (clicks) => (
        <Tag color="blue">{clicks ? clicks.toLocaleString() : 0}</Tag>
      ),
    },
    {
      title: '建立時間',
      dataIndex: 'ptime',
      key: 'ptime',
      width: '20%',
      sorter: (a, b) => new Date(a.ptime) - new Date(b.ptime),
      render: (ptime) => (
        <div>
          <Text style={{ fontSize: '13px' }}>
            {ptime ? ptime.split(' ')[0] : 'N/A'}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {ptime ? ptime.split(' ')[1] : ''}
          </Text>
        </div>
      ),
    },
    {
      title: '狀態',
      key: 'status',
      width: '10%',
      render: () => (
        <Tag color="green">活躍</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看詳情">
            <Button 
              type="text" 
              size="small" 
              icon={<InfoCircleOutlined style={{ fontSize: '18px', color: '#08c' }} />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="訪問原網址">
            <Button 
              type="text" 
              size="small" 
              icon={<ExportOutlined style={{ fontSize: '18px' }} />}
              onClick={() => window.open(record.originalUrl, '_blank')}
            />
          </Tooltip>
          <Tooltip title="刪除">
            <Button 
              type="text" 
              size="small" 
              icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
              danger
              onClick={() => handleDeleteClick(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const paginationConfig = pagination ? {
    total: filteredUrls.length,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 條記錄`,
    pageSizeOptions: ['10', '20', '50', '100']
  } : false;

  return (
    <div>
      {/* 搜尋和操作欄 */}
      <Row justify="space-between" style={{ marginBottom: 16 }} gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="搜尋連結、描述或代碼..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8} style={{ textAlign: 'right' }}>
          <Space>
            <Button 
              icon={<FilterOutlined />} 
              size="large"
              disabled
            >
              篩選
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              size="large"
              disabled
            >
              匯出
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 數據表格 */}

      {/* 數據表格 */}
      <Table
        columns={columns}
        dataSource={filteredUrls}
        loading={loading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ x: 800 }}
        locale={{
          emptyText: searchTerm ? '沒有找到符合條件的連結' : '還沒有創建任何短網址'
        }}
      />

      {/* 統計資訊 */}
      {urls.length > 0 && (
        <div style={{ 
          marginTop: 16, 
          padding: 16, 
          background: '#fafafa', 
          borderRadius: 8,
          textAlign: 'center' 
        }}>
          <Text type="secondary">
            總共 {urls.length} 個短網址，累計點擊 {urls.reduce((sum, url) => sum + (url.clicks || 0), 0)} 次
          </Text>
        </div>
      )}

      {/* 詳細資料模態框 */}
      <UrlDetailModal
        visible={showDetailModal}
        onCancel={() => {
          setShowDetailModal(false);
          setSelectedUrl(null);
        }}
        urlData={selectedUrl}
        onUpdate={handleUpdate}
      />

      {/* 刪除確認模態框 */}
      <DeleteConfirmModal
        visible={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedUrl(null);
        }}
        urlData={selectedUrl}
        loading={deleteLoading}
      />
    </div>
  );
};

export default UrlTable;