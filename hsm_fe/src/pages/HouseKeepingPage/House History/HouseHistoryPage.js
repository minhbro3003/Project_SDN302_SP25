import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import styled from "styled-components";
import axios from "axios";

const StyledTableContainer = styled.div`
  padding: 20px;
  background: #f9f9f9;
`;

const HousekeepingHistory = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/housekeeping/list");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching housekeeping tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Employee",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo) => assignedTo?.FullName || "N/A",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      render: (room) => room?.number || "N/A",
    },
    {
      title: "Type",
      dataIndex: "taskType",
      key: "taskType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "Completed" ? "green" : status === "In Progress" ? "blue" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Reason for Cancellation (if any)",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => notes || "N/A",
    },
  ];

  return (
    <StyledTableContainer>
      <h2>Housekeeping Task History</h2>
      <Table columns={columns} dataSource={tasks} rowKey="_id" />
    </StyledTableContainer>
  );
};

export default HousekeepingHistory;
