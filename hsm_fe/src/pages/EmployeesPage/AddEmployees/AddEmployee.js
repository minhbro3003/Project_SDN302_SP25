import React, { useEffect, useRef, useState } from "react";
import * as getAllEmployeeType from "../../../services/EmployeeService";
import * as getAllHotel from "../../../services/HotelService";
import * as getAllEmployeeSchedule from "../../../services/EmployeeScheduleService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
    AddEmployeesPage,
    Card,
    Label,
    Input,
    RadioGroup,
    RadioGroupItem,
} from "./style";
// Main component
const AddEmployees = () => {
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hotels, setHotels] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const formRef = useRef();

    // Cập nhật schedule khi chọn ngày & giờ
    const getVietnamDate = () => {
        const now = new Date();
        now.setHours(now.getHours() + 7); // Điều chỉnh theo GMT+7
        return now.toISOString().split("T")[0]; // Lấy phần YYYY-MM-DD
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;

        // Kiểm tra nếu giá trị giờ hợp lệ (trong khoảng 01:00 - 23:59)
        const isValidTime = (time) => {
            const regex = /^(0[1-9]|1\d|2[0-3]):([0-5]\d)$/; // Hỗ trợ 01:00 - 23:59
            return regex.test(time);
        };

        if (name === "start_time" || name === "end_time") {
            if (!isValidTime(value)) {
                alert(
                    "Giờ không hợp lệ! Vui lòng nhập giá trị từ 01:00 đến 23:59."
                );
                return;
            }
        }

        // Lấy ngày hiện tại theo múi giờ Việt Nam
        const today = getVietnamDate();

        setFormDataES((prev) => ({
            ...prev,
            schedule:
                prev.schedule.length > 0
                    ? [
                        {
                            ...prev.schedule[0],
                            date: prev.schedule[0].date || today,
                            [name]: value,
                        },
                    ]
                    : [
                        {
                            date: today,
                            start_time: "",
                            end_time: "",
                            [name]: value,
                        },
                    ],
        }));
    };

    const [formData, setFormData] = useState({
        FullName: "",
        Address: "",
        Email: "",
        Phone: "",
        Gender: "",
        Image: "link", // Placeholder image link
    });

    //add employeeschedule
    const [formDataES, setFormDataES] = useState({
        employees: "",
        hotels: "",
        employee_types: "",
        schedule: [
            {
                date: getVietnamDate(),
                start_time: "",
                end_time: "",
            },
        ],
    });

    // Cập nhật state khi chọn radio button
    const handleRadioChange = (e) => {
        setFormDataES((prev) => ({
            ...prev,
            employee_types: e.target.value,
        }));
    };

    // Fetch employee types
    useEffect(() => {
        const getAllEType = async () => {
            try {
                const res = await getAllEmployeeType.getAllEmployeeType();
                if (res?.status === "OK" && Array.isArray(res.data)) {
                    setEmployeeTypes(res.data);
                }
            } catch (error) {
                console.error("Error fetching employee types:", error);
            } finally {
                setLoading(false);
            }
        };

        getAllEType();
    }, []);

    // Fetch all hotels
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await getAllHotel.getAllHotel();
                if (response?.status === "OK" && Array.isArray(response.data)) {
                    setHotels(response.data);
                    setSelectedHotel(response.data[0]?._id || ""); // Lấy ID thay vì NameHotel
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách khách sạn:", error);
            }
        };

        fetchHotels();
    }, []);

    // Fetch all permissions
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await getAllEmployeeType.getAllPermission();
                if (response?.status === "OK" && Array.isArray(response.data)) {
                    setPermissions(response.data);
                    setSelectedPermissions(response.data[0]?._id || ""); // Lấy ID thay vì NameHotel
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách quyền:", error);
            }
        };

        fetchPermissions();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    // Handle gender selection
    const handleGenderChange = (e) => {
        setFormData((prevData) => ({ ...prevData, Gender: e.target.value }));
    };

    // Handle checkbox change
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    // Handle form submission

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Kiểm tra email hợp lệ
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.Email)) {
            newErrors.email = "Email không hợp lệ. Vui lòng nhập lại.";
        }

        // Kiểm tra số điện thoại hợp lệ
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.Phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ. Vui lòng nhập lại.";
        }

        if (!formData.FullName) {
            newErrors.fullName = "Tên nhân viên không được bỏ trống.";
        }
        if (!formData.Address) {
            newErrors.address = "Địa chỉ không được bỏ trống.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // **1. Tạo Employee trước**
        const employeeData = {
            hotels: [selectedHotel],
            FullName: formData.FullName,
            permissions: [selectedPermissions],
            Phone: formData.Phone,
            Email: formData.Email,
            Gender: formData.Gender,
            Image: formData.Image,
            Address: formData.Address,
        };

        console.log("Submitting employee data:", employeeData);

        try {
            const res = await getAllEmployeeType.createEmployee(employeeData);

            if (res?.status === "OK" && res.data?._id) {
                const newEmployeeId = res.data._id; // Lấy ID nhân viên vừa tạo

                console.log("New Employee ID:", newEmployeeId);

                // **2. Sau khi tạo nhân viên thành công, thêm vào EmployeeSchedule**
                const employeeScheduleData = {
                    employees: newEmployeeId, // Dùng ID nhân viên mới
                    hotels: selectedHotel,
                    employee_types: formDataES.employee_types,
                    schedule: formDataES.schedule,
                };

                console.log(
                    "Submitting employee schedule data:",
                    employeeScheduleData
                );

                const scheduleRes =
                    await getAllEmployeeSchedule.createEmployeeSchedule(
                        employeeScheduleData
                    );

                if (scheduleRes?.status === "OK") {
                    alert("Thêm nhân viên và lịch làm việc thành công!");
                    setFormData({
                        FullName: "",
                        Address: "",
                        Email: "",
                        Phone: "",
                        Gender: "",
                        Image: "link",
                    });
                    setFormDataES({
                        employees: "",
                        hotels: "",
                        employee_types: "",
                        schedule: [
                            {
                                date: getVietnamDate(), // Đặt lại giá trị mặc định
                                start_time: "",
                                end_time: "",
                            },
                        ],
                    });
                    setSelectedHotel("");
                    setSelectedPermissions("");
                    setIsChecked(false);
                    formRef.current?.reset();
                    window.location.reload();
                } else {
                    alert("Lỗi khi thêm lịch làm việc.");
                }
            } else if (
                res?.status === "error" &&
                res?.message === "The email of employee already exists"
            ) {
                alert("Email đã tồn tại. Vui lòng thử lại với email khác.");
            } else {
                alert("Lỗi khi thêm nhân viên.");
            }
        } catch (error) {
            console.error("Lỗi từ API: ", error);
            if (
                error?.code === 400 &&
                error?.message === "The email of employee already exists"
            ) {
                alert("Email đã tồn tại. Vui lòng thử lại với email khác.");
            } else {
                alert("Đã có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };

    return (
        <AddEmployeesPage>
            <Card>
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div
                        style={{
                            marginTop: "30px",
                            display: "flex",
                            gap: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                            <Label
                                style={{ fontSize: "20px" }}
                                htmlFor="FullName"
                            >
                                Employee Name
                            </Label>
                            <Input
                                id="FullName"
                                value={formData.FullName}
                                onChange={handleInputChange}
                                placeholder="Input"
                            />
                            {errors.fullName && (
                                <span style={{ color: "red" }}>
                                    {errors.fullName}
                                </span>
                            )}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                            <Label
                                style={{ fontSize: "20px" }}
                                htmlFor="Address"
                            >
                                Address
                            </Label>
                            <Input
                                id="Address"
                                value={formData.Address}
                                onChange={handleInputChange}
                                placeholder="Input"
                            />
                            {errors.address && (
                                <span style={{ color: "red" }}>
                                    {errors.address}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            marginTop: "30px",
                            display: "flex",
                            gap: "20px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                            <Label style={{ fontSize: "20px" }} htmlFor="Email">
                                Email
                            </Label>
                            <Input
                                id="Email"
                                value={formData.Email}
                                onChange={handleInputChange}
                                placeholder="Input"
                            />
                            {errors.email && (
                                <span style={{ color: "red" }}>
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                            <Label style={{ fontSize: "20px" }} htmlFor="Phone">
                                Phone
                            </Label>
                            <Input
                                id="Phone"
                                value={formData.Phone}
                                onChange={handleInputChange}
                                placeholder="Input"
                            />
                            {errors.phone && (
                                <span style={{ color: "red" }}>
                                    {errors.phone}
                                </span>
                            )}
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: "30px",
                            display: "flex",
                            gap: "20px",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <Label
                                style={{
                                    fontSize: "20px",
                                    marginBottom: "10px",
                                }}
                            >
                                Hotel Name
                            </Label>
                            <select
                                className="form-select"
                                value={selectedHotel}
                                onChange={(e) =>
                                    setSelectedHotel(e.target.value)
                                }
                            >
                                {hotels.map((hotel) => (
                                    <option key={hotel._id} value={hotel._id}>
                                        {hotel.NameHotel}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Label
                                style={{
                                    fontSize: "20px",
                                    marginBottom: "10px",
                                }}
                            >
                                Permission
                            </Label>
                            <select
                                className="form-select"
                                value={selectedPermissions}
                                onChange={(e) =>
                                    setSelectedPermissions(e.target.value)
                                }
                            >
                                {permissions.map((perm) => (
                                    <option key={perm._id} value={perm._id}>
                                        {perm.Note}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: "30px" }}>
                        <Label style={{ fontSize: "20px" }}>Gender</Label>
                        <RadioGroup>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <RadioGroupItem
                                    id="female"
                                    type="radio"
                                    value="female"
                                    name="gender"
                                    onChange={handleGenderChange}
                                />
                                <Label htmlFor="female">Female</Label>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <RadioGroupItem
                                    id="male"
                                    type="radio"
                                    value="male"
                                    name="gender"
                                    onChange={handleGenderChange}
                                />
                                <Label htmlFor="male">Male</Label>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <RadioGroupItem
                                    id="notSay"
                                    type="radio"
                                    value="notSay"
                                    name="gender"
                                    onChange={handleGenderChange}
                                />
                                <Label htmlFor="notSay">Rather not say</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div style={{ marginTop: "30px" }}>
                        <div
                            className="form-check form-switch"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                style={{ transform: "scale(1.5)" }}
                                onChange={handleCheckboxChange}
                            />
                            <Label
                                style={{ fontSize: "20px", margin: "0" }}
                                htmlFor="flexSwitchCheckDefault"
                            >
                                Additional Information
                            </Label>
                        </div>
                        {/* Nếu checkbox bật thì hiển thị phần chọn thời gian làm việc */}
                        {isChecked && (
                            <div style={{ marginTop: "20px" }}>
                                {/* Employment Type */}
                                <div style={{ marginTop: "30px" }}>
                                    <Label
                                        style={{
                                            fontSize: "20px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Employment Type
                                    </Label>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <div>
                                            {employeeTypes.map((item) => (
                                                <div
                                                    key={item._id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <input
                                                        id={item._id}
                                                        type="radio"
                                                        value={item._id}
                                                        name="job"
                                                        checked={
                                                            formDataES.employee_types ===
                                                            item._id
                                                        }
                                                        onChange={
                                                            handleRadioChange
                                                        }
                                                    />
                                                    <label htmlFor={item._id}>
                                                        {item.EmployeeType}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Date Picker */}
                                <div
                                    style={{
                                        marginTop: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Label
                                        style={{
                                            fontSize: "20px",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Date of Job:
                                    </Label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={
                                            formDataES.schedule[0]?.date ||
                                            getVietnamDate()
                                        }
                                        onChange={handleScheduleChange}
                                        min={getVietnamDate()}
                                    />
                                </div>

                                {/* Time Picker */}
                                <div
                                    style={{
                                        marginTop: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Label
                                        style={{ fontSize: "20px" }}
                                        htmlFor="start_time"
                                    >
                                        Select Working Hours:
                                    </Label>
                                    <input
                                        type="time"
                                        id="start_time"
                                        name="start_time"
                                        value={
                                            formDataES.schedule[0]
                                                ?.start_time || ""
                                        }
                                        onChange={handleScheduleChange}
                                        step="60"
                                        min="00:00"
                                        max="23:59"
                                        style={{ marginLeft: "10px" }}
                                    />
                                    <span style={{ margin: "0 10px" }}>to</span>
                                    <input
                                        type="time"
                                        id="end_time"
                                        name="end_time"
                                        value={
                                            formDataES.schedule[0]?.end_time ||
                                            ""
                                        }
                                        onChange={handleScheduleChange}
                                        step="60"
                                        min="00:00"
                                        max="23:59"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    >
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                backgroundColor: "#79D7BE",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#66C6A1")
                            } // Hover effect
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "#79D7BE")
                            } // Hover effect
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </Card>
        </AddEmployeesPage>
    );
};

export default AddEmployees;
