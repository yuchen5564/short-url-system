// src/pages/TagManagementPage.js
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Tag, 
  Table, 
  Modal, 
  Form, 
  Input, 
  message,
  Popconfirm,
  Row,
  Col,
  Typography,
  Statistic,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TagOutlined,
  BgColorsOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { 
  createTag, 
  getUserTags, 
  updateTag, 
  deleteTag,
  getUserUrls 
} from '../firebaseAuth/firebase';

const { Title, Text } = Typography;

// 預設顏色選項
const DEFAULT_COLORS = [
  '#f50', '#2db7f5', '#87d068', '#108ee9', 
  '#f04864', '#00a2ae', '#00b96b', '#eb2f96',
  '#722ed1', '#13c2c2', '#fa8c16', '#a0d911',
  '#fadb14', '#fa541c', '#9254de', '#36cfc9'
];

const TagManagementPage = ({ user }) => {
  const [tags, setTags] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [form] = Form.useForm();

  // 載入標籤和URL數據
  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [tagsResult, urlsResult] = await Promise.all([
        getUserTags(user.uid),
        getUserUrls(user.uid)
      ]);

      if (tagsResult.success) {
        setTags(tagsResult.tags);
      }
      if (urlsResult.success) {
        setUrls(urlsResult.urls);
      }
    } catch (error) {
      console.error('載入數據失敗:', error);
      message.error('載入數據失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // 創建或更新標籤
  const handleSubmit = async (values) => {
    if (!user) {
      message.error('請先登入');
      return;
    }

    setSubmitting(true);
    try {
      const tagData = {
        name: values.name.trim(),
        color: selectedColor,
        description: values.description?.trim() || ''
      };

      let result;
      if (editingTag) {
        result = await updateTag(editingTag.id, tagData);
      } else {
        result = await createTag(user.uid, tagData);
      }

      if (result.success) {
        message.success(editingTag ? '標籤更新成功' : '標籤創建成功');
        setShowModal(false);
        setEditingTag(null);
        form.resetFields();
        setSelectedColor(DEFAULT_COLORS[0]);
        await loadData();
      } else {
        message.error(`${editingTag ? '更新' : '創建'}標籤失敗：` + result.error);
      }
    } catch (error) {
      console.error('提交標籤錯誤:', error);
      message.error(`${editingTag ? '更新' : '創建'}標籤失敗`);
    } finally {
      setSubmitting(false);
    }
  };

  // 編輯標籤
  const handleEdit = (tag) => {
    setEditingTag(tag);
    setSelectedColor(tag.color);
    form.setFieldsValue({
      name: tag.name,
      description: tag.description
    });
    setShowModal(true);
  };

  // 刪除標籤
  const handleDelete = async (tagId) => {
    try {
      const result = await deleteTag(tagId);
      if (result.success) {
        message.success('標籤刪除成功');
        await loadData();
      } else {
        message.error('刪除標籤失敗：' + result.error);
      }
    } catch (error) {
      console.error('刪除標籤錯誤:', error);
      message.error('刪除標籤失敗');
    }
  };

  // 新建標籤
  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setSelectedColor(DEFAULT_COLORS[0]);
    setShowModal(true);
  };

  // 關閉模態框
  const handleCancel = () => {
    setShowModal(false);
    setEditingTag(null);
    form.resetFields();
    setSelectedColor(DEFAULT_COLORS[0]);
  };

  // 計算標籤統計
  const getTagStats = (tag) => {
    const urlsWithTag = urls.filter(url => 
      url.tags && url.tags.includes(tag.id)
    );
    return {
      urlCount: urlsWithTag.length,
      totalClicks: urlsWithTag.reduce((sum, url) => sum + (url.clicks || 0), 0)
    };
  };

  // 表格列定義
  const columns = [
    {
      title: '標籤',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Tag 
            color={record.color} 
            style={{ 
              fontSize: '14px', 
              padding: '4px 12px',
              borderRadius: 12,
              marginBottom: 4
            }}
          >
            {text}
          </Tag>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '使用統計',
      key: 'stats',
      render: (_, record) => {
        const stats = getTagStats(record);
        return (
          <div>
            <Text strong>{stats.urlCount}</Text>
            <Text type="secondary"> 個短網址</Text>
            {/* <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              總點擊: {stats.totalClicks}
            </Text> */}
          </div>
        );
      },
    },
    {
      title: '創建時間',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => {
        if (!createdAt) return '-';
        const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            編輯
          </Button>
          <Popconfirm
            title="確定要刪除這個標籤嗎？"
            description="刪除後將從所有使用此標籤的短網址中移除"
            onConfirm={() => handleDelete(record.id)}
            okText="確定"
            cancelText="取消"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
            >
              刪除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalUrls = urls.length;
  const urlsWithTags = urls.filter(url => url.tags && url.tags.length > 0).length;
  const tagCoverage = totalUrls > 0 ? ((urlsWithTags / totalUrls) * 100).toFixed(1) : 0;

  return (
    <div>
      {/* 統計概覽 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="總標籤數"
              value={tags.length}
              prefix={<TagOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="標記覆蓋率"
              value={tagCoverage}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="已標記短網址"
              value={urlsWithTags}
              suffix={`/ ${totalUrls}`}
              prefix={<LinkOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 標籤管理表格 */}
      <Card
        title={
          <Space>
            <TagOutlined />
            標籤管理
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建標籤
          </Button>
        }
      >
        <Table
          dataSource={tags}
          columns={columns}
          loading={loading}
          rowKey="id"
          locale={{
            emptyText: <Empty description="還沒有創建任何標籤" />
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `顯示 ${range[0]}-${range[1]} 項，共 ${total} 個標籤`,
          }}
        />
      </Card>

      {/* 創建/編輯標籤模態框 */}
      <Modal
        title={editingTag ? '編輯標籤' : '創建新標籤'}
        open={showModal}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="標籤名稱"
            name="name"
            rules={[
              { required: true, message: '請輸入標籤名稱' },
              { max: 20, message: '標籤名稱不能超過20個字符' }
            ]}
          >
            <Input 
              placeholder="輸入標籤名稱" 
              prefix={<TagOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="描述（選填）"
            name="description"
          >
            <Input 
              placeholder="標籤描述" 
              maxLength={100}
            />
          </Form.Item>

          <Form.Item label="標籤顏色">
            <div style={{ marginBottom: 12 }}>
              <Tag 
                color={selectedColor} 
                style={{ 
                  padding: '6px 16px', 
                  fontSize: '14px',
                  borderRadius: 16
                }}
              >
                預覽標籤
              </Tag>
            </div>
            <div>
              {DEFAULT_COLORS.map(color => (
                <Button
                  key={color}
                  size="small"
                  style={{
                    backgroundColor: color,
                    border: selectedColor === color ? '2px solid #000' : '1px solid #d9d9d9',
                    width: 32,
                    height: 32,
                    margin: '0 4px 4px 0',
                    borderRadius: '50%'
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                icon={editingTag ? <EditOutlined /> : <PlusOutlined />}
              >
                {editingTag ? '更新標籤' : '創建標籤'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagementPage;