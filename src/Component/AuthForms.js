// src/Component/AuthForms.js
import React from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  CheckCircleOutlined 
} from '@ant-design/icons';

const { Password } = Input;
const { Text } = Typography;

// 登入表單組件
export const LoginForm = ({ 
  onSubmit, 
  onSwitchToRegister, 
  loading = false 
}) => {
  const [form] = Form.useForm();

  return (
    <div className="slide-in-left">
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '請輸入信箱' },
            { type: 'email', message: '請輸入有效的信箱格式' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />}
            placeholder="信箱"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Password
            prefix={<LockOutlined />}
            placeholder="密碼"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
            loading={loading}
            className="transition-all"
          >
            登入
          </Button>
        </Form.Item>
      </Form>

      <Divider>或</Divider>

      <div className="text-center">
        <Text type="secondary">還沒有帳號？</Text>
        <Button type="link" onClick={onSwitchToRegister}>
          立即註冊
        </Button>
      </div>
    </div>
  );
};

// 註冊表單組件
export const RegisterForm = ({ 
  onSubmit, 
  onSwitchToLogin, 
  loading = false 
}) => {
  const [form] = Form.useForm();

  return (
    <div className="slide-in-left">
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="name"
          rules={[{ required: true, message: '請輸入姓名' }]}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="姓名"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: '請輸入信箱' },
            { type: 'email', message: '請輸入有效的信箱格式' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />}
            placeholder="信箱"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '請輸入密碼' },
            { min: 6, message: '密碼至少需要6個字符' }
          ]}
        >
          <Password
            prefix={<LockOutlined />}
            placeholder="密碼"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '請確認密碼' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('兩次輸入的密碼不一致'));
              },
            }),
          ]}
        >
          <Password
            prefix={<LockOutlined />}
            placeholder="確認密碼"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block
            loading={loading}
            className="transition-all"
          >
            註冊帳號
          </Button>
        </Form.Item>
      </Form>

      {/* 免費方案說明 */}
      <div className="auth-features">
        <Space direction="vertical" size="small">
          <Text className="auth-features__title">
            <CheckCircleOutlined style={{ marginRight: 8 }} />
            免費方案包含
          </Text>
          <Text className="auth-features__item">• 每月 1000 個短網址</Text>
          <Text className="auth-features__item">• 基礎分析報告</Text>
          <Text className="auth-features__item">• 自訂別名功能</Text>
        </Space>
      </div>

      <Divider>或</Divider>

      <div className="text-center">
        <Text type="secondary">已經有帳號？</Text>
        <Button type="link" onClick={onSwitchToLogin}>
          立即登入
        </Button>
      </div>
    </div>
  );
};

// 認證卡片包裝器
export const AuthCard = ({ 
  children, 
  title, 
  subtitle, 
  icon 
}) => {
  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-logo">
            {icon}
          </div>
          <Typography.Title level={3} className="auth-title">
            {title}
          </Typography.Title>
          <Text className="auth-subtitle">{subtitle}</Text>
        </div>
        {children}
      </div>
    </div>
  );
};