// src/Component/UrlDetailModal.js
import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Tag, 
  Divider,
  Row,
  Col,
  Card,
  message,
  Statistic,
  Select
} from 'antd';
import { 
  EditOutlined, 
  CopyOutlined, 
  ExportOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LinkOutlined,
  TagOutlined
} from '@ant-design/icons';
import { doc, updateDoc } from "firebase/firestore";
import { db, getUserTags, updateTagUrlCount } from '../firebaseAuth/firebase';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

const UrlDetailModal = ({ 
  visible, 
  onCancel, 
  urlData,
  onUpdate,
  loading = false,
  user // 新增用戶 prop
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // 載入用戶標籤
  const loadTags = async () => {
    if (!user) return;
    
    try {
      const result = await getUserTags(user.uid);
      if (result.success) {
        setTags(result.tags);
      }
    } catch (error) {
      console.error('載入標籤失敗:', error);
    }
  };

  useEffect(() => {
    if (visible && urlData) {
      form.setFieldsValue({
        description: urlData.description || '',
        originalUrl: urlData.originalUrl || ''
      });
      setSelectedTags(urlData.tags || []);
      setEditing(false);
    }
  }, [visible, urlData, form]);

  useEffect(() => {
    if (visible && user) {
      loadTags();
    }
  }, [visible, user]);

  const handleUpdate = async (values) => {
    if (!urlData?.id) {
      message.error('無效的連結ID');
      return;
    }

    setUpdating(true);
    try {
      const oldTags = urlData.tags || [];
      const newTags = selectedTags;

      // 計算標籤變化
      const removedTags = oldTags.filter(tagId => !newTags.includes(tagId));
      const addedTags = newTags.filter(tagId => !oldTags.includes(tagId));

      // 更新 Firestore 文檔
      const docRef = doc(db, "urlInfo", urlData.id);
      await updateDoc(docRef, {
        description: values.description,
        originalUrl: values.originalUrl,
        tags: selectedTags,
        lastModified: dayjs().format('YYYY/MM/DD HH:mm:ss')
      });

      // 更新標籤計數
      for (const tagId of removedTags) {
        await updateTagUrlCount(tagId, -1);
      }
      for (const tagId of addedTags) {
        await updateTagUrlCount(tagId, 1);
      }

      message.success('連結資料更新成功');
      setEditing(false);
      
      // 通知父組件更新
      if (onUpdate) {
        onUpdate({
          ...urlData,
          description: values.description,
          originalUrl: values.originalUrl,
          tags: selectedTags,
          lastModified: dayjs().format('YYYY/MM/DD HH:mm:ss')
        });
      }
    } catch (error) {
      console.error('更新失敗:', error);
      message.error('更新失敗，請稍後再試');
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已複製到剪貼簿');
    } catch (err) {
      message.error('複製失敗');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
    onCancel();
  };

  if (!urlData) return null;

  const shortUrl = `https://s.merlinkuo.tw/${urlData.shortCode}`;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LinkOutlined style={{ color: '#1890ff' }} />
          連結詳細資料
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={
        <Space>
          <Button onClick={handleCancel}>
            關閉
          </Button>
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)}>
                取消編輯
              </Button>
              <Button 
                type="primary" 
                onClick={() => form.submit()}
                loading={updating}
              >
                儲存變更
              </Button>
            </>
          ) : (
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            >
              編輯資料
            </Button>
          )}
        </Space>
      }
    >
      <div>
      <br />
        {/* 基本資訊卡片 */}
        {/* <Card size="small" style={{ marginBottom: 16, background: '#f8f9fa' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="總點擊數"
                value={urlData.clicks || 0}
                prefix={<BarChartOutlined style={{ color: '#52c41a' }} />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="建立時間"
                value={urlData.ptime ? urlData.ptime.split(' ')[0] : 'N/A'}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              />
            </Col>
          </Row>
        </Card> */}

        {/* 短網址資訊 */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>短網址</Title>
          <div style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: 8,
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                {shortUrl}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                短代碼: {urlData.shortCode} (不可修改)
              </Text>
            </div>
            <Space>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(shortUrl)}
                size="small"
              >
                複製
              </Button>
              <Button
                type="text"
                icon={<ExportOutlined />}
                onClick={() => window.open(shortUrl, '_blank')}
                size="small"
              >
                訪問
              </Button>
            </Space>
          </div>
        </div>

        <Divider />

        {/* 可編輯資料 */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            label="連結描述"
            name="description"
            rules={[
              { required: true, message: '請輸入連結描述' }
            ]}
          >
            {editing ? (
              <Input 
                placeholder="請輸入連結描述"
                size="large"
              />
            ) : (
              <div style={{ 
                padding: 12,
                background: '#fafafa',
                borderRadius: 8,
                border: '1px solid #d9d9d9'
              }}>
                <Text>{urlData.description || '無描述'}</Text>
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="原始網址"
            name="originalUrl"
            rules={[
              { required: true, message: '請輸入原始網址' },
              { type: 'url', message: '請輸入有效的網址格式' }
            ]}
          >
            {editing ? (
              <Input 
                placeholder="請輸入原始網址"
                size="large"
              />
            ) : (
              <div style={{ 
                padding: 12,
                background: '#fafafa',
                borderRadius: 8,
                border: '1px solid #d9d9d9'
              }}>
                <Text 
                  style={{ wordBreak: 'break-all' }}
                  copyable={{ 
                    text: urlData.originalUrl,
                    tooltips: ['複製原始網址', '已複製!']
                  }}
                >
                  {urlData.originalUrl}
                </Text>
              </div>
            )}
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <TagOutlined />
                標籤
              </Space>
            }
          >
            {editing ? (
              <Select
                mode="multiple"
                placeholder="選擇標籤"
                size="large"
                value={selectedTags}
                onChange={setSelectedTags}
                optionLabelProp="label"
                maxTagCount="responsive"
                style={{ width: '100%' }}
              >
                {tags.map(tag => (
                  <Select.Option 
                    key={tag.id} 
                    value={tag.id}
                    label={
                      <Tag color={tag.color} style={{ margin: 0 }}>
                        {tag.name}
                      </Tag>
                    }
                  >
                    <Tag color={tag.color} style={{ margin: 0 }}>
                      {tag.name}
                    </Tag>
                    {tag.description && (
                      <span style={{ marginLeft: 8, color: '#999', fontSize: '12px' }}>
                        {tag.description}
                      </span>
                    )}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <div style={{ 
                padding: 12,
                background: '#fafafa',
                borderRadius: 8,
                border: '1px solid #d9d9d9',
                minHeight: 40
              }}>
                {(urlData.tags && urlData.tags.length > 0) ? (
                  <Space wrap>
                    {urlData.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <Tag key={tagId} color={tag.color}>
                          {tag.name}
                        </Tag>
                      ) : (
                        <Tag key={tagId} color="default">
                          未知標籤
                        </Tag>
                      );
                    })}
                  </Space>
                ) : (
                  <Text type="secondary">無標籤</Text>
                )}
              </div>
            )}
          </Form.Item>
        </Form>

        {/* 其他資訊 */}
        <Divider />
        <div>
          <Title level={5}>其他資訊</Title>
          <Row gutter={[16, 8]}>
            {/* <Col span={12}>
              <Text type="secondary">建立者：</Text>
              <Text>{urlData.userEmail || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">狀態：</Text>
              <Tag color="green">活躍</Tag>
            </Col> */}
            <Col span={12}>
              <Text type="secondary">建立時間：</Text>
              <Text>{urlData.ptime || 'N/A'}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">最後修改：</Text>
              <Text>{urlData.lastModified || '從未修改'}</Text>
            </Col>
          </Row>
        </div>

        {editing && (
          <div style={{ 
            marginTop: 16, 
            padding: 12,
            background: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: 8
          }}>
            <Text style={{ color: '#d46b08', fontSize: '12px' }}>
              💡 提示：短代碼（{urlData.shortCode}）無法修改，但您可以修改描述和原始網址。
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UrlDetailModal;