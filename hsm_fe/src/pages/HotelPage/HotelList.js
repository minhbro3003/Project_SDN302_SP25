import React, { useEffect, useRef, useState } from "react";
import {
    DeleteOutlined,
    UploadOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Upload, Form, Input, Switch, Select, Space, Table, Tag, Tooltip } from "antd";
import * as HotelService from "../../services/HotelService";
import * as RoomService from "../../services/RoomService";
import * as message from "../../components/Message/Message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertPrice, getBase64, renderOptions } from "../../utils";
import { useNavigate } from "react-router";
import DrawerComponent from "../../components/DrawerComponent/DrawerComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { RowContainer, FullWidthItem } from "./style";

const HotelList = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [rowSelected, setRowSelected] = useState("");
    // const [allRooms, setAllRooms] = useState([]);
    // const [allImages, setAllImages] = useState([]);

    const [stateHotelDetails, setStateHotelDetails] = useState({
        CodeHotel: "",
        NameHotel: "",
        Introduce: "",
        Title: "",
        LocationHotel: "",
        Note: "",
        image: "",
        rooms: [],
        Active: false,
    });

    const mutationUpdate = useMutation({
        mutationFn: async ({ id, data }) => {
            return await HotelService.updateHotel(id, data);
        },
    });

    const mutationDelete = useMutation({
        mutationFn: async ({ id }) => {
            return await HotelService.deleteHotel(id);
        },
    });

    const getAllHotels = async () => {
        const res = await HotelService.getAllHotel();
        // console.log("data hotel: ", res);
        return res;
    };

    const queryHotel = useQuery({
        queryKey: ["hotels"],
        queryFn: getAllHotels,
    });

    //delete product
    const { isLoading: isLoadingHotels, data: hotels = [] } = queryHotel;
    const { isLoading: isLoadingUpdate, data: dataUpdate } = mutationUpdate;
    const { isLoading: isLoadingDelete, data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;

    // console.log("data update: ", dataUpdate)
    const dataTable =
        hotels?.data?.length &&
        hotels?.data?.map((p) => {
            return { ...p, key: p._id };
        });
    // console.log("dataTable", dataTable);

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

    // ✨ Hàm giúp chuyển đổi dữ liệu API thành format hợp lệ
    const mapHotelData = (data) => ({
        _id: data._id,
        CodeHotel: data.CodeHotel || "",
        NameHotel: data.NameHotel || "",
        Introduce: data.Introduce || "",
        Title: data.Title || "",
        LocationHotel: data.LocationHotel || "",
        Note: data.Note || "",
        Active: data.Active || false,
        image: data.image,
        // Chuyển đổi danh sách phòng
        rooms: (data.rooms || []).map((room) => ({
            value: room._id,
            label: room.RoomName,
        })),
    });

    const fetchGetDetailsHotel = async (hotelId) => {
        if (!hotelId) return;
        try {
            const res = await HotelService.getHotelById(hotelId);
            if (res?.data) {
                console.log("Hotel Data from API:", res.data); // Debug API response
                setStateHotelDetails(mapHotelData(res.data));
            }
        } catch (error) {
            console.error("Failed to fetch hotel details:", error);
        }
    };

    console.log("StateHotelDetails:", stateHotelDetails);

    // Chỉ cập nhật khi có dữ liệu
    useEffect(() => {
        if (stateHotelDetails._id) {
            // console.log("Updating form with stateHotelDetails:", stateHotelDetails);
            form.setFieldsValue({
                CodeHotel: stateHotelDetails.CodeHotel,
                NameHotel: stateHotelDetails.NameHotel,
                Introduce: stateHotelDetails.Introduce,
                Title: stateHotelDetails.Title,
                LocationHotel: stateHotelDetails.LocationHotel,
                Note: stateHotelDetails.Note,
                image: stateHotelDetails.image,
                rooms: stateHotelDetails.rooms,
                Active: stateHotelDetails.Active,
            });
        }
    }, [stateHotelDetails, form]);

    //delete hotel
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === "OK") {
            message.success("Xóa sản phẩm thành công!");
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error("Xóa sản phẩm thất bại!");
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted?.status]);

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsHotel(rowSelected)
        }
    }, [rowSelected]);

    const handleDetailsHotel = () => {
        if (rowSelected) {
            fetchGetDetailsHotel(rowSelected)
        }
        console.log("rowSelected: ", rowSelected);
        // setRowSelected(record);
        setIsOpenDrawer(true);
    };

    const handleOnChangeDetail = (e) => {
        const { name, value, type, checked } = e.target || {};
        setStateHotelDetails((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value, // Nếu là checkbox (Switch), lấy giá trị checked
        }));
    };

    const onUpdateHotel = () => {
        const updateData = {
            CodeHotel: stateHotelDetails.CodeHotel,
            NameHotel: stateHotelDetails.NameHotel,
            Introduce: stateHotelDetails.Introduce,
            Title: stateHotelDetails.Title,
            LocationHotel: stateHotelDetails.LocationHotel,
            Note: stateHotelDetails.Note,
            Active: stateHotelDetails.Active,
            image: stateHotelDetails.image,
            rooms: stateHotelDetails.rooms.RoomName,
            // Gửi danh sách `_id` của phòng
            // rooms: stateHotelDetails.rooms.map((room) => room.value).filter(Boolean),
        };

        console.log("🔥 Dữ liệu gửi lên BE:", updateData);

        mutationUpdate.mutate(
            { id: rowSelected, data: updateData },
            {
                onSuccess: () => {
                    message.success("Hotel updated successfully!");
                    setIsOpenDrawer(false);
                    fetchGetDetailsHotel(rowSelected); // Lấy dữ liệu mới

                },
                onError: (error) => {
                    console.error("Update Hotel Error:", error);
                    message.error("Failed to update hotel!");
                },
                onSettled: () => {
                    queryHotel.refetch()
                }
            }
        );
    };

    //delete hotel
    const handleCancelDelete = () => {
        setIsModalDelete(false);
        // console.log("handleDeteleProduct", rowSelected);
    };

    //delete product
    const handleDeleteHotel = () => {
        mutationDelete.mutate(
            { id: rowSelected },
            {
                onSettled: () => {
                    queryHotel.refetch();
                },
            }
        );
    };

    //get image product details
    const handleOnChangeImageDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateHotelDetails({
            ...stateHotelDetails,
            image: file.preview,
        });
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
                    onClick={handleDetailsHotel}
                />
            </div>
        );
    };
    const columns = [
        {
            title: "Image Hotel",
            dataIndex: "image",
            key: "image",
            width: "8%",
            render: (image) =>
                image ? (
                    <img
                        src={image}
                        alt="Hotel"
                        style={{ width: "80%", height: 35, objectFit: "cover", borderRadius: 6 }}
                    />
                ) : (
                    "No Image"
                ),
        },
        {
            title: "Hotel Code",
            dataIndex: "CodeHotel",
            key: "CodeHotel",
            // width: "30%",
            ...getColumnSearchProps("CodeHotel"),
            sorter: (a, b) => a.CodeHotel.length - b.CodeHotel.length,
        },
        {
            title: "Name Hotel",
            dataIndex: "NameHotel",
            key: "NameHotel",
            // width: "20%",
            ...getColumnSearchProps("NameHotel"),
            sorter: (a, b) => a.NameHotel.length - b.NameHotel.length,
        },
        {
            title: "Title",
            dataIndex: "Title",
            key: "Title",
            render: (text) =>
                text.length > 38 ? `${text.slice(0, 38)}...` : text,
            ...getColumnSearchProps("Title"),
            sorter: (a, b) => a.Title.length - b.Title.length,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "LocationHotel",
            dataIndex: "LocationHotel",
            key: "LocationHotel",
            ...getColumnSearchProps("LocationHotel"),
            sorter: (a, b) => a.LocationHotel.length - b.LocationHotel.length,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Rooms",
            dataIndex: "rooms",
            key: "rooms",
            // ...getColumnSearchProps("rooms"),
            // sorter: (a, b) => a.rooms.length - b.rooms.length,
            // sortDirections: ["descend", "ascend"],
            render: (rooms) => rooms?.length || 0,
            // render: (rooms) => {
            //     if (!rooms || rooms.length === 0) {
            //         return <span style={{ color: "gray" }}>No rooms</span>;
            //     };

            //     const firstAmenity = rooms[0]; // Chỉ lấy 1 cái đầu tiên
            //     const otherAmenities = rooms.slice(1); // Những cái còn lại

            //     return (
            //         <Tooltip
            //             title={otherAmenities.map(a => a.NameRoom).join(" - ")}
            //             placement="top"
            //         >
            //             <Tag color="blue">{firstAmenity.NameRoom}</Tag>
            //             {otherAmenities.length > 0 && (
            //                 <span style={{ color: "#f300f4", cursor: "pointer" }}>
            //                     +{otherAmenities.length} more
            //                 </span>
            //             )}
            //         </Tooltip>
            //     );
            // },
            // onFilter: (value, record) =>
            //     record.rooms?.some(room =>
            //         room.NameRoom.toLowerCase().includes(value.toLowerCase())
            //     ),
        },
        {
            title: "Status",
            dataIndex: "Active",
            key: "Active",
            ...getColumnSearchProps("Active"),
            render: (Active) => (
                <Tag color={Active ? "green" : "volcano"}>
                    {Active ? "Active" : "Inactive"}
                </Tag>
            ),
            filters: [
                { text: "Active", value: true },
                { text: "Inactive", value: false },
            ],
            onFilter: (value, record) => record.Active === value,
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
                onClick={() => navigate('/hotel/add-hotel')}
            >
                <PlusOutlined style={{ fontSize: "35px" }} />
                <div style={{ fontSize: "13px", fontWeight: "500" }}>
                    Add Hotel
                </div>
            </Button>
            <Table columns={columns} dataSource={dataTable}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log("Record Selected:", record);
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
                {/* <Loading isLoading={isLoadingUpdate}> */}
                <Form form={form} layout="vertical" onFinish={onUpdateHotel} autoComplete="on">

                    {/* Hotel Code & Name on the same row */}
                    <RowContainer>
                        <Form.Item name="CodeHotel" label="Hotel Code" rules={[{ required: true, message: "Please enter hotel code" }]}>
                            <Input value={stateHotelDetails.CodeHotel} onChange={handleOnChangeDetail} name="CodeHotel" placeholder="Enter hotel code" />
                        </Form.Item>
                        <Form.Item name="NameHotel" label="Hotel Name" rules={[{ required: true, message: "Please enter hotel name" }]}>
                            <Input value={stateHotelDetails.NameHotel} onChange={handleOnChangeDetail} name="NameHotel" placeholder="Enter hotel name" />
                        </Form.Item>
                    </RowContainer>

                    {/* Introduction - Full width */}
                    <FullWidthItem>
                        <Form.Item name="Introduce" label="Introduction">
                            <Input.TextArea value={stateHotelDetails.Introduce} onChange={handleOnChangeDetail} name="Introduce" placeholder="Enter introduction" />
                        </Form.Item>
                    </FullWidthItem>

                    {/* Title & Location on the same row */}
                    <RowContainer>
                        <Form.Item name="Title" label="Title" >
                            <Input value={stateHotelDetails.Title} onChange={handleOnChangeDetail} placeholder="Enter title" name="Title" />
                        </Form.Item>
                        <Form.Item name="LocationHotel" label="Location Hotel" rules={[{ required: true, message: "Please enter location" }]}>
                            <Input value={stateHotelDetails.LocationHotel} onChange={handleOnChangeDetail} name="LocationHotel" placeholder="Enter location" />
                        </Form.Item>
                    </RowContainer>

                    {/* Note - Full width */}
                    <FullWidthItem>
                        <Form.Item name="Note" label="Note">
                            <Input.TextArea value={stateHotelDetails.Note} onChange={handleOnChangeDetail} name="Note" placeholder="Enter note" />
                        </Form.Item>
                    </FullWidthItem>

                    {/* Rooms on the same row */}
                    <RowContainer>
                        <Form.Item name="rooms" label="Room List" rules={[{ required: true, message: "Please select a room" }]}>
                            <Select
                                mode="multiple"
                                placeholder="Select rooms"
                                value={stateHotelDetails.rooms.map((room) => room.value)} // ✅ Sử dụng _id làm value
                                onChange={(selectedValues) => {
                                    setStateHotelDetails((prev) => ({
                                        ...prev,
                                        rooms: selectedValues.map((id) => {
                                            const selectedRoom = prev.rooms.find((r) => r.value === id);
                                            return {
                                                value: id,
                                                label: selectedRoom?.label || "Unknown"
                                            };
                                        })
                                    }));
                                }}
                                options={stateHotelDetails.rooms} // ✅ Đổ danh sách phòng từ state
                            />
                        </Form.Item>
                        <Form.Item name="Active" label="Status" valuePropName="checked">
                            <Switch
                                checked={stateHotelDetails.Active}
                                onChange={(checked) =>
                                    setStateHotelDetails((prev) => ({ ...prev, Active: checked }))
                                }
                            />
                        </Form.Item>
                    </RowContainer>

                    {/* Image Upload - Full width */}
                    <FullWidthItem>
                        <Form.Item name="image" label="Image">
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                {/* Hiển thị ảnh đã chọn */}
                                {stateHotelDetails?.image && (
                                    <img
                                        src={stateHotelDetails.image}
                                        alt="Preview"
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                )}

                                {/* Nút Upload bên cạnh */}
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
                    </FullWidthItem>

                    {/* Submit Button */}
                    <FullWidthItem>
                        <Button
                            style={{ backgroundColor: "rgb(121, 215, 190)", borderColor: "rgb(121, 215, 190)", color: "black" }}
                            htmlType="submit"
                        >
                            Update Hotel
                        </Button>
                    </FullWidthItem>

                </Form>
                {/* </Loading> */}
            </DrawerComponent>

            <ModalComponent
                title="Xóa sản phẩm"
                open={isModalDelete}
                onOk={handleDeleteHotel}
                onCancel={handleCancelDelete}
            >
                <div>Bạn có muốn xóa hotel không!</div>
            </ModalComponent>
        </>
    );
};

export default HotelList;
