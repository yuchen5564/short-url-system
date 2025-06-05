// src/Component/UserProfileModal.js
import React from 'react';
import { Modal, Form, Input, Avatar, Upload, Button, message } from 'antd';
import { UserOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons';

const UserProfileModal = ({ 
  visible, 
  onCancel, 
  onUpdate,
  user,
  loading = false 
}) => {
  const [form] = Form.useForm();

  // 初始化表單值
  React.useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        bio: user.bio || ''
      });
    }
  }, [visible, user, form]);

  const handleSubmit = (values) => {
    if (onUpdate) {
      onUpdate(values);
    }
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('頭像上傳成功');
      // 這裡處理頭像上傳邏輯
    } else if (info.file.status === 'error') {
      message.error('頭像上傳失敗');
    }
  };

  return (
    <Modal
      title="個人資料"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="儲存變更"
      cancelText="取消"
      okButtonProps={{ loading }}
      width={500}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        {/* 頭像區域 */}
        <div className="text-center mb-24">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar 
              size={80} 
              icon={<UserOutlined />}
              src={user?.avatar}
              style={{ marginBottom: 16 }}
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false} // 阻止自動上傳
              onChange={handleAvatarUpload}
            >
              <Button 
                type="text" 
                size="small"
                icon={<CameraOutlined />}
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: -5,
                  background: 'white',
                  border: '1px solid #d9d9d9',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </Upload>
          </div>
        </div>

        {/* 表單區域 */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '請輸入姓名' }]}
          >
            <Input placeholder="輸入您的姓名" />
          </Form.Item>

          <Form.Item
            label="信箱"
            name="email"
            rules={[
              { required: true, message: '請輸入信箱' },
              { type: 'email', message: '請輸入有效的信箱格式' }
            ]}
          >
            <Input placeholder="輸入您的信箱" disabled />
          </Form.Item>

          <Form.Item
            label="個人簡介"
            name="bio"
          >
            <Input.TextArea 
              rows={3}
              placeholder="簡單介紹一下自己..."
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserProfileModal;