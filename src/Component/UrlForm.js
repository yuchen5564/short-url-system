// src/Component/UrlForm.js
import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Card,
  message,
  Select,
  Tag,
  Divider
} from 'antd';
import { PlusOutlined, CopyOutlined, TagOutlined } from '@ant-design/icons';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, getUserTags, updateTagUrlCount } from '../firebaseAuth/firebase';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

const UrlForm = ({ 
  onSubmit, 
  loading = false, 
  showPreview = true,
  layout = 'vertical',
  user // 新增用戶資訊 prop
}) => {
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [pastOriginalUrl, setPastOriginalUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // 生成隨機代碼
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 檢查短代碼是否已存在
  const checkCodeExists = async (code) => {
    const urlRef = doc(db, 'urlInfo', code);
    const urlSnap = await getDoc(urlRef);
    return urlSnap.exists();
  };

  // 載入用戶標籤
  const loadTags = async () => {
    if (!user || !user.uid) {
      return;
    }
    
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

  // 處理表單提交
  const handleSubmit = async (values) => {
    if (!user) {
      message.error('請先登入');
      return;
    }

    setSubmitting(true);
    
    try {
      const today = new Date();
      const datePost = dayjs(today).format('YYYY/MM/DD HH:mm:ss');
      
      let code = values.shortCode || generateRandomCode();

      // 如果是自訂代碼，檢查是否已存在
      if (values.shortCode) {
        const exists = await checkCodeExists(values.shortCode);
        if (exists) {
          throw new Error('此代碼已被使用，請嘗試其他代碼');
        }
      } else {
        // 如果是自動生成，確保不重複
        while (await checkCodeExists(code)) {
          code = generateRandomCode();
        }
      }

      // 創建 Firestore 文檔
      const docRef = doc(db, "urlInfo", code);
      await setDoc(docRef, {
        ptime: datePost,
        description: values.description || '',
        shortCode: code,
        originalUrl: values.originalUrl,
        userId: user.uid,
        userEmail: user.email,
        clicks: 0,
        tags: selectedTags || []
      });

      // 更新標籤的 URL 計數
      if (selectedTags && selectedTags.length > 0) {
        for (const tagId of selectedTags) {
          await updateTagUrlCount(tagId, 1);
        }
      }

      // 設定成功狀態
      setSuccess(true);
      setShortUrl(`https://s.merlinkuo.tw/${code}`);
      setPastOriginalUrl(values.originalUrl);
      
      // 呼叫父組件的 onSubmit（如果需要更新列表等）
      if (onSubmit) {
        onSubmit({
          ...values,
          shortCode: code,
          shortUrl: `https://s.merlinkuo.tw/${code}`,
          ptime: datePost
        });
      }

      message.success('短網址創建成功！');
      
      // 清除表單
      resetForm();
      
    } catch (error) {
      console.error('創建短網址失敗:', error);
      message.error(`創建失敗：${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreviewUrl(url);
  };

  const handleAliasChange = (e) => {
    setCustomAlias(e.target.value);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已複製到剪貼簿');
    } catch (err) {
      message.error('複製失敗');
    }
  };

  const resetForm = () => {
    form.resetFields();
    setPreviewUrl('');
    setCustomAlias('');
    setSuccess(false);
    setShortUrl('');
    setPastOriginalUrl('');
    setSelectedTags([]);
  };

  return (
    <div>
      {/* 成功創建提示 */}
      {success && (
        <Card 
          className="mb-24"
          style={{ 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f',
            marginBottom: 24
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
              🎉 短網址創建成功！
            </Text>
            <div style={{ marginTop: 12 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'white',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #d9d9d9'
              }}>
                <div>
                  <Text strong style={{ color: '#1890ff' }}>
                    {shortUrl}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    原網址：{pastOriginalUrl}
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(shortUrl)}
                  size="small"
                >
                  複製
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Form
        form={form}
        layout={layout}
        onFinish={handleSubmit}
        onValuesChange={(changedValues) => {
          if (changedValues.originalUrl !== undefined) {
            setPreviewUrl(changedValues.originalUrl || '');
          }
          if (changedValues.shortCode !== undefined) {
            setCustomAlias(changedValues.shortCode || '');
          }
        }}
      >
        <Form.Item
          label="描述"
          name="description"
          rules={[
            { required: true, message: '請輸入連結描述' }
          ]}
        >
          <Input 
            placeholder="關於此連結的描述" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="短代碼（選填）"
          name="shortCode"
          extra="留空將自動生成 6 位隨機代碼"
        >
          <Input 
            addonBefore="https://s.merlinkuo.tw/" 
            placeholder="your-custom-code" 
            size="large"
            onChange={handleAliasChange}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <TagOutlined />
              標籤（選填）
            </Space>
          }
          name="tags"
          extra={`為您的短網址添加標籤，方便分類和篩選。在側邊欄可以管理標籤。(當前標籤數量: ${tags.length})`}
        >
          <Select
            mode="multiple"
            placeholder="選擇標籤"
            size="large"
            value={selectedTags}
            onChange={setSelectedTags}
            optionLabelProp="label"
            maxTagCount="responsive"
            notFoundContent={tags.length === 0 ? '還沒有創建標籤，請先到標籤管理頁面創建' : '沒有找到標籤'}
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
        </Form.Item>

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
                    https://s.merlinkuo.tw/{customAlias || 'auto-generated'}
                  </Text>
                </div>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(`https://s.merlinkuo.tw/${customAlias || 'auto-generated'}`)}
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
              loading={submitting || loading}
            >
              創建短網址
            </Button>
            <Button 
              size="large" 
              onClick={resetForm}
              disabled={submitting}
            >
              清除
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 使用提示 */}
      <Card 
        title="使用提示" 
        size="small"
        style={{ marginTop: 24, background: '#fafafa' }}
      >
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>描述：</strong>幫助您記住此連結的用途</p>
          <p><strong>短代碼：</strong>自訂易記的代碼，留空將自動生成</p>
          <p><strong>標籤：</strong>為短網址添加標籤，方便分類管理</p>
          <p><strong>原始網址：</strong>要縮短的完整網址，必須包含 http:// 或 https://</p>
        </div>
      </Card>
    </div>
  );
};

export default UrlForm;