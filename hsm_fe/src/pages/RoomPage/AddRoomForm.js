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
    Radio,
    Table,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
    RoomFormContainer,
    ImageUploadSection,
    MainImagePreview,
    MainImagePreviewImg,
} from "./AddRoomStyle";

const { Option } = Select;

const AddRoomForm = ({ initialValues, onSubmit }) => {
    const [mode, setMode] = useState("single");
    const [form] = Form.useForm();
    const [formBulk] = Form.useForm();
    const [imageList, setImageList] = useState(initialValues?.Imgae || []);
    const [quantity, setQuantity] = useState(1);
    const [rooms, setRooms] = useState([]);

    const handleImageChange = ({ fileList }) => {
        const formattedList = fileList.slice(-1).map((file) => ({
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

    const handleBulkAdd = () => {
        const newRooms = Array.from({ length: quantity }, (_, index) => ({
            key: index,
            RoomName: form.getFieldValue("RoomName") + ` ${index + 1}`,
            Price: form.getFieldValue("Price"),
            RoomType: form.getFieldValue("typerooms"),
            Floor: form.getFieldValue("floor"),
            Amenities: form.getFieldValue("amenities"),
        }));
        setRooms(newRooms);
    };

    const columns = [
        { title: "Room Name", dataIndex: "RoomName", key: "RoomName" },
        { title: "Price", dataIndex: "Price", key: "Price" },
        { title: "Room Type", dataIndex: "RoomType", key: "RoomType" },
        { title: "Floor", dataIndex: "Floor", key: "Floor" },
        { title: "Amenities", dataIndex: "Amenities", key: "Amenities" },
    ];

    const handleSubmitBulk = (values) => {
        console.log('Submitted Rooms:', rooms);
        // Thực hiện logic thêm tất cả các phòng
    };

    return (
        <>
            <Radio.Group
                style={{ marginBottom: "15px", fontWeight: "bold" }}
                value={mode}
                onChange={(e) => setMode(e.target.value)}
            >
                <Radio.Button value="single">Add Single Room</Radio.Button>
                <Radio.Button value="bulk">Add Multiple Rooms</Radio.Button>
            </Radio.Group>
            {/* ADD SINGLE ROOM */}
            {mode === "single" && (
                <RoomFormContainer>
                    <Row gutter={24}>
                        <Col span={10}>
                            <ImageUploadSection>
                                <MainImagePreview>
                                    {imageList.length > 0 ? (
                                        <MainImagePreviewImg
                                            src={imageList[0].url}
                                            alt="Upload Image"
                                        />
                                    ) : (
                                        <UploadOutlined className="placeholder-icon" />
                                    )}
                                </MainImagePreview>
                                <Upload listType="picture-card" fileList={imageList} onChange={handleImageChange}>
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </ImageUploadSection>
                        </Col>

                        <Col span={14}>
                            <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleFinish} >
                                <Form.Item label="Room Name" name="RoomName" rules={[{ required: true, message: "Please enter the room name" }]}>
                                    <Input placeholder="Enter general room name" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                            <InputNumber style={{ width: "100%" }} min={1} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Type" name="typerooms" rules={[{ required: true, message: "Please select room type" }]}>
                                            <Select>
                                                <Option value="deluxe">Deluxe</Option>
                                                <Option value="suite">Suite</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Floor" name="floor" rules={[{ required: true, message: "Please select room location" }]}>
                                            <InputNumber style={{ width: "100%" }} min={0} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Amenities" name="amenities" rules={[{ required: true, message: "Please select room amenities" }]}>
                                            <Select mode="multiple">
                                                {/* {amenities?.map((amenity) => (
                                            <Option key={amenity._id} value={amenity._id}>{amenity.name}</Option>
                                        ))} */}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Room Description" name="Discription">
                                    <Input.TextArea rows={3} placeholder="Enter room description" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
                                        htmlType="submit"
                                    >
                                        Save Room
                                    </Button>
                                    {/* <SubmitBtn type="submit">Save Room</SubmitBtn> */}
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </RoomFormContainer>
            )}
            {/* ADD MULTIPLE ROOMS */}
            {mode === "bulk" && (
                <RoomFormContainer>
                    <Row gutter={24}>
                        <Col span={10}>
                            <ImageUploadSection>
                                <MainImagePreview>
                                    {imageList.length > 0 ? (
                                        <MainImagePreviewImg
                                            src={imageList[0].url}
                                            alt="Upload Image"
                                        />
                                    ) : (
                                        <UploadOutlined className="placeholder-icon" />
                                    )}
                                </MainImagePreview>
                                <Upload listType="picture-card" fileList={imageList} onChange={handleImageChange}>
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </ImageUploadSection>
                        </Col>

                        <Col span={14}>
                            <Form form={formBulk} layout="vertical" initialValues={initialValues} onFinish={handleSubmitBulk} >
                                <Form.Item label="Room Name" name="RoomName" rules={[{ required: true, message: "Please enter the room name" }]}>
                                    <Input placeholder="Enter general room name" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                            <InputNumber style={{ width: "100%" }} min={1} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Type" name="typerooms" rules={[{ required: true, message: "Please select room type" }]}>
                                            <Select>
                                                <Option value="deluxe">Deluxe</Option>
                                                <Option value="suite">Suite</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Floor" name="floor" rules={[{ required: true, message: "Please select room location" }]}>
                                            <InputNumber style={{ width: "100%" }} min={0} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {mode === "bulk" && (
                                            <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
                                                <InputNumber style={{ width: "100%" }} min={1} value={quantity} onChange={setQuantity} />
                                            </Form.Item>
                                        )}
                                    </Col>
                                </Row>
                                <Form.Item label="Room Amenities" name="amenities" rules={[{ required: true, message: "Please select room amenities" }]}>
                                    <Select mode="multiple">
                                        {/* {amenities?.map((amenity) => (
                                            <Option key={amenity._id} value={amenity._id}>{amenity.name}</Option>
                                        ))} */}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Room Description" name="Discription">
                                    <Input.TextArea rows={3} placeholder="Enter room description" />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <p><hr /></p>
                    <Button
                        style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
                        onClick={() => formBulk.validateFields().then(handleBulkAdd)}>
                        Create Room List
                    </Button>
                    <Table dataSource={rooms} columns={columns} pagination={false} style={{ marginTop: 20 }} />
                    <Button type="primary"
                        onClick={() => formBulk.validateFields().then(() => formBulk.submit())}
                        style={{ marginTop: 20, backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
                    >Add All Rooms</Button>
                </RoomFormContainer>
            )}

        </>

    );
};

export default AddRoomForm;
