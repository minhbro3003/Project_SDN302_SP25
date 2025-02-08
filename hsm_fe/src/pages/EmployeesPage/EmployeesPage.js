import React from "react";
import { FaTrash, FaPlus, FaEllipsisH, FaEdit } from "react-icons/fa";  
import { useNavigate } from "react-router";
import {
  DashboardContainer,
  StyledCard,
  CardHeader,
  TableContainer,
  StyledTable,
  Button,
  RecentlyAddedContainer,
  EmployeeItem,
  EmployeeAvatar,
  EmployeeInfo,
  HotelTableContainer,
} from "./style";


const EmployeesPage = () => {
  const navigate = useNavigate();
  return (
    <DashboardContainer>
      <div className="row">

        {/* Recently Added */}
        <div className="col-md-3">
          <StyledCard>
            <CardHeader>
              Recently Added <FaPlus className="add-icon" />
            </CardHeader>
            <RecentlyAddedContainer>
              <EmployeeItem>
                <EmployeeAvatar src="/path-to-avatar" alt="Adela Parkson" />
                <EmployeeInfo>
                  <strong>Adela Parkson</strong>
                  <span>Front Desk Agent</span>
                </EmployeeInfo>
              </EmployeeItem>
              <EmployeeItem>
                <EmployeeAvatar src="/path-to-avatar" alt="Christian Mad" />
                <EmployeeInfo>
                  <strong>Christian Mad</strong>
                  <span>Front Desk Agent</span>
                </EmployeeInfo>
              </EmployeeItem>
              <EmployeeItem>
                <EmployeeAvatar src="/path-to-avatar" alt="Jason Statham" />
                <EmployeeInfo>
                  <strong>Jason Statham</strong>
                  <span>Front Desk Agent</span>
                </EmployeeInfo>
              </EmployeeItem>
            </RecentlyAddedContainer>
          </StyledCard>
          </div>
          </div>

        {/* Current Hotel */}
        <div className="col-md-9">
          <StyledCard>
            <CardHeader>
              Current Hotel <FaEllipsisH className="menu-icon" />
            </CardHeader>
            <HotelTableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Amount</th>
                    <th>Placeholder</th>
                    <th>Hire Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Receptionist</td>
                    <td>5</td>
                    <td>2,458</td>
                    <td>24-Jan-2021</td>
                  </tr>
                  <tr>
                    <td>Accountant</td>
                    <td>4</td>
                    <td>1,485</td>
                    <td>12-Jan-2021</td>
                  </tr>
                  <tr>
                    <td>Assistant Desk</td>
                    <td>#</td>
                    <td>1,024</td>
                    <td>5-Jan-2021</td>
                  </tr>
                  <tr>
                    <td>Placeholder</td>
                    <td>#</td>
                    <td>858</td>
                    <td>7-Mar-2021</td>
                  </tr>
                  <tr>
                    <td>Placeholder</td>
                    <td>#</td>
                    <td>258</td>
                    <td>17-Dec-2021</td>
                  </tr>
                </tbody>
              </StyledTable>
            </HotelTableContainer>
          </StyledCard>
        </div>

      {/* Current Employees */}
      <StyledCard>
        <CardHeader>
          Current Employees <Button className="btn-info" onClick={() => navigate('/employees/add')}>Add new Employee</Button>
        </CardHeader>
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Additional Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Employee Name</td>
                  <td>employee@email.com</td>
                  <td>123-456-7890</td>
                  <td>-</td>
                  <td>
                    <Button className="btn-warning">
                      <FaEdit />
                    </Button>
                    <Button className="btn-danger">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </StyledCard>

      {/* Recent Ticket */}
      <StyledCard>
        <CardHeader>Recent Ticket</CardHeader>
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Additional Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>Employee Name</td>
                  <td>employee@email.com</td>
                  <td>123-456-7890</td>
                  <td>Leave Request</td>
                  <td>
                    <Button className="btn-info">Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </StyledCard>
    </DashboardContainer>
  );
};

export default EmployeesPage;
