import React, { useState } from "react";
import { Form, Input, Select, Upload, Button, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormContainer, RowContainer, FullWidthItem, FormTitle } from "./style";

const { Option } = Select;

const AddHotel = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const rooms = [
    { _id: "101", name: "Deluxe Room" },
    { _id: "102", name: "Suite Room" },
    { _id: "103", name: "Standard Room" }
  ];

  const handleFinish = (values) => {
    console.log("Form Data:", values);
    onSubmit(values);
  };

  return (
    <FormContainer>
      <FormTitle>Add New Hotel</FormTitle>
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        {/* Hotel Code & Name on the same row */}
        <RowContainer>
          <Form.Item name="hotelCode" label="Hotel Code" rules={[{ required: true, message: "Please enter hotel code" }]}>
            <Input placeholder="Enter hotel code" />
          </Form.Item>
          <Form.Item name="hotelName" label="Hotel Name" rules={[{ required: true, message: "Please enter hotel name" }]}>
            <Input placeholder="Enter hotel name" />
          </Form.Item>
        </RowContainer>

        {/* Introduction - Full width */}
        <FullWidthItem>
          <Form.Item name="introduction" label="Introduction">
            <Input.TextArea placeholder="Enter introduction" />
          </Form.Item>
        </FullWidthItem>

        {/* Title & Location on the same row */}
        <RowContainer>
          <Form.Item name="title" label="Title">
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item name="location" label="Location Hotel" rules={[{ required: true, message: "Please enter location" }]}>
            <Input placeholder="Enter location" />
          </Form.Item>
        </RowContainer>

        {/* Note - Full width */}
        <FullWidthItem>
          <Form.Item name="note" label="Note">
            <Input.TextArea placeholder="Enter note" />
          </Form.Item>
        </FullWidthItem>

        {/* Province & Rooms on the same row */}
        <RowContainer>
          <Form.Item name="rooms" label="Room List" rules={[{ required: true, message: "Please select a province" }]}>
            <Select mode="multiple" placeholder="Select rooms">
              {rooms.map((room) => (
                <Option key={room._id} value={room._id}>{room.name}</Option>
              ))}
            </Select>
          </Form.Item>
          {/* Status - Full width */}
          <Form.Item name="Active" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </RowContainer>

        {/* Image Upload - Full width */}
        <FullWidthItem>
          <Form.Item name="images" label="Images">
            <Upload listType="picture-card" beforeUpload={() => false} multiple showUploadList={{ showPreviewIcon: false }}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </FullWidthItem>

        {/* Submit Button */}
        <FullWidthItem>
          <Button
            style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
            htmlType="submit"
          >
            Add Hotel
          </Button>
        </FullWidthItem>


      </Form>
    </FormContainer>
  );
};

export default AddHotel;
