// src/Component/UrlTable.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Tooltip, Typography, notification, Input, Row, Col, Select, Divider, Card } from 'antd';
import { 
  CopyOutlined, 
  EyeOutlined, 
  ExportOutlined, 
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  TagOutlined,
  ClearOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { getUserTags } from '../firebaseAuth/firebase';
import UrlDetailModal from './UrlDetailModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const { Text } = Typography;

const UrlTable = ({ 
  urls = [], 
  onDelete, 
  onUpdate,
  onRefresh, // 新增重新整理函數 prop
  loading = false,
  pagination = true,
  user // 新增用戶資訊 prop
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // 添加分頁狀態管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 標籤相關狀態
  const [tags, setTags] = useState([]);
  const [selectedTagFilter, setSelectedTagFilter] = useState([]);
  
  // 載入用戶標籤
  const loadTags = async () => {
    if (!user || !user.uid) return;
    
    try {
      const result = await getUserTags(user.uid);
      if (result.success) {
        setTags(result.tags);
      }
    } catch (error) {
      console.error('載入標籤失敗:', error);
    }
  };

  // 組件載入時載入標籤
  useEffect(() => {
    if (user && user.uid) {
      loadTags();
    }
  }, [user]);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notification.success({
      message: '複製成功',
      description: '短網址已複製到剪貼簿',
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

  const handleUpdate = async (updatedData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    
    // 重新載入標籤以更新計數
    await loadTags();
    
    setShowDetailModal(false);
    setSelectedUrl(null);
  };

  // 處理分頁變化
  const handleTableChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 處理頁面大小變化
  const handleShowSizeChange = (current, size) => {
    setCurrentPage(1); // 切換頁面大小時重置到第一頁
    setPageSize(size);
  };

  // 過濾數據
  const filteredUrls = urls.filter(url => {
    // 文本搜尋過濾
    const matchesSearch = !searchTerm || (
      (url.originalUrl && url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (url.shortCode && url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (url.description && url.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // 標籤過濾
    const matchesTags = selectedTagFilter.length === 0 || (
      url.tags && url.tags.some(tagId => selectedTagFilter.includes(tagId))
    );
    
    return matchesSearch && matchesTags;
  });

  // 當搜尋條件改變時重置到第一頁
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTagFilter]);

  const columns = [
    {
      title: '連結資訊',
      dataIndex: 'shortCode',
      key: 'shortCode',
      width: '35%',
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
      title: '標籤',
      dataIndex: 'tags',
      key: 'tags',
      width: '20%',
      render: (tagIds, record) => (
        <div style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}>
          {tagIds && tagIds.length > 0 ? (
            <Space wrap size={[4, 4]}>
              {tagIds.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <Tag 
                    key={tagId} 
                    color={tag.color}
                    style={{ 
                      fontSize: '12px',
                      margin: 0,
                      borderRadius: 12
                    }}
                  >
                    {tag.name}
                  </Tag>
                ) : (
                  <Tag 
                    key={tagId} 
                    color="default"
                    style={{ 
                      fontSize: '12px',
                      margin: 0,
                      borderRadius: 12
                    }}
                  >
                    未知標籤
                  </Tag>
                );
              })}
            </Space>
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              無標籤
            </Text>
          )}
        </div>
      ),
    },
    // {
    //   title: '點擊數',
    //   dataIndex: 'clicks',
    //   key: 'clicks',
    //   width: '15%',
    //   sorter: (a, b) => (a.clicks || 0) - (b.clicks || 0),
    //   render: (clicks) => (
    //     <Tag color="blue">{clicks ? clicks.toLocaleString() : 0}</Tag>
    //   ),
    // },
    {
      title: '建立時間',
      dataIndex: 'ptime',
      key: 'ptime',
      width: '15%',
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
    // {
    //   title: '狀態',
    //   key: 'status',
    //   width: '10%',
    //   render: () => (
    //     <Tag color="green">活躍</Tag>
    //   ),
    // },
    {
      title: '操作',
      key: 'actions',
      width: '10%',
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
    current: currentPage,
    pageSize: pageSize,
    total: filteredUrls.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `顯示 ${range[0]}-${range[1]} 項，共 ${total} 條記錄`,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: handleTableChange,
    onShowSizeChange: handleShowSizeChange
  } : false;

  return (
    <div>
      {/* 搜尋和操作欄 */}
      <Row justify="space-between" style={{ marginBottom: 16 }} gutter={16}>
        <Col xs={24} md={12}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="搜尋連結、描述或代碼..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
              style={{ flex: 1 }}
            />
            <Select
              mode="multiple"
              placeholder="標籤篩選"
              size="large"
              value={selectedTagFilter}
              onChange={setSelectedTagFilter}
              allowClear
              maxTagCount="responsive"
              style={{ minWidth: 150, maxWidth: 200 }}
              suffixIcon={<TagOutlined />}
            >
              {tags.map(tag => (
                <Select.Option key={tag.id} value={tag.id}>
                  <Tag color={tag.color} style={{ margin: 0 }}>
                    {tag.name}
                  </Tag>
                  <span style={{ marginLeft: 8, color: '#999' }}>
                    ({tag.urlCount || 0})
                  </span>
                </Select.Option>
              ))}
            </Select>
          </Space.Compact>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space>
            {onRefresh && (
              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={onRefresh}
                loading={loading}
              >
                重新整理
              </Button>
            )}
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

      {/* 重新整理和篩選狀態 */}
      {(selectedTagFilter.length > 0 || searchTerm) && (
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Text style={{ color: '#52c41a' }}>
                    <FilterOutlined /> 篩選狀態：
                  </Text>
                  {searchTerm && (
                    <Tag color="blue">
                      搜尋: "{searchTerm}"
                    </Tag>
                  )}
                  {selectedTagFilter.length > 0 && (
                    <Space wrap>
                      {selectedTagFilter.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Tag key={tagId} color={tag.color}>
                            {tag.name}
                          </Tag>
                        ) : null;
                      })}
                    </Space>
                  )}
                </div>
                <Space>
                  {onRefresh && (
                    <Button
                      icon={<ReloadOutlined />}
                      size="small"
                      onClick={onRefresh}
                      loading={loading}
                    >
                      重新整理
                    </Button>
                  )}
                  <Button
                    icon={<ClearOutlined />}
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTagFilter([]);
                    }}
                  >
                    清除所有篩選
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      )}

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
            總共 {urls.length} 個短網址
            {/* ，累計點擊 {urls.reduce((sum, url) => sum + (url.clicks || 0), 0)} 次 */}
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
        user={user}
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