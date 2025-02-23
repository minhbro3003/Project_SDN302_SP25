import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, Switch, Row, Col, Table, InputNumber, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FormContainer, RowContainer, FullWidthItem, FormTitle } from "./style";
import { getBase64 } from "../../utils";
import * as RoomService from "../../services/RoomService";
import * as HotelService from "../../services/HotelService";

const AddHotel = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [groupedRooms, setGroupedRooms] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const [stateHotelDetails, setStateHotelDetails] = useState({
    image: "",
    rooms: {},
    Active: false,
  });

  //get all amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await RoomService.getRoomsGroupedByType();
        setGroupedRooms(res.data);
        console.log("res room type: ", res)
      } catch (error) {
        console.error("Failed to fetch room type:", error);
      }
    };
    fetchAmenities();
  }, []);

  const handleOnChangeImageDetails = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateHotelDetails(prev => ({ ...prev, image: file.preview }));
      form.setFieldsValue({ image: file.preview }); // Cập nhật vào form
    }
  };


  const handleRoomQuantityChange = (value, roomTypeId) => {
    if (!roomTypeId) {
      console.error("roomTypeId bị undefined:", value);
      return;
    }

    setStateHotelDetails(prev => {
      const updatedRooms = { ...prev.rooms, [roomTypeId]: value };
      console.log("Updated rooms state:", updatedRooms);
      return { ...prev, rooms: updatedRooms };
    });
  };


  const handleFinish = async (values) => {
    console.log("📌 Trạng thái rooms:", stateHotelDetails.rooms);
    console.log("📌 Dữ liệu groupedRooms:", groupedRooms);

    const selectedRooms = Object.entries(stateHotelDetails.rooms)
      .filter(([roomTypeId, quantity]) => quantity > 0)
      .flatMap(([roomTypeId, quantity]) => {
        const roomGroup = groupedRooms.find(group => group.roomtypeId === roomTypeId);

        if (!roomGroup || !Array.isArray(roomGroup.rooms) || roomGroup.rooms.length === 0) {
          console.warn(`⚠️ Không tìm thấy hoặc không có phòng cho roomTypeId: ${roomTypeId}`);
          return [];
        }

        console.log(`🔍 Kiểm tra danh sách rooms của roomTypeId ${roomTypeId}:`, roomGroup.rooms);

        // Lấy đúng số lượng rooms theo `_id`
        const selected = roomGroup.rooms.slice(0, quantity);

        console.log(`✅ RoomType: ${roomTypeId}, Chọn ${selected.length}/${quantity} rooms`, selected);
        return selected;
      });

    console.log("🚀 Rooms gửi lên API (trước khi format):", selectedRooms);

    // Format rooms: chỉ lấy giá trị _id
    const roomIds = selectedRooms.map(room => room._id);

    console.log("🚀 Rooms gửi lên API (sau khi format):", roomIds);

    // Kiểm tra dữ liệu trước khi gửi
    if (roomIds.length === 0 || roomIds.includes(undefined)) {
      api.error({ message: "Danh sách phòng gửi lên không hợp lệ. Vui lòng kiểm tra lại." });
      return;
    }

    const formData = {
      CodeHotel: values.hotelCode,
      NameHotel: values.hotelName,
      Introduce: values.introduction || "",
      Title: values.title || "",
      LocationHotel: values.location,
      Note: values.note || "",
      image: stateHotelDetails.image || values.image,
      rooms: roomIds, // ✅ Chỉ chứa danh sách ID, không còn _id
      Active: values.Active || false,
    };

    console.log("📤 Dữ liệu gửi lên BE:", formData);

    try {
      const response = await HotelService.createHotel(formData);
      console.log("✅ Create hotel response:", response);

      if (response.status === "OK") {
        api.success({ message: "Hotel created successfully!" });
        form.resetFields();
        setStateHotelDetails({ image: "", rooms: {}, Active: false });
      } else {
        api.error({ message: response.message || "Failed to create hotel." });
      }
    } catch (error) {
      console.error("❌ Create hotel error:", error);
      api.error({ message: "An error occurred while creating the hotel." });
    }
  };



  const columns = [
    { title: "Room Type", dataIndex: "roomtypeName", key: "roomtypeName" },
    {
      title: "Available Quantity",
      dataIndex: "count",
      key: "count",
    },
    // {
    //   title: "Rooms",
    //   dataIndex: "rooms",
    //   key: "rooms",
    //   render: (rooms) => rooms.join(", "), // Hiển thị danh sách phòng cách nhau bằng dấu phẩy
    // },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={record.count}
          defaultValue={0}
          onChange={(value) => handleRoomQuantityChange(value, record.roomtypeId)}
        />
      ),
    },
  ];

  return (
    <FormContainer>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="image" label="Image">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {stateHotelDetails.image && (
                  <img
                    src={stateHotelDetails.image}
                    alt="Preview"
                    style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
                  />
                )}
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  maxCount={1}
                  showUploadList={false}
                  onChange={handleOnChangeImageDetails}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </div>
            </Form.Item>
          </Col>
          <Col span={18}>
            <RowContainer>
              <Form.Item name="hotelCode" label="Hotel Code" rules={[{ required: true, message: "Please enter hotel code" }]}>
                <Input placeholder="Enter hotel code" />
              </Form.Item>
              <Form.Item name="hotelName" label="Hotel Name" rules={[{ required: true, message: "Please enter hotel name" }]}>
                <Input placeholder="Enter hotel name" />
              </Form.Item>
              <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location" }]}>
                <Input placeholder="Enter location" />
              </Form.Item>
            </RowContainer>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: -20 }} align="middle">
          <Col span={9}>
            <Form.Item name="title" label="Title">
              <Input placeholder="Enter title" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="Active" label="Status" valuePropName="checked" style={{ minHeight: 32 }}>
              <Switch />
            </Form.Item>

          </Col>
          <Col span={12}>
            <Form.Item style={{ marginTop: 18 }} name="introduction" label="Introduction">
              <Input.TextArea placeholder="Enter introduction" />
            </Form.Item>
          </Col>
        </Row>

        <FullWidthItem style={{ marginTop: -20 }} >
          <Form.Item name="note" label="Note">
            <Input.TextArea placeholder="Enter note" />
          </Form.Item>
        </FullWidthItem>

        <Form.Item label="Room List">
          <Table columns={columns} dataSource={groupedRooms} rowKey="roomTypeId" pagination={false} />
        </Form.Item>

        <FullWidthItem>
          <Button style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }} htmlType="submit">
            Add Hotel
          </Button>
        </FullWidthItem>
      </Form>
    </FormContainer>
  );
};

export default AddHotel;
