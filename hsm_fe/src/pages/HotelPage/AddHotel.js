import React, { useState } from "react";
import { Form, Input, Select, Upload, Button, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormContainer, RowContainer, FullWidthItem } from "./style";

const { Option } = Select;

const AddHotel = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const provinces = [
    { _id: "1", name: "Hà Nội" },
    { _id: "2", name: "Ho Chi Minh City" },
    { _id: "3", name: "Da Nang" }
  ];

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
          <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location" }]}> 
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
          <Form.Item name="province" label="Province" rules={[{ required: true, message: "Please select a province" }]}> 
            <Select mode="multiple" placeholder="Select province">
              {provinces.map((province) => (
                <Option key={province._id} value={province._id}>{province.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="rooms" label="Room List"> 
            <Select mode="multiple" placeholder="Select rooms">
              {rooms.map((room) => (
                <Option key={room._id} value={room._id}>{room.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </RowContainer>

        {/* Image Upload - Full width */}
        <FullWidthItem>
          <Form.Item name="images" label="Images"> 
            <Upload listType="picture" beforeUpload={() => false} multiple>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </FullWidthItem>

        {/* Status - Full width */}
        <FullWidthItem>
          <Form.Item name="status" label="Status" valuePropName="checked"> 
            <Switch />
          </Form.Item>
        </FullWidthItem>

        {/* Submit Button */}
        <FullWidthItem>
          <Button type="primary" htmlType="submit">Add Hotel</Button>
        </FullWidthItem>
        
      </Form>
    </FormContainer>
  );
};

export default AddHotel;
