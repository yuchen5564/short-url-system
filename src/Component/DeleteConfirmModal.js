// src/Component/DeleteConfirmModal.js
import React from 'react';
import { Modal, Typography, Space, Tag } from 'antd';
import { 
  ExclamationCircleOutlined, 
  DeleteOutlined,
  LinkOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmModal = ({ 
  visible, 
  onConfirm, 
  onCancel, 
  urlData,
  loading = false 
}) => {
  if (!urlData) return null;

  const shortUrl = `https://s.merlinkuo.tw/${urlData.shortCode}`;

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          確認刪除短網址
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="確認刪除"
      cancelText="取消"
      okButtonProps={{ 
        loading,
        danger: true,
        icon: <DeleteOutlined />
      }}
      cancelButtonProps={{ 
        disabled: loading 
      }}
      centered
      width={500}
    >
      <div style={{ padding: '16px 0' }}>
        {/* 警告訊息 */}
        <div style={{
          background: '#fff2e8',
          border: '1px solid #ffbb96',
          borderRadius: 8,
          padding: 16,
          marginBottom: 20
        }}>
          <Text strong style={{ color: '#d4380d' }}>
            ⚠️ 警告：此操作無法復原
          </Text>
          <br />
          <Text style={{ color: '#d4380d', fontSize: '14px' }}>
            刪除後，所有使用此短網址的連結都將失效，相關的點擊統計數據也會永久丟失。
          </Text>
        </div>

        {/* 連結資訊 */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: 8,
          padding: 16
        }}>
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">要刪除的短網址：</Text>
            <br />
            <Text strong style={{ color: '#1890ff' }}>
              <LinkOutlined style={{ marginRight: 4 }} />
              {shortUrl}
            </Text>
          </div>
          
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">描述：</Text>
            <br />
            <Text>{urlData.description || '無描述'}</Text>
          </div>
          
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">原始網址：</Text>
            <br />
            <Text 
              style={{ wordBreak: 'break-all', fontSize: '13px' }}
              type="secondary"
            >
              {urlData.originalUrl}
            </Text>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* <div>
              <Text type="secondary">點擊數：</Text>
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {urlData.clicks || 0} 次
              </Tag>
            </div> */}
            <div>
              <Text type="secondary">建立時間：</Text>
              <Text style={{ marginLeft: 8, fontSize: '12px' }}>
                {urlData.ptime ? urlData.ptime.split(' ')[0] : 'N/A'}
              </Text>
            </div>
          </div>
        </div>

        {/* 確認文字 */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Text>
            您確定要刪除這個短網址嗎？
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;