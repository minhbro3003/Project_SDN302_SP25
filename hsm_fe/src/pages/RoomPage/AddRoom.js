import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Button, Upload, Row, Col, Radio, Table, } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RoomFormContainer, ImageUploadSection, MainImagePreview, MainImagePreviewImg, StyledRadioGroup, StyledRadioButton, } from "./AddRoomStyle";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as RoomService from "../../services/RoomService";
import * as message from "../../components/Message/Message";
import { convertPrice, getBase64, renderOptions } from "../../utils";

const { Option } = Select;

const AddRoomForm = ({ initialValues }) => {
    const [mode, setMode] = useState("single");
    const [form] = Form.useForm();
    const [formBulk] = Form.useForm();
    const [imageList, setImageList] = useState(initialValues?.Imgae || []);
    const [quantity, setQuantity] = useState(1);
    const [rooms, setRooms] = useState([]);

    const [stateRoom, setStateRoom] = useState({
        roomName: "",
        price: "",
        roomType: [],
        floor: "",
        amenities: [],
        image: "",
        description: "",
        quantity: "",
    });

    //create room
    const mutationCreate = useMutation({
        mutationFn: (data) => RoomService.createRoom(data),
    });

    //create room
    const { data: datarooms, isSuccess, isError } = mutationCreate;

    //get room types
    const { data, isLoading } = useQuery({
        queryKey: ["roomTypes"],
        queryFn: RoomService.getAllRoomType,
    });

    //get rooms 
    const { data: existingRoomsData } = useQuery({
        queryKey: ["existingRooms"],
        queryFn: RoomService.getAllRoom, // API lấy danh sách phòng hiện tại
    });
    const existingRooms = existingRoomsData?.data || [];


    const roomTypes = data?.data || [];

    // Chuyển roomTypes thành object để dễ lookup
    const roomTypeMap = roomTypes.reduce((acc, type) => {
        acc[type._id] = type.TypeName;
        return acc;
    }, {});

    //crete product
    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            message.success("Add new room successfull!");
        } else if (isError) {
            message.error("Add new room faile!");
        }
    }, [isSuccess, isError, data?.status]);

    //create product
    const handleFinish = () => {
        const params = {
            RoomName: stateRoom.roomName,
            Price: Number(stateRoom.price),
            roomtype: stateRoom.roomType,
            Floor: Number(stateRoom.floor),
            room_amenities: stateRoom.amenities,
            Image: stateRoom.image,
            Description: stateRoom.description,
            // Status: "Available", 
        };

        console.log("Submitting room:", params); // Debug dữ liệu

        mutationCreate.mutate(params, {
            onSuccess: (data) => {
                console.log("Room created successfully:", data);
                message.success("Add new room successfully!");
            },
            onError: (error) => {
                console.error("Error creating room:", error);
                message.error("Add new room failed!");
            },
        });
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setStateRoom((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnChangeNumber = (name, value) => {
        setStateRoom((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnChangeSelect = (name, value) => {
        setStateRoom((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = async ({ fileList }) => {
        if (fileList.length === 0) {
            setImageList([]);
            setStateRoom((prev) => ({ ...prev, image: "" }));
            return;
        }

        let file = fileList[fileList.length - 1];

        if (file.originFileObj) {
            file.preview = await getBase64(file.originFileObj);
        }

        setImageList([{ url: file.url || file.preview, alt: file.name || "Uploaded Image" }]);
        setStateRoom((prev) => ({ ...prev, image: file.preview }));
    };


    const handleDeleteRoom = (roomKey) => {
        setRooms((prevRooms) => prevRooms.filter(room => room.key !== roomKey));
        message.success("Room removed from the list.");
    };

    // const handleBulkAdd = () => {
    //     const roomName = formBulk.getFieldValue("roomName");
    //     if (!roomName) {
    //         message.error("Room name is required!");
    //         return;
    //     }

    //     const quantity = formBulk.getFieldValue("quantity") || 1; // Số lượng phòng muốn thêm
    //     const existingRoomNames = new Set(existingRooms.map(room => room.RoomName));

    //     let newRooms = [];
    //     let counter = 1; // Số thứ tự nếu bị trùng

    //     for (let i = 0; i < quantity; i++) {
    //         let newRoomName = `${roomName}${i + 1}`; // Tên mặc định

    //         // Nếu tên đã tồn tại, thêm số vào sau để tránh trùng lặp
    //         while (existingRoomNames.has(newRoomName)) {
    //             newRoomName = `${roomName}${counter}`;
    //             counter++;
    //         }

    //         existingRoomNames.add(newRoomName); // Đánh dấu là đã dùng tên này

    //         newRooms.push({
    //             key: newRoomName,
    //             RoomName: newRoomName,
    //             Price: formBulk.getFieldValue("Price"),
    //             RoomType: formBulk.getFieldValue("roomtype"),
    //             Floor: formBulk.getFieldValue("floor"),
    //             Amenities: formBulk.getFieldValue("amenities"),
    //             Description: formBulk.getFieldValue("description"),
    //             Image: imageList.length > 0 ? imageList[0].url : "",
    //         });
    //     }

    //     setRooms((prevRooms) => [...prevRooms, ...newRooms]);
    //     message.success(`${newRooms.length} rooms added successfully!`);
    // };
    const handleBulkAdd = () => {
        const roomName = formBulk.getFieldValue("roomName");
        if (!roomName) {
            message.error("Room name is required!");
            return;
        }

        const quantity = formBulk.getFieldValue("quantity") || 1;
        const existingRoomNames = new Set(existingRooms.map(room => room.RoomName));

        let newRooms = [];
        let highestIndex = 0;

        // Find the highest number used for this room type
        existingRoomNames.forEach(name => {
            const match = name.match(new RegExp(`^${roomName}(\\d+)$`));
            if (match) {
                highestIndex = Math.max(highestIndex, parseInt(match[1], 10));
            }
        });

        for (let i = 0; i < quantity; i++) {
            let newRoomName = `${roomName}${highestIndex + 1}`;
            highestIndex++;

            newRooms.push({
                key: newRoomName,
                RoomName: newRoomName,
                Price: formBulk.getFieldValue("Price"),
                RoomType: formBulk.getFieldValue("roomtype"),
                Floor: formBulk.getFieldValue("floor"),
                Amenities: formBulk.getFieldValue("amenities"),
                Description: formBulk.getFieldValue("description"),
                Image: imageList.length > 0 ? imageList[0].url : "",
            });
        }

        setRooms(prevRooms => [...prevRooms, ...newRooms]);
        message.success(`${newRooms.length} rooms added successfully!`);
    };

    const columns = [
        {
            title: "Image", dataIndex: "Image", key: "Image",
            render: (text) => (
                <img
                    src={text}
                    alt="Room Image"
                    style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 4 }}
                />
            ),
        },
        { title: "Room Name", dataIndex: "RoomName", key: "RoomName" },
        { title: "Price", dataIndex: "Price", key: "Price" },
        { title: "Room Type", dataIndex: "RoomType", key: "RoomType", render: (roomTypeId) => roomTypeMap[roomTypeId] || "N/A", },
        { title: "Floor", dataIndex: "Floor", key: "Floor" },
        { title: "Amenities", dataIndex: "Amenities", key: "Amenities" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleDeleteRoom(record.key)}>
                    Delete
                </Button>
            ),
        },
    ];

    // const handleSubmitBulk = async () => {
    //     if (rooms.length === 0) {
    //         message.error("No rooms added to submit!");
    //         return;
    //     }

    //     const formattedRooms = rooms.map((room) => ({
    //         RoomName: room.RoomName,
    //         Price: Number(room.Price),
    //         roomtype: room.RoomType,
    //         Floor: Number(room.Floor),
    //         room_amenities: room.Amenities,
    //         Image: room.Image || "",
    //         Description: room.Description,
    //     }));

    //     console.log("Submitting bulk rooms:", formattedRooms); // Debug

    //     try {
    //         for (let room of formattedRooms) {
    //             await mutationCreate.mutateAsync(room);  // Gửi từng phòng một
    //         }
    //         message.success("Added multiple rooms successfully!");
    //         setRooms([]); // Reset danh sách sau khi thêm thành công
    //         formBulk.resetFields(); // Reset form
    //     } catch (error) {
    //         console.error("Error creating multiple rooms:", error);
    //         message.error("Failed to add multiple rooms!");
    //     }
    // };
    const handleSubmitBulk = async () => {
        if (rooms.length === 0) {
            message.error("No rooms added to submit!");
            return;
        }

        const formattedRooms = rooms.map(room => ({
            RoomName: room.RoomName,
            Price: Number(room.Price),
            roomtype: room.RoomType,
            Floor: Number(room.Floor),
            room_amenities: room.Amenities,
            Image: room.Image || "",
            Description: room.Description,
        }));

        console.log("Submitting bulk rooms:", formattedRooms);

        try {
            await Promise.all(formattedRooms.map(room => mutationCreate.mutateAsync(room)));

            message.success("Added multiple rooms successfully!");
            setRooms([]);
            formBulk.resetFields();
        } catch (error) {
            console.error("Error creating multiple rooms:", error);
            message.error("Failed to add multiple rooms!");
        }
    };

    return (
        <>
            <StyledRadioGroup value={mode} onChange={(e) => setMode(e.target.value)}>
                <StyledRadioButton value="single" selected={mode === "single"}>
                    Add Single Room
                </StyledRadioButton>
                <StyledRadioButton value="bulk" selected={mode === "bulk"}>
                    Add Multiple Rooms
                </StyledRadioButton>
            </StyledRadioGroup>
            {/* ADD SINGLE ROOM */}
            {mode === "single" && (
                <RoomFormContainer>
                    <Row gutter={24}>
                        <Col span={10}>
                            <ImageUploadSection>
                                <MainImagePreview>
                                    {imageList.length > 0 && imageList[0].url ? (
                                        <MainImagePreviewImg
                                            src={imageList[0].url}
                                            alt="Upload Image"
                                        />
                                    ) : (
                                        <UploadOutlined className="placeholder-icon" />
                                    )}
                                </MainImagePreview>
                                <Upload
                                    listType="picture-card"
                                    fileList={imageList}
                                    onChange={handleImageChange}
                                    maxCount={1} // Chỉ cho phép 1 ảnh duy nhất
                                >
                                    {imageList.length === 0 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </ImageUploadSection>
                        </Col>

                        <Col span={14}>
                            <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleFinish} >
                                <Form.Item label="Room Name" name="roomName" rules={[{ required: true, message: "Please enter room name" }]}>
                                    <Input value={stateRoom.roomName} name="roomName" onChange={handleOnChange} placeholder="Enter room name" />
                                    {mutationCreate.data?.status === "ERR" && (
                                        <span style={{ color: "red" }}>*{mutationCreate.data?.message}</span>
                                    )}
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                            <InputNumber value={stateRoom.price} name="Price" onChange={(value) => handleOnChangeNumber("price", value)} style={{ width: "100%" }} min={1} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Type" name="roomtype" rules={[{ required: true, message: "Please select room type" }]}>
                                            <Select value={stateRoom.roomType} onChange={(value) => handleOnChangeSelect("roomType", value)}>
                                                {roomTypes?.map((type) => (
                                                    <Option key={type._id} value={type._id}>{type.TypeName}</Option> // Lưu _id vào state
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Floor" name="floor" rules={[{ required: true, message: "Please select room location" }]}>
                                            <InputNumber value={stateRoom.floor} onChange={(value) => handleOnChangeNumber("floor", value)} style={{ width: "100%" }} min={0} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Amenities" name="amenities" rules={[{ required: true, message: "Please select room amenities" }]}>
                                            <Select mode="multiple" value={stateRoom.amenities} onChange={(value) => handleOnChangeSelect("amenities", value)}>
                                                {/* {amenities?.map((amenity) => (
                                            <Option key={amenity._id} value={amenity._id}>{amenity.name}</Option>
                                        ))} */}
                                                <Option value="deluxe">Deluxe</Option>
                                                <Option value="suite">Suite</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Room Description" name="description">
                                    <Input.TextArea value={stateRoom.description} name="description" onChange={handleOnChange} rows={3} placeholder="Enter room description" />
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
                                    {imageList.length > 0 && imageList[0].url ? (
                                        <MainImagePreviewImg
                                            src={imageList[0].url}
                                            alt="Upload Image"
                                        />
                                    ) : (
                                        <UploadOutlined className="placeholder-icon" />
                                    )}
                                </MainImagePreview>
                                <Upload
                                    listType="picture-card"
                                    fileList={imageList}
                                    onChange={handleImageChange}
                                    maxCount={1} // Chỉ cho phép 1 ảnh duy nhất
                                >
                                    {imageList.length === 0 && (
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </ImageUploadSection>
                        </Col>
                        <Col span={14}>
                            <Form form={formBulk} layout="vertical" initialValues={initialValues} onFinish={handleSubmitBulk} >
                                <Form.Item label="Room Name" name="roomName" rules={[{ required: true, message: "Please enter room name" }]}>
                                    <Input value={stateRoom.roomName} name="roomName" onChange={handleOnChange} placeholder="Enter room name" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                            <InputNumber value={stateRoom.price} name="Price" onChange={(value) => handleOnChangeNumber("price", value)} style={{ width: "100%" }} min={1} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Type" name="roomtype" rules={[{ required: true, message: "Please select room type" }]}>
                                            <Select value={stateRoom.roomType} onChange={(value) => handleOnChangeSelect("roomType", value)}>
                                                {roomTypes?.map((type) => (
                                                    <Option key={type._id} value={type._id}>{type.TypeName}</Option> // Lưu _id vào state
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Floor" name="floor" rules={[{ required: true, message: "Please select room location" }]}>
                                            <InputNumber value={stateRoom.floor} onChange={(value) => handleOnChangeNumber("floor", value)} style={{ width: "100%" }} min={0} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        {mode === "bulk" && (
                                            <Form.Item label="Room Quantity" name="quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
                                                <InputNumber style={{ width: "100%" }} min={1} value={quantity} onChange={setQuantity} placeholder="Value" />
                                            </Form.Item>
                                        )}
                                    </Col>
                                </Row>
                                <Form.Item label="Room Amenities" name="amenities" rules={[{ required: true, message: "Please select room amenities" }]}>
                                    <Select mode="multiple">
                                        {/* {amenities?.map((amenity) => (
                                            <Option key={amenity._id} value={amenity._id}>{amenity.name}</Option>
                                        ))} */}
                                        <Option value="deluxe">Deluxe</Option>
                                        <Option value="suite">Suite</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="Room Description" name="description">
                                    <Input.TextArea value={stateRoom.description} name="description" onChange={handleOnChange} rows={3} placeholder="Enter room description" />
                                </Form.Item>

                                <Button
                                    style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
                                    onClick={() => form.validateFields().then(handleBulkAdd)}>Create Room List
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    <p></p>

                    <Table dataSource={rooms} columns={columns} pagination={false} style={{ marginTop: 20 }} />

                    <Button
                        type="primary"
                        onClick={() => handleSubmitBulk()}
                        style={{ marginTop: 20, backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
                    >
                        Add All Rooms
                    </Button>

                </RoomFormContainer>
            )}

        </>

    );
};

export default AddRoomForm;
