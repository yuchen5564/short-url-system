// src/Component/UrlForm.js
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Space, 
  Row, 
  Col, 
  Typography, 
  Card 
} from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const UrlForm = ({ 
  onSubmit, 
  loading = false, 
  showPreview = true,
  layout = 'vertical' 
}) => {
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreviewUrl(url);
  };

  const handleAliasChange = (e) => {
    setCustomAlias(e.target.value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    form.resetFields();
    setPreviewUrl('');
    setCustomAlias('');
  };

  return (
    <div>
      <Form
        form={form}
        layout={layout}
        onFinish={handleSubmit}
        onValuesChange={(changedValues) => {
          if (changedValues.originalUrl !== undefined) {
            setPreviewUrl(changedValues.originalUrl || '');
          }
          if (changedValues.customAlias !== undefined) {
            setCustomAlias(changedValues.customAlias || '');
          }
        }}
      >
        <Form.Item
          label="原始網址"
          name="originalUrl"
          rules={[
            { required: true, message: '請輸入原始網址' },
            { type: 'url', message: '請輸入有效的網址' }
          ]}
        >
          <Input 
            placeholder="https://example.com/your-long-url" 
            size="large"
            onChange={handleUrlChange}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="自訂別名"
              name="customAlias"
            >
              <Input 
                addonBefore="short.ly/" 
                placeholder="my-custom-link" 
                size="large"
                onChange={handleAliasChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="到期日期"
              name="expiryDate"
            >
              <DatePicker style={{ width: '100%' }} size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="描述"
          name="description"
        >
          <TextArea 
            placeholder="為此連結添加描述..." 
            rows={3}
            size="large"
          />
        </Form.Item>

        {showPreview && previewUrl && (
          <div style={{ marginBottom: 24 }}>
            <Card 
              size="small" 
              style={{ 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ color: '#52c41a' }}>預覽：</Text>
                  <br />
                  <Text code style={{ color: '#1890ff' }}>
                    https://short.ly/{customAlias || 'auto-generated'}
                  </Text>
                </div>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(`https://short.ly/${customAlias || 'auto-generated'}`)}
                />
              </div>
            </Card>
          </div>
        )}

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              icon={<PlusOutlined />}
              loading={loading}
            >
              創建短網址
            </Button>
            <Button 
              size="large" 
              onClick={resetForm}
            >
              清除
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UrlForm;