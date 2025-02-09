import React, { useState } from "react";
import { Calendar, Badge, Select, Button, DatePicker, Row, Col } from "antd";
import "./RoomDashboard.css";

const { Option } = Select;
const { RangePicker } = DatePicker;

const RoomDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const getRoomStatus = (roomNumber) => {
        const statusList = ["Available", "Taken", "Booked", "Other"];
        return statusList[roomNumber % 4];
    };

    return (
        <div className="room-dashboard-container">
            <Row gutter={24}>
                {/* Room Grid */}
                <Col span={16} className="room-grid">
                    <div className="rooms">
                        {[...Array(30)].map((_, index) => (
                            <div
                                key={index}
                                className={`room ${getRoomStatus(
                                    index
                                ).toLowerCase()}`}
                            >
                                Room[{index + 1}]
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Calendar and Filters */}
                <Col span={8} className="calendar-section">
                    <h2>Room Booking</h2>
                    <RangePicker className="date-picker" />
                    <Calendar
                        fullscreen={false}
                        onSelect={(date) => setSelectedDate(date)}
                    />

                    <div className="legend">
                        <Badge color="green" text="Available - Can be booked" />
                        <Badge color="red" text="Taken - Someone inside" />
                        <Badge color="gray" text="Booked - Already reserved" />
                        <Badge
                            color="black"
                            text="Other - Maintenance, cleaning"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RoomDashboard;
