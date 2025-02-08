import React, { useState } from "react";
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Upload,
    Row,
    Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./AddRoom.css";

const { Option } = Select;

const RoomForm = ({
    initialValues,
    onSubmit,
    roomTypes,
    locations,
    amenities,
}) => {
    const [form] = Form.useForm();
    const [imageList, setImageList] = useState(initialValues?.Imgae || []);

    const handleImageChange = ({ fileList }) => {
        const formattedList = fileList.map((file) => ({
            url: file.url || URL.createObjectURL(file.originFileObj),
            alt: file.name || "Uploaded Image",
        }));
        setImageList(formattedList);
    };

    const handleFinish = (values) => {
        const formattedValues = {
            ...values,
            Imgae: imageList,
            Active: values.Active || false,
            IsDelete: false,
        };
        onSubmit(formattedValues);
    };

    return (
        <div className="room-form-container">
            <h2 className="form-title">Add New Room</h2>
            <Row gutter={24}>
                <Col span={10} className="image-upload-section">
                    <div className="main-image-preview">
                        {imageList.length > 0 ? (
                            <img
                                src={imageList[0].url}
                                alt={imageList[0].alt}
                            />
                        ) : (
                            <UploadOutlined className="placeholder-icon" />
                        )}
                    </div>
                    <div className="thumbnail-container">
                        {imageList.map((img, index) => (
                            <img
                                key={index}
                                src={img.url}
                                alt={img.alt}
                                className="thumbnail"
                            />
                        ))}
                    </div>
                    <Upload
                        listType="picture-card"
                        fileList={imageList.map((img, index) => ({
                            uid: index,
                            url: img.url,
                            name: img.alt,
                        }))}
                        onChange={handleImageChange}
                        className="upload-btn"
                    >
                        <UploadOutlined /> Add new Image
                    </Upload>
                </Col>

                <Col span={14}>
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={initialValues}
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            label="Room Name"
                            name="RoomName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the room name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter general room name" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Room Price"
                                    name="Price"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter room price",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: "100%" }}
                                        min={0}
                                        placeholder="Value"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Room Type"
                                    name="typerooms"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select room type",
                                        },
                                    ]}
                                >
                                    <Select>
                                        {/* {roomTypes.map((type) => (
                      <Option key={type._id} value={type._id}>{type.name}</Option>
                    ))} */}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Room Location"
                                    name="locations"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select room location",
                                        },
                                    ]}
                                >
                                    <Select>
                                        {/* {locations.map((type) => (
                      <Option key={type._id} value={type._id}>{type.name}</Option>
                    ))} */}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Room Amenities"
                                    name="amenities"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select room amenities",
                                        },
                                    ]}
                                >
                                    <Select>
                                        {/* {amenities.map((type) => (
                      <Option key={type._id} value={type._id}>{type.name}</Option>
                    ))} */}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Room Description" name="Discription">
                            <Input.TextArea
                                rows={3}
                                placeholder="Enter room description"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="submit-btn"
                            >
                                Save Room
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default RoomForm;
