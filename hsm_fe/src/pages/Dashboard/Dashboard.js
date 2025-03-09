import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Table, Statistic, List, Typography, Spin } from 'antd';
import { getDashboardData } from '../../services/DashboardService';
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("Current account state:", account);
      console.log("Employee data:", account?.employee);
      console.log("Permissions:", account?.permissions);

      if (!account?.employee?.id) {
        console.log("No employee ID found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching dashboard data for employee:", account.employee.id);
        const response = await getDashboardData(account.employee.id);
        console.log("Dashboard API response:", response);

        if (response.status === "OK") {
          setDashboardData(response.data);
        } else {
          console.error("Error in dashboard response:", response.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [account]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f0f2f5'
      }}>
        <Card
          style={{
            width: 300,
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Spin indicator={antIcon} />
          <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>Loading Dashboard</Title>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Preparing your personalized dashboard...
          </div>
          {!account?.employee?.id && (
            <div style={{
              marginTop: 16,
              padding: '8px',
              background: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#d46b08'
            }}>
              Verifying account permissions...
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (!account?.employee?.id) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f0f2f5'
      }}>
        <Card
          style={{
            width: 300,
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Title level={4} style={{ color: '#cf1322' }}>Access Error</Title>
          <p style={{ color: '#666' }}>No employee data found</p>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f0f2f5'
      }}>
        <Card
          style={{
            width: 300,
            textAlign: 'center',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Title level={4} style={{ color: '#cf1322' }}>Data Error</Title>
          <p style={{ color: '#666' }}>Could not load dashboard data</p>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  if (account?.permissions?.includes("Admin")) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Admin Dashboard</Title>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic title="Total Hotels" value={dashboardData.metrics.totalHotels} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Total Rooms" value={dashboardData.metrics.totalRooms} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Total Employees" value={dashboardData.metrics.totalEmployees} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Total Bookings" value={dashboardData.metrics.totalBookings} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={12}>
            <Card title="Hotel Statistics">
              <Table
                dataSource={dashboardData.hotelStats}
                columns={[
                  { title: 'Hotel Name', dataIndex: 'name', key: 'name' },
                  { title: 'Total Rooms', dataIndex: 'totalRooms', key: 'totalRooms' },
                  { title: 'Available Rooms', dataIndex: 'availableRooms', key: 'availableRooms' }
                ]}
                pagination={false}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Employee Statistics">
              <List
                dataSource={[
                  { title: 'Hotel Managers', value: dashboardData.employeeStats.byRole.managers },
                  { title: 'Receptionists', value: dashboardData.employeeStats.byRole.receptionists },
                  { title: 'Janitors', value: dashboardData.employeeStats.byRole.janitors }
                ]}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={`Total: ${item.value}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Hotel Manager Dashboard
  if (account?.permissions?.includes("Hotel-Manager")) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Hotel Manager Dashboard</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic title="Total Rooms" value={dashboardData.metrics.totalRooms} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Total Employees" value={dashboardData.metrics.totalEmployees} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Total Bookings" value={dashboardData.metrics.totalBookings} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={12}>
            <Card title="Room Status">
              <List
                dataSource={[
                  { title: 'Available Rooms', value: dashboardData.roomStatus.available },
                  { title: 'Needs Cleaning', value: dashboardData.roomStatus.needCleaning },
                  { title: 'Currently Cleaning', value: dashboardData.roomStatus.cleaning }
                ]}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={`Count: ${item.value}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Staff Overview">
              <List
                dataSource={[
                  { title: 'Receptionists', value: dashboardData.employeeStats.byRole.receptionists },
                  { title: 'Janitors', value: dashboardData.employeeStats.byRole.janitors }
                ]}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={`Total: ${item.value}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Receptionist Dashboard
  if (account?.permissions?.includes("Receptionist")) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Receptionist Dashboard</Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic title="Total Rooms" value={dashboardData.metrics.totalRooms} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Available Rooms" value={dashboardData.metrics.availableRooms} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="Today's Check-ins" value={dashboardData.metrics.todayCheckIns} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Recent Bookings">
              <Table
                dataSource={dashboardData.recentBookings}
                columns={[
                  { title: 'Booking ID', dataIndex: '_id', key: '_id' },
                  {
                    title: 'Check-in', dataIndex: ['Time', 'Checkin'], key: 'checkin',
                    render: (text) => new Date(text).toLocaleDateString()
                  },
                  {
                    title: 'Check-out', dataIndex: ['Time', 'Checkout'], key: 'checkout',
                    render: (text) => new Date(text).toLocaleDateString()
                  },
                  { title: 'Status', dataIndex: 'Status', key: 'status' }
                ]}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Janitor Dashboard
  if (account?.permissions?.includes("Janitor")) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Cleaning Dashboard</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card>
              <Statistic title="Rooms To Clean" value={dashboardData.metrics.totalRoomsToClean} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic title="Rooms Being Cleaned" value={dashboardData.metrics.roomsCleaning} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Rooms Needing Cleaning">
              <Table
                dataSource={dashboardData.roomsNeedingCleaning}
                columns={[
                  { title: 'Room Name', dataIndex: 'RoomName', key: 'roomName' },
                  { title: 'Floor', dataIndex: 'Floor', key: 'floor' }
                ]}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return <div>Access Denied - No valid permission found. Current permissions: {JSON.stringify(account?.permissions)}</div>;
};

export default Dashboard;