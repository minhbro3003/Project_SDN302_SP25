import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Descriptions, message, Select, Tag, Space, Input } from "antd";
import moment from "moment";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllTransactions } from "../../services/TransactionService";

const { Option } = Select;

const ReservationList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [recentFilter, setRecentFilter] = useState("today");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        const response = await getAllTransactions();
        if (response.status !== "ERR") {
            setTransactions(response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        } else {
            message.error("Failed to fetch transactions");
        }
        setLoading(false);
    };

    const showDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalVisible(true);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        message.success("Copied to clipboard");
    };

    const getStatusTag = (status) => {
        const colorMap = { Completed: "green", Pending: "orange", Cancelled: "red" };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
    };

    const getPaymentTag = (paymentStatus) => {
        const colorMap = { Paid: "green", Partial: "gold", Unpaid: "red" };
        return <Tag color={colorMap[paymentStatus] || "default"}>{paymentStatus}</Tag>;
    };

    const today = moment().startOf("day");
    const thisWeek = moment().startOf("week");

    const filteredRecentTransactions = transactions.filter((t) => {
        const updatedAt = moment(t.updatedAt);
        return recentFilter === "today"
            ? updatedAt.isSame(today, "day")
            : updatedAt.isSameOrAfter(thisWeek, "day");
    });

    const unpaidTransactions = transactions.filter((t) => t.Pay === "Unpaid");
    const partialTransactions = transactions.filter((t) => t.Pay === "Partial");

    const filteredTransactions = transactions.filter(
        (t) =>
            t._id.toLowerCase().includes(searchText.toLowerCase()) ||
            t.Status.toLowerCase().includes(searchText.toLowerCase()) ||
            t.Pay.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "_id",
            key: "_id",
            sorter: (a, b) => a._id.localeCompare(b._id),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Transaction ID"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={confirm}
                        style={{ width: 188, marginBottom: 8, display: "block" }}
                    />
                    <Button
                        type="primary"
                        onClick={confirm}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                </div>
            ),
        },
        {
            title: "Final Price",
            dataIndex: "FinalPrice",
            key: "FinalPrice",
            sorter: (a, b) => a.FinalPrice - b.FinalPrice,
            render: (price) => `${price.toLocaleString()} VND`,
        },
        {
            title: "Paid Amount",
            dataIndex: "PaidAmount",
            key: "PaidAmount",
            sorter: (a, b) => a.PaidAmount - b.PaidAmount,
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
        {
            title: "Payment Status",
            dataIndex: "Pay",
            key: "Pay",
            render: (status) => getPaymentTag(status),
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (status) => getStatusTag(status),
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button type="primary" onClick={() => showDetails(record)}>
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <div>
            {/* Search Bar */}
            <Input
                placeholder="Search by ID, Status, Payment"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                style={{ marginBottom: 16, width: 300 }}
            />

            {/* All Reservations */}
            <h2>All Reservations</h2>
            <Table columns={columns} dataSource={filteredTransactions} rowKey="_id" loading={loading} />

            {/* Recent Reservations */}
            <h2>Recent Reservations</h2>
            <Select value={recentFilter} onChange={setRecentFilter} style={{ width: 150, marginBottom: 10 }}>
                <Option value="today">Today</Option>
                <Option value="week">This Week</Option>
            </Select>
            <Table columns={columns} dataSource={filteredRecentTransactions} rowKey="_id" loading={loading} />

            {/* Unpaid Transactions */}
            <h2 style={{ color: "red", marginTop: 20 }}>Unpaid Transactions</h2>
            <Table columns={columns} dataSource={unpaidTransactions} rowKey="_id" loading={loading} />

            {/* Partial Payments */}
            <h2 style={{ color: "gold", marginTop: 20 }}>Partial Payments</h2>
            <Table columns={columns} dataSource={partialTransactions} rowKey="_id" loading={loading} />

            {/* Transaction Details Modal */}
            <Modal
                title="Transaction Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedTransaction && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Buy Time">
                            {moment(selectedTransaction.BuyTime).format("YYYY-MM-DD HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Final Price">
                            {selectedTransaction.FinalPrice.toLocaleString()} VND
                        </Descriptions.Item>
                        <Descriptions.Item label="Paid Amount">
                            {selectedTransaction.PaidAmount.toLocaleString()} VND
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Status">
                            {getPaymentTag(selectedTransaction.Pay)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {getStatusTag(selectedTransaction.Status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Method">
                            {selectedTransaction.PaymentMethod}
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Reference">
                            <a href={selectedTransaction.PaymentReference} target="_blank" rel="noopener noreferrer">
                                Payment Link
                            </a>
                            <Button
                                type="link"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(selectedTransaction.PaymentReference)}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                )}

                {/* 🔥 Buttons Restored Here */}
                <div style={{ marginTop: 20, textAlign: "center" }}>
                    <Button type="primary" style={{ marginRight: 10 }}>
                        Add Extra Service
                    </Button>
                    <Button type="default" style={{ marginRight: 10 }}>
                        Change Booking Status
                    </Button>
                    <Button type="dashed">Edit Information</Button>
                </div>
            </Modal>

        </div>
    );
};

export default ReservationList;
