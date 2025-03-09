import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Select, Typography, Spin, Modal, Button, Tag, Timeline, DatePicker } from 'antd';
import { getBookingsByDateRange } from '../../services/BookingService';
import moment from 'moment';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);

  useEffect(() => {
    fetchBookings();
  }, [dateRange]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const result = await getBookingsByDateRange(
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD')
      );
      if (result.status === 'OK') {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const dateCellRender = (value) => {
    const dayBookings = bookings.filter(booking =>
      moment(booking.Time.Checkin).format('YYYY-MM-DD') === value.format('YYYY-MM-DD')
    );

    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
        {dayBookings.map((booking) => (
          <li key={booking._id} onClick={() => showBookingDetails(booking)}>
            <Badge
              status={getStatusColor(booking.Status)}
              text={`${booking.rooms.RoomName} - ${booking.customers.full_name}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4}>Booking Calendar</Title>
              </Col>
              <Col>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  format="YYYY-MM-DD"
                />
              </Col>
            </Row>
            <Spin spinning={loading}>
              <Calendar
                dateCellRender={dateCellRender}
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Booking Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedBooking && (
          <div>
            <Timeline>
              <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
                <Text strong>Check-in:</Text> {moment(selectedBooking.Time.Checkin).format('YYYY-MM-DD HH:mm')}
              </Timeline.Item>
              <Timeline.Item dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
                <Text strong>Check-out:</Text> {moment(selectedBooking.Time.Checkout).format('YYYY-MM-DD HH:mm')}
              </Timeline.Item>
            </Timeline>

            <Card size="small" style={{ marginTop: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Room:</Text>
                  <br />
                  {selectedBooking.rooms.RoomName}
                </Col>
                <Col span={12}>
                  <Text strong>Status:</Text>
                  <br />
                  <Tag color={getStatusColor(selectedBooking.Status)}>
                    {selectedBooking.Status}
                  </Tag>
                </Col>
                <Col span={24}>
                  <Text strong>Customer:</Text>
                  <br />
                  {selectedBooking.customers.full_name}
                  <br />
                  <Text type="secondary">
                    Phone: {selectedBooking.customers.phone}
                    <br />
                    CCCD: {selectedBooking.customers.cccd}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Total Price:</Text>
                  <br />
                  {selectedBooking.SumPrice.toLocaleString()} VND
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingPage;