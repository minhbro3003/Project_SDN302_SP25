import React, { useState } from "react";
import { Calendar, Badge, DatePicker, Row, Col } from "antd";
import {
    RoomDashboardContainer,
    RoomGrid,
    Rooms,
    Room,
    CalendarSection,
    DatePickerStyled,
    Legend,
} from "./RoomDashboardStyle";

const { RangePicker } = DatePicker;

const RoomDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const getRoomStatus = (roomNumber) => {
        const statusList = ["Available", "Taken", "Booked", "Other"];
        return statusList[roomNumber % 4];
    };

    return (
        <RoomDashboardContainer>
            <Row gutter={24}>
                {/* Room Grid */}
                <Col span={16}>
                    <RoomGrid>
                        <Rooms>
                            {[...Array(30)].map((_, index) => (
                                <Room key={index} className={getRoomStatus(index).toLowerCase()}>
                                    Room[{index + 1}]
                                </Room>
                            ))}
                        </Rooms>
                    </RoomGrid>
                </Col>

                {/* Calendar and Filters */}
                <Col span={8}>
                    <CalendarSection>
                        <h2>Room Booking</h2>
                        <DatePickerStyled>
                            <RangePicker />
                        </DatePickerStyled>
                        <Calendar fullscreen={false} onSelect={(date) => setSelectedDate(date)} />
                        <Legend>
                            <Badge color="green" text="Available - Can be booked" />
                            <Badge color="red" text="Taken - Someone inside" />
                            <Badge color="gray" text="Booked - Already reserved" />
                            <Badge color="black" text="Other - Maintenance, cleaning" />
                        </Legend>
                    </CalendarSection>
                </Col>
            </Row>
        </RoomDashboardContainer>
    );
};

export default RoomDashboard;
