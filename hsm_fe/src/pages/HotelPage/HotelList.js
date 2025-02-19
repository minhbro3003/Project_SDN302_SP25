import React, { useRef, useState } from "react";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Space, Table, Tag, Tooltip } from "antd";
import * as HotelService from "../../services/HotelService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const HotelList = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const navigate = useNavigate();

    const getAllHotels = async () => {
        const res = await HotelService.getAllHotel();
        console.log("data hotel: ", res);
        return res;
    };

    const queryProduct = useQuery({
        queryKey: ["hotels"],
        queryFn: getAllHotels,
    });

    const { isLoading: isLoadingProducts, data: hotels = [] } = queryProduct;

    const dataTable =
        hotels?.data?.length &&
        hotels?.data?.map((p) => {
            return { ...p, key: p._id };
        });
    console.log("dataTable", dataTable);

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
    const renderAction = () => {
        return (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <DeleteOutlined
                    style={{
                        color: "red",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                // onClick={() => setIsModalDelete(true)}
                />
                <EditOutlined
                    style={{
                        color: "orange",
                        fontSize: "20px",
                        cursor: "pointer",
                    }}
                // onClick={handleDetailsProduct}
                />
            </div>
        );
    };
    const columns = [
        {
            title: "Image Hotel",
            dataIndex: "images",
            key: "images",
            // width: "20%",
            ...getColumnSearchProps("images"),
            render: (images) => (
                images && images.length > 0 ? (
                    <img
                        src={images[0].LinkImage}
                        alt="Hotel"
                        style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 5 }}
                    />
                ) : (
                    "No Image"
                )
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
            ...getColumnSearchProps("rooms"),
            sorter: (a, b) => a.rooms.length - b.rooms.length,
            sortDirections: ["descend", "ascend"],
            // render: (rooms) => {
            //     if (!rooms || rooms.length === 0) {
            //         return <span style={{ color: "gray" }}>No rooms</span>;
            //     }

            //     const menuItems = rooms.map((room) => ({
            //         key: room._id,
            //         label: room.NameRoom,
            //     }));

            //     return (
            //         <Dropdown menu={{ items: menuItems }}>
            //             <Button>
            //                 View Rooms <DownOutlined />
            //             </Button>
            //         </Dropdown>
            //     );
            // },
            render: (rooms) => {
                if (!rooms || rooms.length === 0) {
                    return <span style={{ color: "gray" }}>No rooms</span>;
                };

                const firstAmenity = rooms[0]; // Chỉ lấy 1 cái đầu tiên
                const otherAmenities = rooms.slice(1); // Những cái còn lại

                return (
                    <Tooltip
                        title={otherAmenities.map(a => a.NameRoom).join(" - ")}
                        placement="top"
                    >
                        <Tag color="blue">{firstAmenity.NameRoom}</Tag>
                        {otherAmenities.length > 0 && (
                            <span style={{ color: "#f300f4", cursor: "pointer" }}>
                                +{otherAmenities.length} more
                            </span>
                        )}
                    </Tooltip>
                );
            },
            onFilter: (value, record) =>
                record.rooms?.some(room =>
                    room.NameRoom.toLowerCase().includes(value.toLowerCase())
                ),
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
                    height: "150px",
                    width: "150px",
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
                <PlusOutlined style={{ fontSize: "60px" }} />
                <div style={{ fontSize: "16px", marginTop: "10px", fontWeight: "500" }}>
                    Add new Hotel
                </div>
            </Button>
            <Table columns={columns} dataSource={dataTable} />
        </>
    );
};

export default HotelList;
