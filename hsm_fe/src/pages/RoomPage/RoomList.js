import React, { useEffect, useRef, useState } from "react";
import {
    DeleteOutlined, EditOutlined, MinusOutlined, PlusOutlined, SearchOutlined, UploadOutlined
} from "@ant-design/icons";
import { Form, Input, InputNumber, Select, Button, Upload, Row, Col, Space, Table, notification, } from "antd";
import * as RoomService from "../../services/RoomService";
import * as HotelService from "../../services/HotelService";
import * as AmenityService from "../../services/AmenityService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import { ImageUploadSection, MainImagePreview, MainImagePreviewImg, UploadWrapper, StyledRadioButton, } from "./AddRoomStyle";
import { convertPrice, getBase64 } from "../../utils";

const { Option } = Select;

const RoomList = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const navigate = useNavigate();
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenityId, setSelectedAmenityId] = useState(null);
    const [amenitiesQuantity, setAmenitiesQuantity] = useState({});
    const [api, contextHolder] = notification.useNotification();


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: "#ffc069",
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ""}
        //         />
        //     ) : (
        //         text
        //     ),
    });

    const handleDetailsRoom = () => {
        if (rowSelected) {
            fetchGetDetailsRoom(rowSelected)
        }
        console.log("rowSelected: ", rowSelected);
        // setRowSelected(record);
        setIsOpenDrawer(true);
    };

    const renderAction = () => {
        return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <DeleteOutlined
                    style={{
                        color: "red",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                    onClick={() => setIsModalDelete(true)}
                />
                <EditOutlined
                    style={{
                        color: "orange",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                    onClick={handleDetailsRoom}
                />
            </div>
        );
    };
    const columns = [
        {
            title: "Image",
            dataIndex: "Image",
            key: "image",
            width: "8%",
            render: (Image) =>
                Image ? (
                    <img
                        src={Image}
                        alt="Hotel"
                        style={{ width: "80%", height: 35, objectFit: "cover", borderRadius: 6 }}
                    />
                ) : (
                    "No Image"
                ),
        },
        {
            title: "Hotel Name",
            dataIndex: "hotel",
            key: "hotel",
            width: "17%",
            ...getColumnSearchProps("hotel.NameHotel"),
            sorter: (a, b) => a.hotel?.NameHotel.length - b.hotel?.NameHotel.length,
            render: (hotel) => hotel?.NameHotel || "No hotel"
        },
        {
            title: "Room Name",
            dataIndex: "RoomName",
            key: "roomName",
            width: "15%",
            ...getColumnSearchProps("roomName"),
            sorter: (a, b) => a.RoomName.length - b.RoomName.length,
        },
        {
            title: "Price",
            dataIndex: "Price",
            key: "price",
            render: (Price) => convertPrice(Price),
            ...getColumnSearchProps("price"),
            sorter: (a, b) => a.Price - b.Price,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "status",
            // ...getColumnSearchProps("status"),
        },
        {
            title: "Type Rooms",
            dataIndex: "roomtype",
            width: "16%",
            key: "roomtype",
            ...getColumnSearchProps("roomtype"),
            sorter: (a, b) => a.roomtype.length - b.roomtype.length,
            sortDirections: ["descend", "ascend"],
            render: (roomtype) => roomtype?.TypeName || "No type"
        },
        {
            title: "Floor",
            dataIndex: "Floor",
            key: "floor",
            width: "7%",
            // ...getColumnSearchProps("floor"),
            // sorter: (a, b) => a.Floor.length - b.Floor.length,
            // sortDirections: ["descend", "ascend"],
        },
        {
            title: "Action",
            dataIndex: "action",
            render: renderAction,
        },
    ];

    const [stateRoom, setStateRoom] = useState({
        RoomName: "", Price: "", roomtype: "", Floor: "", Image: "", Description: "", Status: "", hotel: ""
    });

    const mutationUpdate = useMutation({
        mutationFn: async ({ id, data }) => {
            return await RoomService.updateRoom(id, data);
        },
    });

    const mutationDelete = useMutation({
        mutationFn: async ({ id }) => {
            return await RoomService.deleteRoom(id);
        },
    });

    //get all amenities
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const res = await AmenityService.getAllAmenities();
                setAmenities(res.data);
                console.log("res amenities: ", res)
            } catch (error) {
                console.error("Failed to fetch amenities:", error);
            }
        };

        fetchAmenities();
    }, []);

    //✅ Lấy danh sách Room Types
    const { data: dataRoomTypes, isLoading } = useQuery({
        queryKey: ["roomTypes"],
        queryFn: RoomService.getAllRoomType,
    });
    const roomTypes = dataRoomTypes?.data || [];

    // ✅ Lấy danh sách Hotels
    const { data: dataHotels } = useQuery({
        queryKey: ["hotels"],
        queryFn: HotelService.getAllHotel,
    });
    const hotels = dataHotels?.data || [];

    //✅ Lấy danh sách Rooms
    const getAllRooms = async () => {
        const res = await RoomService.getAllRoom();
        // console.log("data rooms: ", res);
        return res;
    };
    const queryRoom = useQuery({
        queryKey: ["rooms"],
        queryFn: getAllRooms,
    });

    const { isLoading: isLoadingRoom, data: rooms = [] } = queryRoom;
    const { isLoading: isLoadingUpdate, data: dataUpdate } = mutationUpdate;

    const dataTable =
        rooms?.data?.length &&
        rooms?.data?.map((p) => {
            return { ...p, key: p._id };
        });
    console.log("dataTable", dataTable);

    // Hàm giúp chuyển đổi dữ liệu API thành format hợp lệ
    const mapRoomData = (data) => ({
        _id: data._id,
        RoomName: data.RoomName || "",
        Price: data.Price || "",
        Floor: data.Floor || "",
        Description: data.Description || "",
        room_amenities: data.room_amenities || "",
        Image: data.Image || "",
        hotel: data.hotel || "",
        roomtype: data.roomtype || "",
    });

    //Hàm lấy chi tiết Room
    const fetchGetDetailsRoom = async (roomId) => {
        if (!roomId) return;
        try {
            const res = await RoomService.getRoomById(roomId);
            if (res?.data) {
                // console.log("Room Data from API:", res.data.Image); // Debug API response
                setStateRoom(mapRoomData(res.data));
            }
        } catch (error) {
            console.error("Failed to fetch Room details:", error);
        }
    };

    //Tự động lấy chi tiết phòng khi chọn
    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsRoom(rowSelected)
        }
    }, [rowSelected]);

    // Chỉ cập nhật khi có dữ liệu
    useEffect(() => {
        if (stateRoom._id) {
            // console.log("Updated stateRoom:", stateRoom);
            form.setFieldsValue({
                RoomName: stateRoom.RoomName,
                Price: stateRoom.Price,
                Floor: stateRoom.Floor,
                Description: stateRoom.Description,
                Image: stateRoom.Image,
                hotel: stateRoom.hotel,
                roomtype: stateRoom.roomtype,
                room_amenities: stateRoom.room_amenities,
            });
        }
    }, [stateRoom, form]);

    const handleOnChange = (value, field) => {
        // Nếu là Select (Hotel hoặc RoomType) thì chỉ lưu ObjectId (_id)
        if (field === "hotel" || field === "roomtype") {
            setStateRoom((prev) => ({
                ...prev,
                [field]: value, // Chỉ lưu ObjectId thay vì { value, label }
            }));
        } else {
            setStateRoom((prev) => ({
                ...prev,
                [field]: value, // Lưu giá trị bình thường
            }));
        }
    };

    //get image product details
    const handleOnChangeImageDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateRoom({
            ...stateRoom,
            Image: file.preview,
        });
    };

    const handleQuantityChange = (amenityId, newQuantity) => {
        setAmenitiesQuantity((prev) => ({
            ...prev,
            [amenityId]: newQuantity,
        }));
    };

    //Hàm cập nhật Room
    const onUpdateHotel = () => {
        const updateData = {
            RoomName: stateRoom.RoomName,
            Price: stateRoom.Price,
            Floor: stateRoom.Floor,
            Description: stateRoom.Description,
            Image: stateRoom.Image,
            roomtype: stateRoom.roomtype || "",
            hotel: stateRoom.hotel || "",
            room_amenities: stateRoom.room_amenities,
        };

        console.log("onUpdateHotel", updateData);
        mutationUpdate.mutate(
            { id: rowSelected, data: updateData },
            {
                onSuccess: () => {
                    api.success({ message: "Room updated successfully!" });
                    setIsOpenDrawer(false);
                    fetchGetDetailsRoom(rowSelected);
                },
                onError: (error) => {
                    console.error("Update Room Error:", error);
                    api.error({ message: "Failed to update room!" });
                },
                onSettled: () => {
                    queryRoom.refetch();
                }
            }
        );
    };

    //delete room
    const handleCancelDelete = () => {
        setIsModalDelete(false);
        // console.log("handleDeteleProduct", rowSelected);
    };

    //delete product
    const handleDeleteRoom = () => {
        mutationDelete.mutate(
            { id: rowSelected },
            {
                onSuccess: (response) => {
                    console.log("API Response:", response);
                    api.success({ message: "Room delete successfully!" });
                    setIsModalDelete(false);
                    fetchGetDetailsRoom(rowSelected);
                },
                onSettled: (error) => {
                    console.error("Update Room Error:", error);
                    setIsModalDelete(false);
                    queryRoom.refetch();
                },
            }
        );
    };

    return (
        <>
            {contextHolder}
            <Button
                style={{
                    height: "90px", width: "90px", borderRadius: "6px", borderStyle: "dashed",
                    marginBottom: "15px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}
                onClick={() => navigate('/rooms')}
            >
                <PlusOutlined style={{ fontSize: "35px" }} />
                <div style={{ fontSize: "13px", fontWeight: "500" }}>
                    Add Room
                </div>
            </Button>

            <Table columns={columns} dataSource={dataTable}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            console.log("Record Selected:", record);
                            setRowSelected(record._id);
                        }
                    };
                }}
            />

            <DrawerComponent
                title="Update Hotel"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="80%"
            >
                <Form form={form} layout="vertical" onFinish={onUpdateHotel} autoComplete="on">
                    <Form.Item label="Hotel" name="hotel" rules={[{ required: true, message: "Please select hotel" }]}>
                        <Select style={{ width: "28%" }}
                            placeholder="Select Hotel"
                            onChange={(value) => handleOnChange(value, "hotel")}
                            value={stateRoom.hotel}
                        >
                            {hotels.map((hotel) => (
                                <Option key={hotel._id} value={hotel._id}>
                                    {hotel.NameHotel}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={7}>
                            <ImageUploadSection>
                                {/* Hiển thị ảnh đã chọn */}
                                <MainImagePreview>
                                    {stateRoom?.Image ? (
                                        <MainImagePreviewImg src={stateRoom?.Image} alt="Uploaded Image" />
                                    ) : (
                                        <UploadOutlined className="placeholder-icon" />
                                    )}
                                </MainImagePreview>

                                {/* Upload chỉ hiện icon */}
                                <UploadWrapper>
                                    <Upload
                                        listType="picture-card"
                                        maxCount={1}
                                        showUploadList={false} // Ẩn danh sách ảnh
                                        onChange={handleOnChangeImageDetails}
                                    >
                                        <div>
                                            <UploadOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </UploadWrapper>
                            </ImageUploadSection>
                        </Col>

                        <Col span={16} style={{ marginLeft: "20px" }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Room Name" name="RoomName" rules={[{ required: true, message: "Please enter room name" }]}>
                                        <Input name="roomName" placeholder="Enter room name"
                                            value={stateRoom.RoomName} onChange={(e) => handleOnChange(e.target.value, "RoomName")}
                                        />

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item style={{ width: "30%" }} label="Room Floor" name="Floor" rules={[{ required: true, message: "Please enter floor" }]}>
                                        <InputNumber style={{ width: "100%" }} min={0} placeholder="Value"
                                            value={stateRoom.Floor} onChange={(value) => handleOnChange(value, "Floor")}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                        <InputNumber style={{ width: "100%" }} min={1} placeholder="Value"
                                            value={stateRoom.Price} name="Price" onChange={(value) => handleOnChange(value, "Price")}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Room Type" name="roomtype" rules={[{ required: true, message: "Please select room type" }]}>
                                        <Select
                                            placeholder="Select Room Type"
                                            onChange={(value) => handleOnChange(value, "roomtype")}
                                            value={stateRoom.roomtype}
                                        >
                                            {roomTypes.map((type) => (
                                                <Option key={type._id} value={type._id}>
                                                    {type.TypeName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Row gutter={16} style={{ backgroundColor: "#EEEEEE", borderRadius: 8, marginBottom: 20 }}>
                                <Col span={5}>
                                    <Form.Item label="Quantity Amenities">
                                        <Space>
                                            <Button
                                                icon={<MinusOutlined />}
                                                disabled={!selectedAmenityId || (amenitiesQuantity[selectedAmenityId] || 1) <= 1}
                                                onClick={() => {
                                                    if (!selectedAmenityId) return;
                                                    const newValue = Math.max(1, (amenitiesQuantity[selectedAmenityId] || 1) - 1);
                                                    handleQuantityChange(selectedAmenityId, newValue);
                                                }}
                                            />
                                            <Input
                                                min={1}
                                                max={100}
                                                value={selectedAmenityId ? amenitiesQuantity[selectedAmenityId] || 1 : ""}
                                                style={{ width: 40, textAlign: "center" }}
                                                onChange={(e) => {
                                                    if (!selectedAmenityId) return;
                                                    const newValue = Number(e.target.value) || 1;
                                                    handleQuantityChange(selectedAmenityId, newValue);
                                                }}
                                            />
                                            <Button
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (!selectedAmenityId) return;
                                                    const newValue = Math.min(100, (amenitiesQuantity[selectedAmenityId] || 1) + 1);
                                                    handleQuantityChange(selectedAmenityId, newValue);
                                                }}
                                            />
                                        </Space>
                                    </Form.Item>
                                </Col>
                                <Col span={19}>
                                    <Form.Item
                                        label="Room Amenities"
                                        name="amenities"
                                    // rules={[{ required: true, message: "Please select room amenities" }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Select amenities"
                                            value={stateRoom.amenities}
                                            onChange={(selectedValues) => {
                                                setStateRoom({ ...stateRoom, amenities: selectedValues });

                                                // Gán số lượng mặc định là 1 nếu amenity chưa có số lượng
                                                setAmenitiesQuantity((prev) => {
                                                    const updatedQuantities = { ...prev };
                                                    selectedValues.forEach((amenityId) => {
                                                        if (!updatedQuantities[amenityId]) {
                                                            updatedQuantities[amenityId] = 1;
                                                        }
                                                    });
                                                    return updatedQuantities;
                                                });

                                                // Cập nhật `selectedAmenityId` là tiện ích cuối cùng được chọn
                                                setSelectedAmenityId(selectedValues[selectedValues.length - 1] || null);
                                            }}
                                        >
                                            {amenities?.map((amenity) => {
                                                const quantity = amenitiesQuantity[amenity._id] || 1;
                                                return (
                                                    <Option key={amenity._id} value={amenity._id}>
                                                        {`${amenity.AmenitiesName} (${quantity})`}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6} style={{ marginTop: "-15px" }}>
                                    <Form.Item label="Status" name="Status">
                                        <Input name="Status" placeholder="Enter status"
                                        // value={stateRoom.RoomName} onChange={(e) => handleOnChange(e.target.value, "RoomName")}
                                        />

                                    </Form.Item>
                                </Col>

                            </Row>

                            <Form.Item label="Room Description" name="Description">
                                <Input.TextArea name="Description" rows={3} placeholder="Enter room description"
                                    value={stateRoom.Description} onChange={handleOnChange}
                                />
                            </Form.Item>
                            {/* <SubmitBtn type="submit">Save Room</SubmitBtn> */}
                            <Form.Item>
                                <Button style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }} htmlType="submit">
                                    Update Room
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </DrawerComponent>

            <ModalComponent
                title="Delete Room"
                open={isModalDelete}
                onOk={handleDeleteRoom}
                onCancel={handleCancelDelete}
            >
                <div>Are you sure you want to delete this room?</div>
            </ModalComponent>
        </>
    );
};

export default RoomList;
