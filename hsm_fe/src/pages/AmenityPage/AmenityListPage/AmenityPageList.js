import React, { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, Input,
    Space, message, Popconfirm, Tabs, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as amenityService from '../../../services/AmenityService';
import * as roomAmenityService from '../../../services/RoomAmenityService';

const { TabPane } = Tabs;

const AmenityListPage = () => {
    const [amenities, setAmenities] = useState([]);
    const [roomAmenities, setRoomAmenities] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [roomAmenitiesLoading, setRoomAmenitiesLoading] = useState(false);

    useEffect(() => {
        fetchAmenities();
        fetchRoomAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const response = await amenityService.getAllAmenities();
            if (response.status === "OK") {
                setAmenities(response.data);
            } else {
                message.error(response.message || 'Failed to fetch amenities');
            }
        } catch (error) {
            message.error('Failed to fetch amenities');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomAmenities = async () => {
        try {
            setRoomAmenitiesLoading(true);
            const response = await roomAmenityService.getRoomAmenities();
            if (response.status === "OK") {
                setRoomAmenities(response.data);
            } else {
                message.error('Failed to fetch room amenities');
            }
        } catch (error) {
            message.error('Failed to fetch room amenities');
        } finally {
            setRoomAmenitiesLoading(false);
        }
    };

    const handleAdd = () => {
        form.resetFields();
        setEditingId(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        form.setFieldsValue({
            AmenitiesName: record.AmenitiesName,
            Note: record.Note
        });
        setEditingId(record._id);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await amenityService.deleteAmenity(id);
            if (response.status === "OK") {
                message.success('Amenity deleted successfully');
                fetchAmenities();
            } else {
                message.error(response.message || 'Failed to delete amenity');
            }
        } catch (error) {
            message.error('Failed to delete amenity');
        }
    };

    const handleSubmit = async (values) => {
        try {
            let response;
            const data = {
                AmenitiesName: values.AmenitiesName,
                Note: values.Note || ''
            };

            if (editingId) {
                response = await amenityService.updateAmenity(editingId, data);
            } else {
                response = await amenityService.createAmenity(data);
            }

            if (response.status === "OK") {
                message.success(`Amenity ${editingId ? 'updated' : 'created'} successfully`);
                setIsModalVisible(false);
                fetchAmenities();
            } else {
                message.error(response.message || 'Operation failed');
            }
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Working': 'green',
            'Broken': 'red',
            'Under Maintenance': 'orange'
        };
        return colors[status] || 'default';
    };

    const amenityColumns = [
        {
            title: 'Name',
            dataIndex: 'AmenitiesName',
            key: 'AmenitiesName',
            sorter: (a, b) => a.AmenitiesName.localeCompare(b.AmenitiesName)
        },
        {
            title: 'Note',
            dataIndex: 'Note',
            key: 'Note',
            ellipsis: true
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this amenity?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const roomAmenityColumns = [
        {
            title: 'Room',
            dataIndex: ['room', 'RoomName'],
            key: 'room',
            sorter: (a, b) => a.room.RoomName.localeCompare(b.room.RoomName)
        },
        {
            title: 'Amenity',
            dataIndex: ['amenity', 'AmenitiesName'],
            key: 'amenity',
            sorter: (a, b) => a.amenity.AmenitiesName.localeCompare(b.amenity.AmenitiesName)
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
            filters: [
                { text: 'Working', value: 'Working' },
                { text: 'Broken', value: 'Broken' },
                { text: 'Under Maintenance', value: 'Under Maintenance' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Amenities List" key="1">
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                        <h2>Amenities Management</h2>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Add Amenity
                        </Button>
                    </div>

                    <Table
                        columns={amenityColumns}
                        dataSource={amenities}
                        loading={loading}
                        rowKey="_id"
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} items`
                        }}
                    />
                </TabPane>

                <TabPane tab="Room Amenities Status" key="2">
                    <div style={{ marginBottom: 16 }}>
                        <h2>Room Amenities Status</h2>
                    </div>

                    <Table
                        columns={roomAmenityColumns}
                        dataSource={roomAmenities}
                        loading={roomAmenitiesLoading}
                        rowKey="_id"
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} items`
                        }}
                    />
                </TabPane>
            </Tabs>

            <Modal
                title={editingId ? "Edit Amenity" : "Add New Amenity"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="AmenitiesName"
                        label="Name"
                        rules={[{ required: true, message: 'Please input amenity name!' }]}
                    >
                        <Input placeholder="Enter amenity name" />
                    </Form.Item>

                    <Form.Item
                        name="Note"
                        label="Note"
                    >
                        <Input.TextArea
                            placeholder="Enter additional notes"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ float: 'right' }}>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingId ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AmenityListPage; 