import React, { useRef, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Tag, Tooltip } from "antd";
import * as RoomService from "../../services/RoomService";
import { useQuery } from "@tanstack/react-query";

const RoomList = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const getAllRooms = async () => {
        const res = await RoomService.getAllRoom();
        console.log("data rooms: ", res);
        return res;
    };

    const queryProduct = useQuery({
        queryKey: ["rooms"],
        queryFn: getAllRooms,
    });

    const { isLoading: isLoadingProducts, data: rooms = [] } = queryProduct;

    const dataTable =
        rooms?.data?.length &&
        rooms?.data?.map((p) => {
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
            title: "Image",
            dataIndex: "Image",
            key: "image",
            width: "9%",
            render: (Image) => (
                Image && Image.length > 0 ? (
                    <img
                        src={Image[0]?.url}
                        alt={Image[0]?.alt || "Room Image"}
                        style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 5 }}
                    />
                ) : (
                    "No Image"
                )
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
            dataIndex: "typerooms",
            width: "11%",
            key: "typerooms",
            ...getColumnSearchProps("typerooms"),
            sorter: (a, b) => a.typerooms.length - b.typerooms.length,
            sortDirections: ["descend", "ascend"],
            render: (typerooms) => typerooms?.TypeName || "No type"
        },
        {
            title: "Rooms Amenities",
            dataIndex: "room_amenities",
            width: "13%",
            render: (room_amenities) => {
                if (!room_amenities || room_amenities.length === 0) return "No amenities";

                const firstAmenity = room_amenities[0]; // Chỉ lấy 1 cái đầu tiên
                const otherAmenities = room_amenities.slice(1); // Những cái còn lại

                return (
                    <Tooltip
                        title={otherAmenities.map(a => a.name).join(", ")}
                        placement="top"
                    >
                        <Tag color="blue">{firstAmenity.name}</Tag>
                        {otherAmenities.length > 0 && (
                            <span style={{ color: "#f300f4", cursor: "pointer" }}>
                                +{otherAmenities.length} more
                            </span>
                        )}
                    </Tooltip>
                );
            }
        },
        {
            title: "Floor",
            dataIndex: "Floor",
            key: "floor",
            width: "5%",
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
            <Table columns={columns} dataSource={dataTable} />
        </>
    );
};

export default RoomList;
