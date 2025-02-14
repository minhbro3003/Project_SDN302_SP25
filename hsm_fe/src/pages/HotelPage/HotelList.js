import React, { useRef, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import * as HotelService from "../../services/HotelService";
import { useQuery } from "@tanstack/react-query";

const data = [
    {
        key: "1",
        roomname: "1John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "2",
        roomname: "2John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "3",
        roomname: "3John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "4",
        roomname: "4John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "5",
        roomname: "5John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "6",
        roomname: "6John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "7",
        roomname: "7John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "8",
        roomname: "8John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "9",
        roomname: "John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "10",
        roomname: "9John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
    {
        key: "11",
        roomname: "10John Brown",
        image: "Image 1",
        price: 12000,
        status: "active",
        typerooms: "Deluxe",
        location: "Tầng 1",
    },
];

const HotelList = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const getAllHotels = async () => {
        const res = await HotelService.getAllHotel();
        console.log("data hotel: ", res);
        return res;
    };
    // console.log("getAllHotels: ", getAllHotels)

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
        },
        {
            title: "Status",
            dataIndex: "Active",
            key: "Active",
            ...getColumnSearchProps("Active"),
            sorter: (a, b) => a.Active.length - b.Active.length,
            sortDirections: ["descend", "ascend"],
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

export default HotelList;
