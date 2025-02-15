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
import {
    RoomFormContainer,
    FormTitle,
    ImageUploadSection,
    MainImagePreview,
    MainImagePreviewImg,
    ThumbnailContainer,
    Thumbnail,
    UploadBtn,
    SubmitBtn
} from "./AddRoomStyle";

const { Option } = Select;

const AddRoom = ({ initialValues, onSubmit, roomTypes, locations, amenities }) => {
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
        <RoomFormContainer>
            <FormTitle>Add New Room</FormTitle>
            <Row gutter={24}>
                <Col span={10}>
                    <ImageUploadSection>
                        <MainImagePreview>
                            {imageList.length > 0 ? (
                                <MainImagePreviewImg
                                    src={imageList[0].url}
                                    alt={imageList[0].alt}
                                />
                            ) : (
                                <UploadOutlined className="placeholder-icon" />
                            )}
                        </MainImagePreview>
                        <ThumbnailContainer>
                            {imageList.map((img, index) => (
                                <Thumbnail key={index} src={img.url} alt={img.alt} />
                            ))}
                        </ThumbnailContainer>
                        <Upload listType="picture-card" fileList={imageList} multiple onChange={handleImageChange} showUploadList={{ showPreviewIcon: false }}>
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </ImageUploadSection>
                </Col>

                <Col span={14}>
                    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleFinish}>
                        <Form.Item label="Room Name" name="RoomName" rules={[{ required: true, message: "Please enter the room name" }]}>
                            <Input placeholder="Enter general room name" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Value" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Room Type" name="typerooms" rules={[{ required: true, message: "Please select room type" }]}>
                                    <Select>
                                        {roomTypes?.map((type) => (
                                            <Option key={type._id} value={type._id}>{type.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Room Location" name="locations" rules={[{ required: true, message: "Please select room location" }]}>
                                    <InputNumber style={{ width: "100%" }} min={0} placeholder="Value" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Room Amenities" name="amenities" rules={[{ required: true, message: "Please select room amenities" }]}>
                                    <Select mode="multiple">
                                        {amenities?.map((amenity) => (
                                            <Option key={amenity._id} value={amenity._id}>{amenity.name}</Option>
                                        ))}
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
    );
};

export default AddRoom;
