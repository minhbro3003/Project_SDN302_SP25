import React, { useState, useEffect } from "react";
import { Input, Button, Form, notification, Card, Row, Col, Table, Alert, DatePicker, InputNumber, Select } from "antd";
import { checkCustomerExists } from "../../services/CustomerService";
import { getAvailableRooms } from "../../services/RoomService";
import moment from "moment";
import { getAllServices } from "../../services/ServiceService";
import { createTransaction } from "../../services/TransactionService";
import { createPaymentLink } from "../../services/VNPayService";
import { CopyrightCircleTwoTone } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;

const ReservationPage = () => {
    const [paymentLink, setPaymentLink] = useState('');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [customerExists, setCustomerExists] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [warningVisible, setWarningVisible] = useState(false);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [autoFill, setAutoFill] = useState(false);
    const [dates, setDates] = useState([null, null]); // For check-in and check-out dates
    const [paymentType, setPaymentType] = useState(""); // For Partial Pay / Full Pay
    const totalRoomPrice = selectedRooms.reduce((total, room) => total + room.Price, 0);
    const totalServicePrice = selectedServices.reduce((total, service) => total + service.totalPrice, 0);
    const finalPrice = totalRoomPrice + totalServicePrice;
    const account = useSelector((state) => state.account);
    const navigate = useNavigate();
    // Initialize notification hook
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        fetchAvailableRooms();
        fetchServices();
    }, []);

    const fetchAvailableRooms = async () => {
        try {
            const rooms = await getAvailableRooms();
            if (rooms.status === "OK") {
                setAvailableRooms(rooms.data);
            } else {
                console.error("Failed to fetch rooms:", rooms.message);
            }
        } catch (e) {
            console.error("Error fetching available rooms:", e);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await getAllServices();
            if (res.status === "OK") {
                setServices(res.data);
            } else {
                console.error("Failed to fetch services:", res.message);
            }
        } catch (e) {
            console.error("Error fetching services:", e);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        const { phone, cccd } = values;

        const result = await checkCustomerExists(phone, cccd);
        if (result.status === "ERR") {
            setCustomerExists(result.data);
            setWarningVisible(true);
        } else {
            // Show success notification
            api.success({
                message: "Customer Available",
                description: "You can proceed with the reservation.",
            });
            form.resetFields();
        }
        setLoading(false);
    };

    const handlePaymentChange = (value) => {
        setPaymentMethod(value);
        setPaymentType(""); // Reset payment type when changing payment method
    };

    const handlePaymentTypeChange = (value) => {
        setPaymentType(value);
    };

    // const handleGeneratePaymentLink = async () => {
    //     if (!paymentType) {
    //         alert("Please select a payment type.");
    //         return;
    //     }


    //     // Construct the order info string
    //     const selectedRoomNames = selectedRooms.join(", ");
    //     const selectedServiceNames = selectedServices.map(service => `${service.serviceName} (x${service.quantity})`).join(", ");
    //     const paymentDescription = paymentType === "Partial Pay" ? "Partial Payment (30%)" : "Full Payment";
    //     const paymentAmount = paymentType === "Partial Pay" ? finalPrice * 0.30 : finalPrice;  // 30% for partial, full amount for full payment
    //     const orderInfo = `Order for Rooms: ${selectedRoomNames}. Services: ${selectedServiceNames}. Payment Type: ${paymentDescription}`;

    //     try {
    //         // Call the createPaymentLink function with the orderInfo description and the amount (e.g., total amount)
    //         const amount = paymentAmount;  // For example, this could be the total amount from selected rooms and services
    //         const response = await createPaymentLink(amount, orderInfo);

    //         if (response.paymentUrl) {
    //             setPaymentLink(response.paymentUrl);  // Set the payment link from the response
    //             api.success({
    //                 message: " Generate Link success",
    //                 description: "Generate Complete",
    //             });
    //         } else {
    //             api.error({
    //                 message: "Failed to generate",
    //                 description: "Something went wrong",
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error generating payment link:', error);
    //         alert('An error occurred while generating the payment link.');
    //     }
    // };


    const handleFieldChange = async (changedValue) => {
        const { phone, cccd } = changedValue;
        if (phone || cccd) {
            setLoading(true);
            const result = await checkCustomerExists(phone, cccd);
            if (result.status === "ERR") {
                setCustomerExists(result.data);
                setWarningVisible(true);
            } else {
                setCustomerExists(null);
                setWarningVisible(false);
            }
            setLoading(false);
        }
    };

    const handleAutoFill = () => {
        form.setFieldsValue({
            full_name: customerExists.full_name,
            phone: customerExists.phone,
            cccd: customerExists.cccd,
        });
        setAutoFill(true);
        setWarningVisible(false);
    };

    const handleCancelAutoFill = () => {
        setWarningVisible(false);
        setAutoFill(false);
    };

    const handleBookRoom = (room) => {
        if (!dates[0] || !dates[1]) {
            api.error({
                message: "Select Dates First",
                description: "Please select the check-in and check-out dates before booking a room.",
            });
            return;
        }

        const updatedRoom = { ...room, checkin: dates[0], checkout: dates[1] }; // Assign checkin/checkouts
        setSelectedRooms([...selectedRooms, updatedRoom]);
        setAvailableRooms(availableRooms.filter((r) => r._id !== room._id)); // Remove from available rooms
    };

    const handleRemoveRoom = (room) => {
        setSelectedRooms(selectedRooms.filter((r) => r._id !== room._id));
        setAvailableRooms([...availableRooms, room]); // Add back to available rooms
    };

    const handleDateChange = (value) => {
        setDates(value); // Set the check-in and check-out dates
    };

    const availableColumns = [
        {
            title: "Room Name",
            dataIndex: "RoomName",
            key: "RoomName",
            sorter: (a, b) => a.RoomName.localeCompare(b.RoomName),
            filterSearch: true,
            onFilter: (value, record) => record.RoomName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Description",
            dataIndex: "Description",
            key: "Description",
            filterSearch: true,
            onFilter: (value, record) => record.Description.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Price",
            dataIndex: "Price",
            key: "Price",
            sorter: (a, b) => a.Price - b.Price,
            render: (text) => `${text} VND`
        },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (text) => (
                <span style={{ color: text === "Available" ? "green" : "red", fontWeight: "bold" }}>
                    {text}
                </span>
            ),
            filters: [
                { text: "Available", value: "Available" },
                { text: "Unavailable", value: "Unavailable" },
            ],
            onFilter: (value, record) => record.Status === value,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button onClick={() => handleBookRoom(record)} type="primary">
                    Book
                </Button>
            ),
        },
    ];

    const selectedColumns = [
        { title: "Room Name", dataIndex: "RoomName", key: "RoomName" },
        { title: "Description", dataIndex: "Description", key: "Description" },
        { title: "Price", dataIndex: "Price", key: "Price" },
        {
            title: "Status",
            dataIndex: "Status",
            key: "Status",
            render: (text) => (
                <span style={{ color: text === "Available" ? "green" : "red", fontWeight: "bold" }}>
                    {text}
                </span>
            )
        },
        { title: "Check-in", dataIndex: "checkin", key: "checkin", render: (text) => moment(text).format("YYYY-MM-DD") },
        { title: "Check-out", dataIndex: "checkout", key: "checkout", render: (text) => moment(text).format("YYYY-MM-DD") },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Button onClick={() => handleRemoveRoom(record)} color="danger" variant="solid">
                    Remove
                </Button>
            ),
        },
    ];

    const handleAddService = (service, quantity) => {
        if (quantity <= 0) return;

        const totalPrice = service.Price * quantity;
        const newService = {
            serviceId: service._id,
            serviceName: service.ServiceName,
            pricePerUnit: service.Price,
            quantity,
            totalPrice,
        };

        // Prevent duplicate entries, update if already added
        setSelectedServices((prev) => {
            const existingIndex = prev.findIndex((s) => s.serviceId === service._id);
            if (existingIndex !== -1) {
                const updatedServices = [...prev];
                updatedServices[existingIndex] = newService;
                return updatedServices;
            }
            return [...prev, newService];
        });
    };

    const handleRemoveService = (serviceId) => {
        setSelectedServices(selectedServices.filter((s) => s.serviceId !== serviceId));
    };

    const serviceColumns = [
        {
            title: "Service Name",
            dataIndex: "ServiceName",
            key: "ServiceName",
            sorter: (a, b) => a.ServiceName.localeCompare(b.ServiceName),
            filterSearch: true,
            onFilter: (value, record) => record.ServiceName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: "Price per Unit",
            dataIndex: "Price",
            key: "Price",
            sorter: (a, b) => a.Price - b.Price,
            render: (text) => `${text} VND`
        },
        {
            title: "Quantity",
            key: "quantity",
            render: (_, record) => (
                <InputNumber
                    min={1}
                    defaultValue={1}
                    onChange={(value) => handleAddService(record, value)}
                />
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button onClick={() => handleAddService(record, 1)} type="primary">
                    Add
                </Button>
            ),
        },
    ];
    const selectedServiceColumns = [
        { title: "Service Name", dataIndex: "serviceName", key: "serviceName" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Price per Unit", dataIndex: "pricePerUnit", key: "pricePerUnit", render: (text) => `${text} VND` },
        { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice", render: (text) => `${text} VND` },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button onClick={() => handleRemoveService(record.serviceId)} color="danger" variant="solid">
                    Remove
                </Button>
            ),
        },
    ];

    const handleSubmit = async () => {
        setLoading(true);

        // Prepare booking data
        const bookingData = {
            customer: {
                full_name: form.getFieldValue("full_name"),
                phone: form.getFieldValue("phone"),
                cccd: form.getFieldValue("cccd"),
            },
            rooms: selectedRooms.map(room => room._id),  // Pass only room IDs
            services: selectedServices.map(service => ({
                serviceId: service.serviceId,
                quantity: service.quantity,
            })),
            checkin: dates[0],
            checkout: dates[1],
            paymentMethod: paymentMethod,
            SumPrice: selectedRooms.reduce((total, room) => total + room.Price, 0), // Add the total price of selected rooms
            Status: "Pending", // Add status
        };

        // Prepare transaction data
        const transactionData = {
            services: selectedServices.map(service => ({
                serviceId: service.serviceId,
                quantity: service.quantity,
            })),
            FinalPrice: bookingData.SumPrice + selectedServices.reduce((total, service) => total + service.totalPrice, 0), // Add total service price
            PaidAmount: 0, // Or use any value based on payment method
            PaymentMethod: paymentMethod,
            paymentType: paymentType,
            PaymentReference: paymentLink,
            CreatedBy: account.fullName, // Or replace with logged-in user information
        };

        try {
            const result = await createTransaction(bookingData, transactionData);
            if (result.status === "OK") {
                api.success({
                    message: "Booking Successful",
                    description: "Your booking has been created successfully.",
                });
                navigate("/reservationlist");
            } else {
                api.error({
                    message: "Booking Failed",
                    description: result.message,
                });
            }
        } catch (error) {
            api.error({
                message: "Error",
                description: "An error occurred while creating the booking and transaction.",
            });
        }

        setLoading(false);
    };
    return (
        <div style={{ backgroundColor: "#F6F4F0", padding: "20px" }}>
            {contextHolder}
            <Form form={form} onFinish={onFinish}>
                {/* Customer Information Fields */}
                <Form.Item label="Full Name" name="full_name">
                    <Input onChange={(e) => handleFieldChange({ full_name: e.target.value })} />
                </Form.Item>
                <Form.Item label="Phone  " name="phone">
                    <Input onChange={(e) => handleFieldChange({ phone: e.target.value })} />
                </Form.Item>
                <Form.Item label="CCCD  " name="cccd">
                    <Input onChange={(e) => handleFieldChange({ cccd: e.target.value })} />
                </Form.Item>
                {/* Customer Warning */}
                {warningVisible && (
                    <Alert
                        message="Warning"
                        description="The customer is already exist in the system. Do you want to autofill?"
                        type="warning"
                        showIcon
                        action={
                            <>
                                <Button size="small" type="link" onClick={handleAutoFill}>Auto Fill</Button>
                                <Button size="small" type="link" onClick={handleCancelAutoFill}>Cancel</Button>
                            </>
                        }
                    />
                )}

                {/* Date Picker */}
                <Form.Item label="Dates" name="dates">
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={handleDateChange}
                        disabledDate={(current) => current && current < moment().endOf("day")} // Disable past dates
                    />
                </Form.Item>

                {/* Available Rooms Table */}
                <Table columns={availableColumns} dataSource={availableRooms} rowKey="_id" />

                {/* Selected Rooms Table */}
                <Table columns={selectedColumns} dataSource={selectedRooms} rowKey="_id" />

                {/* Services Table */}
                <Table columns={serviceColumns} dataSource={services} rowKey="_id" />

                {/* Selected Services Table */}
                <Table columns={selectedServiceColumns} dataSource={selectedServices} rowKey="serviceId" />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item label="Payment Method" name="paymentMethod">
                            <Select value={paymentMethod} onChange={handlePaymentChange}>
                                <Select.Option value="Cash">Cash</Select.Option>
                                <Select.Option value="Credit Card">Credit Card</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {paymentMethod === "Credit Card" && (
                        <Col span={12}>
                            <Form.Item label="Payment Type">
                                <Select value={paymentType} onChange={handlePaymentTypeChange}>
                                    <Select.Option value="Partial Pay">Partial Pay 30%</Select.Option>
                                    <Select.Option value="Full Pay">Full Pay</Select.Option>
                                </Select>
                            </Form.Item>
                            {/* <Button
                                type="primary"
                                onClick={handleGeneratePaymentLink}
                                disabled={!paymentType}
                            >
                                Generate payment link
                            </Button> */}
                        </Col>
                    )}
                </Row>

                {/* After the payment link is generated */}
                {/* {paymentLink && (
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Generated Payment Link">
                                <Input
                                    value={paymentLink}
                                    readOnly
                                    addonAfter={
                                        <Button
                                            icon={<CopyrightCircleTwoTone />}
                                            onClick={() => navigator.clipboard.writeText(paymentLink)}
                                        >
                                            Copy
                                        </Button>
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                )} */}


                <Button
                    type="primary"
                    onClick={handleSubmit} // Trigger the handleSubmit manually
                    loading={loading}
                >
                    Book Reservation
                </Button>
            </Form>
        </div>
    );
};

export default ReservationPage;
