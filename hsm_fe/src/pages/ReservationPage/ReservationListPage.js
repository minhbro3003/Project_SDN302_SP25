import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Descriptions, message } from "antd";

import moment from "moment";
import { CopyOutlined } from "@ant-design/icons";
import { getAllTransactions } from "../../services/TransactionService";

const ReservationList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const columns = [
        {
            title: "Transaction ID",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "Final Price",
            dataIndex: "FinalPrice",
            key: "FinalPrice",
            render: (price) => `${price.toLocaleString()} VND`,
        },
        {
            title: "Paid Amount",
            dataIndex: "PaidAmount",
            key: "PaidAmount",
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
        {
            title: "Payment Status",
            dataIndex: "Pay",
            key: "Pay",
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
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
            <Table columns={columns} dataSource={transactions} rowKey="id" loading={loading} />
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
                            {selectedTransaction.Pay}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {selectedTransaction.Status}
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