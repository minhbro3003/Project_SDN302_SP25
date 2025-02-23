import React, { useEffect, useRef, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { Form, Input, InputNumber, Select, Button, Upload, Row, Col, Tag, Space, Table, Tooltip } from "antd";
import * as RoomService from "../../services/RoomService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import * as message from "../../components/Message/Message";
import { RoomFormContainer, ImageUploadSection, MainImagePreview, MainImagePreviewImg, StyledRadioGroup, StyledRadioButton, } from "./AddRoomStyle";
import { convertPrice, getBase64, renderOptions } from "../../utils";

const { Option } = Select;

const RoomList = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [imageList, setImageList] = useState("");
    const [rowSelected, setRowSelected] = useState("");
    const navigate = useNavigate();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const [stateRoomDetails, setStateRoomDetails] = useState({
        RoomName: "",
        Price: "",
        Status: "",
        Floor: "",
        roomtype: [],
        room_amenities: "",
        Description: "",
        Image: "",
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

    //get room types
    const { data, isLoading } = useQuery({
        queryKey: ["roomTypes"],
        queryFn: RoomService.getAllRoomType,
    });
    const roomTypes = data?.data || [];

    // Chuyển roomTypes thành object để dễ lookup
    const roomTypeMap = roomTypes.reduce((acc, type) => {
        acc[type._id] = type.TypeName;
        return acc;
    }, {});

    const getAllRooms = async () => {
        const res = await RoomService.getAllRoom();
        console.log("data rooms: ", res);
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
        Image: data.Image,
        // Chuyển đổi danh sách phòng
        roomtype: (data.roomtype || []).map((room) => ({
            value: room._id,
            label: room.TypeName,
        })),
    });

    const fetchGetDetailsRoom = async (roomId) => {
        if (!roomId) return;
        try {
            const res = await RoomService.getRoomById(roomId);
            if (res?.data) {
                console.log("Room Data from API:", res.data); // Debug API response
                setStateRoomDetails(mapRoomData(res.data));
            }
        } catch (error) {
            console.error("Failed to fetch Room details:", error);
        }
    };

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsRoom(rowSelected)
        }
    }, [rowSelected]);

    // Chỉ cập nhật khi có dữ liệu
    useEffect(() => {
        if (stateRoomDetails._id) {
            // console.log("Updating form with stateRoomDetails:", stateRoomDetails);
            form.setFieldsValue({
                RoomName: stateRoomDetails.RoomName,
                Price: stateRoomDetails.Price,
                Floor: stateRoomDetails.Floor,
                Description: stateRoomDetails.Description,
                Image: stateRoomDetails.Image,
                roomtype: stateRoomDetails.roomtype,
                room_amenities: stateRoomDetails.room_amenities,
            });
        }
    }, [stateRoomDetails, form]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setStateRoomDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnChangeNumber = (name, value) => {
        setStateRoomDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnChangeSelect = (name, value) => {
        setStateRoomDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDetailsRoom = () => {
        if (rowSelected) {
            fetchGetDetailsRoom(rowSelected)
        }
        console.log("rowSelected: ", rowSelected);
        // setRowSelected(record);
        setIsOpenDrawer(true);
    };

    const handleImageChange = async ({ fileList }) => {
        if (fileList.length === 0) {
            setImageList([]);
            stateRoomDetails((prev) => ({ ...prev, image: "" }));
            return;
        }

        let file = fileList[fileList.length - 1];

        if (file.originFileObj) {
            file.preview = await getBase64(file.originFileObj);
        }

        setImageList([{ url: file.url || file.preview, alt: file.name || "Uploaded Image" }]);
        stateRoomDetails((prev) => ({ ...prev, image: file.preview }));
    };

    //update 
    const onUpdateHotel = () => {
        const updateData = {
            RoomName: stateRoomDetails.RoomName,
            Price: stateRoomDetails.Price,
            Floor: stateRoomDetails.Floor,
            Description: stateRoomDetails.Description,
            Image: stateRoomDetails.Image,
            roomtype: stateRoomDetails.roomtype,
            room_amenities: stateRoomDetails.room_amenities,
        };

        console.log("🔥 Dữ liệu gửi lên BE:", updateData);

        mutationUpdate.mutate(
            { id: rowSelected, data: updateData },
            {
                onSuccess: () => {
                    message.success("Room updated successfully!");
                    setIsOpenDrawer(false);
                    fetchGetDetailsRoom(rowSelected); // Lấy dữ liệu mới

                },
                onError: (error) => {
                    console.error("Update Room Error:", error);
                    message.error("Failed to update room!");
                },
                onSettled: () => {
                    queryRoom.refetch()
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
                onSuccess: () => {
                    message.success("Xóa phòng thành công!");
                    console.log("Xóa thành công!"); // Debug log
                    setIsModalDelete(false);
                },
                onSettled: () => {
                    setIsModalDelete(false);
                    queryRoom.refetch();
                },
            }
        );
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
            title: "Room Name",
            dataIndex: "RoomName",
            key: "roomName",
            width: "17%",
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
    return (
        <>
            <Button
                style={{
                    height: "90px",
                    width: "90px",
                    borderRadius: "6px",
                    borderStyle: "dashed",
                    marginBottom: "15px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
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
                width="65%"
            >
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
                            <Form form={form} layout="vertical" onFinish={""} >
                                <Form.Item label="Room Name" name="roomName" rules={[{ required: true, message: "Please enter room name" }]}>
                                    <Input value={stateRoomDetails.roomName} name="roomName" onChange={handleOnChange} placeholder="Enter room name" />
                                    {/* {mutationCreate.data?.status === "ERR" && (
                                        <span style={{ color: "red" }}>*{mutationCreate.data?.message}</span>
                                    )} */}
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Room Price" name="Price" rules={[{ required: true, message: "Please enter room price" }]}>
                                            <InputNumber value={stateRoomDetails.price} name="Price" onChange={(value) => handleOnChangeNumber("price", value)} style={{ width: "100%" }} min={1} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Type" name="roomtype" rules={[{ required: true, message: "Please select room type" }]}>
                                            <Select value={stateRoomDetails.roomType} onChange={(value) => handleOnChangeSelect("roomType", value)}>
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
                                            <InputNumber value={stateRoomDetails.floor} onChange={(value) => handleOnChangeNumber("floor", value)} style={{ width: "100%" }} min={0} placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Room Amenities" name="amenities" rules={[{ required: true, message: "Please select room amenities" }]}>
                                            <Select mode="multiple" value={stateRoomDetails.amenities} onChange={(value) => handleOnChangeSelect("amenities", value)}>
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
                                    <Input.TextArea value={stateRoomDetails.description} name="description" onChange={handleOnChange} rows={3} placeholder="Enter room description" />
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
            </DrawerComponent>

            <ModalComponent
                title="Xóa sản phẩm"
                open={isModalDelete}
                onOk={handleDeleteRoom}
                onCancel={handleCancelDelete}
            >
                <div>Bạn có muốn xóa room không!</div>
            </ModalComponent>
        </>
    );
};

export default RoomList;
