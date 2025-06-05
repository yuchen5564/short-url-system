// src/Component/LogoutModal.js
import React from 'react';
import { Modal, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, LogoutOutlined } from '@ant-design/icons';

const { Text } = Typography;

const LogoutModal = ({ 
  visible, 
  onConfirm, 
  onCancel, 
  loading = false,
  userName 
}) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          確認登出
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="確認登出"
      cancelText="取消"
      okButtonProps={{ 
        loading,
        danger: true,
        icon: <LogoutOutlined />
      }}
      cancelButtonProps={{ 
        disabled: loading 
      }}
      centered
      width={400}
    >
      <div style={{ padding: '16px 0' }}>
        <Text>
          {userName ? `${userName}，您` : '您'}確定要登出嗎？
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: '0.9rem' }}>
          登出後您將需要重新登入才能使用完整功能。
        </Text>
      </div>
    </Modal>
  );
};

export default LogoutModal;