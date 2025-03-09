import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Spin, Modal, Button, Tag, Timeline, DatePicker, Table, Select } from 'antd';
import { getBookingsByDateRange } from '../../services/BookingService';
import moment from 'moment';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;
const { Option } = Select;

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment('2025-01-01'));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('week');
  const [selectedHotel, setSelectedHotel] = useState(null);

  const account = useSelector((state) => state.account);
  const isAdmin = account?.permissions?.includes("Admin");
  const userHotels = account?.employee?.hotels || [];

  // Set default hotel for non-admin users
  useEffect(() => {
    if (!isAdmin && userHotels.length > 0) {
      setSelectedHotel(userHotels[0]._id);
    }
  }, [isAdmin, userHotels]);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, viewMode, selectedHotel]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let startDate, endDate;

      if (viewMode === 'week') {
        startDate = moment(selectedDate).startOf('week');
        endDate = moment(selectedDate).endOf('week');
      } else {
        startDate = moment(selectedDate).startOf('day');
        endDate = moment(selectedDate).endOf('day');
      }

      // Force dates to be in 2025
      startDate.year(2025);
      endDate.year(2025);

      const result = await getBookingsByDateRange(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
      );

      if (result.status === 'OK') {
        // Filter bookings based on selected hotel or user's hotels
        let filteredBookings = result.data;
        if (!isAdmin) {
          // For non-admin users, only show bookings from their assigned hotels
          const userHotelIds = userHotels.map(hotel => hotel._id);
          filteredBookings = result.data.filter(booking =>
            userHotelIds.includes(booking.rooms.hotel)
          );
        } else if (selectedHotel) {
          // For admin users with selected hotel
          filteredBookings = result.data.filter(booking =>
            booking.rooms.hotel === selectedHotel
          );
        }
        setBookings(filteredBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return '#52c41a';
      case 'Pending': return '#faad14';
      case 'Cancelled': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  // Group bookings by room
  const groupedBookings = bookings.reduce((acc, booking) => {
    const roomId = booking.rooms._id;
    if (!acc[roomId]) {
      acc[roomId] = {
        roomName: `${booking.rooms.RoomName} (${userHotels.find(h => h._id === booking.rooms.hotel)?.NameHotel || 'Unknown Hotel'})`,
        bookings: []
      };
    }
    acc[roomId].bookings.push(booking);
    return acc;
  }, {});

  const columns = [
    {
      title: 'Room',
      dataIndex: 'roomName',
      width: 200,
      fixed: 'left',
    },
    ...[...Array(viewMode === 'week' ? 7 : 24)].map((_, index) => {
      const date = viewMode === 'week'
        ? moment(selectedDate).startOf('week').add(index, 'days')
        : moment(selectedDate).startOf('day').add(index, 'hours');
      return {
        title: viewMode === 'week'
          ? date.format('ddd (DD/MM)')
          : date.format('HH:00'),
        dataIndex: index.toString(),
        width: 150,
        render: (_, record) => {
          const timeSlotBookings = record.bookings.filter(booking => {
            const checkin = moment(booking.Time.Checkin);
            const checkout = moment(booking.Time.Checkout);
            if (viewMode === 'week') {
              return checkin.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
            } else {
              return checkin.format('YYYY-MM-DD HH') === date.format('YYYY-MM-DD HH');
            }
          });

          return timeSlotBookings.length > 0 ? (
            <div>
              {timeSlotBookings.map(booking => (
                <Tag
                  key={booking._id}
                  color={getStatusColor(booking.Status)}
                  style={{ cursor: 'pointer', marginBottom: 4, width: '100%' }}
                  onClick={() => showBookingDetails(booking)}
                >
                  {booking.customers.full_name}
                </Tag>
              ))}
            </div>
          ) : null;
        }
      };
    })
  ];

  const tableData = Object.values(groupedBookings).map(room => ({
    key: room.roomName,
    roomName: room.roomName,
    bookings: room.bookings
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4}>Booking Calendar (2025)</Title>
          </Col>
          <Col>
            <Row gutter={16}>
              {isAdmin && (
                <Col>
                  <Select
                    value={selectedHotel}
                    onChange={setSelectedHotel}
                    style={{ width: 200 }}
                    placeholder="Select Hotel"
                  >
                    <Option value={null}>All Hotels</Option>
                    {userHotels.map(hotel => (
                      <Option key={hotel._id} value={hotel._id}>
                        {hotel.NameHotel}
                      </Option>
                    ))}
                  </Select>
                </Col>
              )}
              <Col>
                <Select
                  value={viewMode}
                  onChange={setViewMode}
                  style={{ width: 120 }}
                >
                  <Option value="week">Week View</Option>
                  <Option value="day">Day View</Option>
                </Select>
              </Col>
              <Col>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  format={viewMode === 'week' ? 'YYYY [Week] w' : 'YYYY-MM-DD'}
                  picker={viewMode === 'week' ? 'week' : 'date'}
                  disabledDate={(date) => date.year() !== 2025}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ x: 'max-content' }}
            size="small"
          />
        </Spin>
      </Card>

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
                  <Text strong>Hotel:</Text>
                  <br />
                  {userHotels.find(h => h._id === selectedBooking.rooms.hotel)?.NameHotel || 'Unknown Hotel'}
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