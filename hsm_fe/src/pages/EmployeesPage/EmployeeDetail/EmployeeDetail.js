import React from "react";
import { Pencil } from "lucide-react";

import {
    EmployeesDetailPage,
    Card
} from "./style";

const EmployeeDetail = () => {
    return (
        <EmployeesDetailPage>
            {/* Employee Header */}
            <Card className="flex items-center p-6 bg-gray-100">
                <img
                    src="/avatar.png"
                    alt="Employee"
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                />
                <div className="ml-6">
                    <h2 className="text-xl font-semibold">Employee 1</h2>
                    <p className="text-gray-600">Receptionist</p>
                </div>
            </Card>

            {/* General Information - Personal Details */}
            <InformationCard title="General Information">
                <p><strong>Employee ID:</strong> [Enter Employee ID]</p>
                <p><strong>Full Name:</strong> [Enter Full Name]</p>
                <p><strong>Photo:</strong> [Upload or Drag Photo Here]</p>
                <p><strong>Date of Birth:</strong> [Enter Date of Birth]</p>
                <p><strong>Gender:</strong> (Select Gender)</p>
                <p><strong>Phone Number:</strong> [Enter Phone Number]</p>
                <p><strong>Email Address:</strong> [Enter Email Address]</p>
                <p><strong>Address:</strong> [Enter Residential Address]</p>
            </InformationCard>

            {/* Job Details */}
            <InformationCard title="General Information">
                <p><strong>Position/Job Title:</strong> [Enter Job Title]</p>
                <p><strong>Employment Type:</strong> [Full-Time / Part-Time / Contract]</p>
                <p><strong>Supervisor/Manager:</strong> [Enter Supervisor Name]</p>
                <p><strong>Hire Date:</strong> [Enter Hire Date]</p>
                <p><strong>Work Location:</strong> [Enter Location or Branch]</p>
                <p><strong>Job Description:</strong> [Enter Job Responsibilities]</p>
            </InformationCard>



        </EmployeesDetailPage>
    );
};

const InformationCard = ({ title, children }) => {
    return (
        <Card className="mt-6 p-4 border border-gray-300">
            {/* Dùng flex để căn giữa title và nút chỉnh sửa */}
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-4">{children}</div>
                </div>
                <div>
                    <button className="text-gray-500 hover:text-gray-700 p-1">
                        <Pencil size={20} />
                    </button>
                </div>
            </div>
        </Card>
    );
};





export default EmployeeDetail;
