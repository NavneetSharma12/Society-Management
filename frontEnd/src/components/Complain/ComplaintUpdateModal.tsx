
import React, { useState } from 'react';
import complaintService from '@/services/complaint.service';
import { Modal, Form, Input, Select, Button, Space, Typography, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  residentName: string;
  unitNumber: string;
  societyId: string;
  societyName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

interface ComplaintUpdateModalProps {
  visible: boolean;
  complaint: Complaint | null;
  onCancel: () => void;
  onUpdate: (updatedComplaint: Complaint) => void;
}

const ComplaintUpdateModal: React.FC<ComplaintUpdateModalProps> = ({
  visible,
  complaint,
  onCancel,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (!complaint) return;

      const response = await complaintService.updateComplaint(complaint.id, {
        status: values.status,
        assignedTo: values.assignedTo
      });

      if (response.success) {
        const updatedComplaint: Complaint = {
          ...complaint,
          status: values.status,
          assignedTo: values.assignedTo,
          adminNotes: values.adminNotes,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        onUpdate(updatedComplaint);
      message.success('Complaint updated successfully');
      onCancel();
      }
    } catch (error) {
      message.error('Please fill in all required fields');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (complaint && visible) {
      form.setFieldsValue({
        status: complaint.status,
        assignedTo: complaint.assignedTo || '',
        adminNotes: complaint.adminNotes || '',
      });
    }
  }, [complaint, visible, form]);

  return (
    <Modal
      title={
        <Title level={4} className="!mb-0">
          Update Complaint: {complaint?.title}
        </Title>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {complaint && (
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select status">
                <Option value="open">Open</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="resolved">Resolved</Option>
                <Option value="closed">Closed</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Assign To"
              name="assignedTo"
            >
              <Select placeholder="Select assignment" allowClear>
                <Option value="Maintenance Team">Maintenance Team</Option>
                <Option value="Security Team">Security Team</Option>
                <Option value="Management">Management</Option>
                <Option value="Housekeeping">Housekeeping</Option>
                <Option value="Plumber">Plumber</Option>
                <Option value="Electrician">Electrician</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Admin Notes"
              name="adminNotes"
            >
              <TextArea
                rows={4}
                placeholder="Add internal notes about this complaint..."
              />
            </Form.Item>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              icon={<CloseOutlined />}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSubmit}
            >
              Update Complaint
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ComplaintUpdateModal;
