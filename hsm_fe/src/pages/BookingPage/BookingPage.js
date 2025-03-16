import React, { useEffect, useRef, useState } from 'react';
import { Calendar, DatePicker } from "antd";
import * as getAllRoomsServices from "../../services/RoomService";
import * as BookingService from "../../services/BookingService";
import * as createCustomerService from "../../services/CustomerService";
import { Button, Space, Table, Radio } from "antd";
import dayjs from "dayjs";
import { io } from "socket.io-client";

import {
  SearchOutlined,
} from "@ant-design/icons";
import {
  Booking,
  Card,
  Label,
  Input
} from "./style";
const socket = io("http://localhost:9999");

const BookingPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  //danh sách gợi ý số tiền.
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { RangePicker } = DatePicker;
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errors, setErrors] = useState({});
  const [typerooms, setTypeRooms] = useState([]);

  const formRef = useRef();


  const [formDataCustomer, setFormDataCustomer] = useState({
    full_name: "",
    phone: "",
    cccd: "",
  });

  const [formData, setFormData] = useState({
    customers: "",
    rooms: "",
    Time: {
      Checkin: "",
      Checkout: "",
    },
    GuestsNumber: "1",
    SumPrice: 0,
    Status: "Booked",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleChangeCustomer = (e) => {
    const { name, value } = e.target;
    setFormDataCustomer({ ...formDataCustomer, [name]: value });

    let newErrors = { ...errors };

    // Kiểm tra số điện thoại Việt Nam
    const vietnamPhoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    if (name === "phone") {
      if (!vietnamPhoneRegex.test(value) && value.length > 0) {
        newErrors.phone = "Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam (VD: 0987654321).";
      } else {
        delete newErrors.phone;
      }
    }

    // Kiểm tra CCCD hợp lệ (đúng 12 số)
    const cccdRegex = /^[0-9]{12}$/;
    if (name === "cccd") {
      if (!cccdRegex.test(value) && value.length > 0) {
        newErrors.cccd = "CCCD phải có đúng 12 số!";
      } else {
        delete newErrors.cccd;
      }
    }

    setErrors(newErrors);
  };
  // Lấy thời gian hiện tại khi ấn submit
  const bookingTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Kiểm tra phòng đã được đặt chưa
    const checkin = dayjs(formData.Time.Checkin);
    const checkout = dayjs(formData.Time.Checkout);

    const isRoomBooked = bookings.some((booking) => {
      const bookedCheckin = dayjs(booking.Time.Checkin);
      const bookedCheckout = dayjs(booking.Time.Checkout);

      return (
        selectedRoom?._id === booking.rooms &&
        checkin.isBefore(bookedCheckout) &&
        checkout.isAfter(bookedCheckin)
      );
    });

    if (isRoomBooked) {
      newErrors.rooms = "Phòng này đã được đặt trong khoảng thời gian này.";
    }
    // Kiểm tra tên khách hàng
    if (!formDataCustomer.full_name.trim()) {
      newErrors.Full_name = "Tên khách hàng không được bỏ trống.";
    }

    // Kiểm tra số điện thoại hợp lệ
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formDataCustomer.phone) {
      newErrors.phone = "Số điện thoại không được bỏ trống.";
    } else if (!phoneRegex.test(formDataCustomer.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    // Kiểm tra CCCD hợp lệ (chỉ số và đúng 12 ký tự)
    const cccdRegex = /^[0-9]{12}$/;
    if (!formDataCustomer.cccd) {
      newErrors.cccd = "Căn cước công dân không được bỏ trống.";
    } else if (!cccdRegex.test(formDataCustomer.cccd)) {
      newErrors.cccd = "CCCD phải có đúng 12 số.";
    }

    // Kiểm tra Check-in và Check-out
    if (!formData.Time.Checkin || !formData.Time.Checkout) {
      newErrors.Time = "Vui lòng chọn ngày Check-in và Check-out.";
    }

    // Kiểm tra Room đã chọn chưa
    if (!selectedRoom?._id) {
      newErrors.rooms = "Vui lòng chọn phòng.";
    }

    // Nếu có lỗi, cập nhật state và không gửi request
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const customerRes = await createCustomerService.createCustomer(formDataCustomer);
      console.log("Customer response:", customerRes);
      if (customerRes?.status === "OK" && customerRes.data?._id) {
        const newCustomerId = customerRes.data._id;

        const bookingData = {
          customers: newCustomerId,
          rooms: selectedRoom?._id,
          Time: formData.Time,
          GuestsNumber: formData.GuestsNumber,
          SumPrice: formData.SumPrice,
          Status: "Completed",
        };
        console.log("Final bookingData:", bookingData);


        const bookingRes = await BookingService.createBooking(bookingData);
        if (bookingRes?.status === "OK") {
          alert("Booking thành công!");

          // Gửi thông báo đến Admin qua Socket.io
          socket.emit("new_booking", {
            sender: formDataCustomer.full_name?.trim() || "Hệ thống",
            message: `Đã có một booking mới! Khách: ${formDataCustomer.full_name || "Không xác định"} đã đặt phòng ${selectedRoom?.RoomName || "Không xác định"} từ ngày ${formData.Time.Checkin || "N/A"} đến ngày ${formData.Time.Checkout || "N/A"} có roomId ${selectedRoom._id}.`,
            createdAt: new Date().toISOString()
          });
          



          resetForm();
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Lỗi từ API: ", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };
  const resetForm = () => {
    setFormDataCustomer({ full_name: "", phone: "", cccd: "" });
    setFormData({
      customers: "",
      rooms: "",
      Time: { Checkin: "", Checkout: "" },
      GuestsNumber: "1",
      SumPrice: 0,
      Status: "Booked",
    });
    setSelectedRoom(null);
    setErrors({});
    formRef.current?.reset();
  };


  ///get all room
  useEffect(() => {
    const getAllRoom = async () => {
      try {
        const res = await getAllRoomsServices.getAllRoom();
        if (res?.status === "OK" && Array.isArray(res.data)) {
          setRooms(res.data);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllRoom();
  }, []);

  ///get all room
  useEffect(() => {
    const getAllTypeRoom = async () => {
      try {
        const res = await getAllRoomsServices.getAllTypeRoom();
        if (res?.status === "OK" && Array.isArray(res.data)) {
          setTypeRooms(res.data);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllTypeRoom();
  }, []);


  //list room
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters)
            }
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },

  });


  const handleDateChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      const checkin = dayjs(dateStrings[0]);
      const checkout = dayjs(dateStrings[1]);

      // Kiểm tra xem phòng đã được đặt chưa
      const isRoomBooked = bookings.some((booking) => {
        const bookedCheckin = dayjs(booking.Time.Checkin);
        const bookedCheckout = dayjs(booking.Time.Checkout);

        return (
          selectedRoom?._id === booking.rooms && // Đúng phòng
          checkin.isBefore(bookedCheckout) && // Check-in mới trước Check-out đã đặt
          checkout.isAfter(bookedCheckin) // Check-out mới sau Check-in đã đặt
        );
      });

      if (isRoomBooked) {
        setErrors((prev) => ({
          ...prev,
          rooms: "Phòng này đã được đặt trong khoảng thời gian đã chọn.",
        }));
        return;
      }

      // Nếu phòng chưa được đặt, cập nhật state
      setFormData((prev) => ({
        ...prev,
        Time: {
          Checkin: dateStrings[0],
          Checkout: dateStrings[1],
        },
        SumPrice: selectedRoom ? checkout.diff(checkin, "days") * selectedRoom.Price : 0,
      }));
      setErrors((prev) => ({ ...prev, rooms: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        Time: { Checkin: "", Checkout: "" },
        SumPrice: 0,
      }));
    }
  };


  const handleChangeMoney = () => {
    if (selectedRoom && formData.Checkin && formData.Checkout) {
      const checkin = dayjs(formData.Checkin);
      const checkout = dayjs(formData.Checkout);
      const nights = checkout.diff(checkin, "days");

      const totalPrice = nights * selectedRoom.Price;
      setFormData((prev) => ({ ...prev, SumPrice: totalPrice }));
    }
  };
  // Gọi lại khi `selectedRoom`, `checkIn` hoặc `checkOut` thay đổi
  useEffect(() => {
    handleChangeMoney();
  }, [selectedRoom, formData.Time.Checkin, formData.Time.Checkout]);

  // Kiểm tra xem phòng này đã được đặt vào ngày `selectedDate` hay chưa
  useEffect(() => {
    const getAllBooking = async () => {
      try {
        const res = await BookingService.getAllBooking();
        if (res?.status === "OK" && Array.isArray(res.data)) {
          setBookings(res.data);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllBooking();
  }, []);

  const columns = [

    {
      title: "Choose",
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Radio.Group
          onChange={(e) => {
            const selectedId = e.target.value;
            const selected = rooms.find((room) => room._id === selectedId);
            setSelectedRoom(selected);

            // Nếu đã chọn ngày, tính tổng giá ngay
            if (formData.Time?.Checkin && formData.Time?.Checkout) {
              const checkin = dayjs(formData.Time?.Checkin);
              const checkout = dayjs(formData.Time?.Checkout);
              const nights = checkout.diff(checkin, "days");
              const totalPrice = nights * selected.Price;

              setFormData((prev) => ({ ...prev, SumPrice: totalPrice }));
            }
          }}
          value={selectedRoom?._id || null}
        >
          <Radio
            value={record._id}
            style={{
              fontWeight: "bold",
              transform: "scale(1.2)",
              color: selectedRoom?._id === record._id ? "#ff4d4f" : "inherit",
            }}
          />
        </Radio.Group>
      ),
    },
    {
      title: "RoomName",
      dataIndex: "RoomName",//lấy ra roomName
      key: "RoomName",
      // width: "30%",
      ...getColumnSearchProps("RoomName"),
      sorter: (a, b) => a.RoomName.localeCompare(b.RoomName),
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      ...getColumnSearchProps("Price"),
      sorter: (a, b) => a.Price - b.Price,
      sortDirections: ["descend", "ascend"],
      render: (price) => new Intl.NumberFormat("vi-VN").format(price) + "đ", // Format VNĐ
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      ...getColumnSearchProps("Status"),
      sorter: (a, b) => a.Status.localeCompare(b.Status),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => {
        // Kiểm tra nếu chưa chọn ngày hoặc giá trị không hợp lệ
        if (!formData.Time.Checkin || !formData.Time.Checkout) {
          return <span style={{ color: "green", fontWeight: "bold" }}>Available</span>;
        }

        const checkin = dayjs(formData.Time.Checkin);
        const checkout = dayjs(formData.Time.Checkout);

        // Kiểm tra nếu phòng đã bị đặt trong khoảng thời gian chọn
        const isRoomBooked = bookings.some((booking) => {
          const bookedCheckin = dayjs(booking.Time.Checkin);
          const bookedCheckout = dayjs(booking.Time.Checkout);

          return (
            String(record._id) === String(booking.rooms) && // Kiểm tra phòng trùng khớp
            checkin.isBefore(bookedCheckout, "day") && // Check-in mới trước Check-out đã đặt
            checkout.isAfter(bookedCheckin, "day") // Check-out mới sau Check-in đã đặt
          );
        });

        return (
          <span style={{ color: isRoomBooked ? "red" : "green", fontWeight: "bold" }}>
            {isRoomBooked ? "Booked" : "Available"}
          </span>
        );
      },
    },
    {
      title: "Type Rooms",
      dataIndex: "typerooms",
      key: "typerooms",
      ...getColumnSearchProps("typerooms"),
      sorter: (a, b) => {
        const typeA = typerooms.find((t) => t._id.toString() === a.typerooms)?.TypeName || "";
        const typeB = typerooms.find((t) => t._id.toString() === b.typerooms)?.TypeName || "";
        return typeA.localeCompare(typeB);
      },
      sortDirections: ["descend", "ascend"],
      render: (typeroomId) => {
        const type = typerooms.find((t) => t._id.toString() === typeroomId);
        return type ? type.TypeName : "Unknown";
      },
    }

  ];

  return (
    <Booking>
      <Card>
        <div style={{ maxHeight: "90vh", overflowY: "auto", paddingRight: "10px" }}>
          <h2 className="text-xl font-bold mb-4" style={{ textAlign: "center" }}>Customer Booking Form</h2>
          <form ref={formRef} onSubmit={handleSubmit}>

            <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Label style={{ fontSize: "20px" }} className="block font-semibold">
                  <span style={{ color: "red", fontSize: "25px" }}>*</span> Customer Name
                </Label>
                <Input type="text" name="full_name" value={formDataCustomer.full_name} onChange={handleChangeCustomer} className="w-full p-2 border rounded" />
                {errors.Full_name && <span style={{ color: "red" }}>{errors.Full_name}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Label style={{ fontSize: "20px" }} className="block font-semibold">
                  <span style={{ color: "red", fontSize: "25px" }}>*</span>Phone
                </Label>
                <Input type="tel" name="phone" value={formDataCustomer.phone} onChange={handleChangeCustomer} className="w-full p-2 border rounded" />
                {errors.phone && <span style={{ color: "red" }}>{errors.phone}</span>}

              </div>
            </div>

            <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Label style={{ fontSize: "20px" }} className="block font-semibold">
                  <span style={{ color: "red", fontSize: "20px" }}>*</span>Citizen Identification Card
                </Label>
                <Input type="text" name="cccd" value={formDataCustomer.cccd} onChange={handleChangeCustomer} className="w-full p-2 border rounded" />
                {errors.cccd && <span style={{ color: "red" }}>{errors.cccd}</span>}

              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Label style={{ fontSize: "20px" }} className="block font-semibold">
                  Number of Guests
                </Label>
                <Input type="number" name="GuestsNumber" value={formData.GuestsNumber} onChange={handleChange} min="1" className="w-full p-2 border rounded" />
              </div>
            </div>

            <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
                <Label style={{ fontSize: "20px" }} className="block font-semibold">
                  <span style={{ color: "red" }}>*</span>SumPrice
                </Label>
                <Input
                  type="text"
                  name="sumPrice"
                  value={new Intl.NumberFormat("vi-VN").format(formData.SumPrice) + "đ"} // Định dạng tiền tệ VNĐ
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100" // Chỉ đọc, không cho người dùng nhập
                />
              </div>
            </div>


            <div style={{ marginTop: "30px", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Label style={{ fontSize: "20px", flex: 1 }} className="block font-semibold">
                  <span style={{ color: "red", fontSize: "25px" }}>*</span>Checkin Date
                </Label>
                <Label style={{ fontSize: "20px", flex: 1, paddingLeft: "25px" }} className="block font-semibold">
                  <span style={{ color: "red", fontSize: "25px" }}>*</span>Checkout Date
                </Label>
              </div>
              <RangePicker
                className="date-picker"
                onChange={handleDateChange}
                format="YYYY-MM-DD"
              />
              {errors.Time && <p style={{ color: "red" }}>{errors.Time}</p>}
              <Calendar
                fullscreen={false}
                onSelect={(date) => setSelectedDate(date)}
              />
            </div>
            <div>
              <div>
                <Label style={{ fontSize: "20px", textAlign: "center" }} className="block font-semibold">
                  <span style={{ color: "red", fontSize: "25px" }}>*</span>Booking Room
                </Label>
                {errors.rooms && <p style={{ color: "red" }}>{errors.rooms}</p>}
              </div>
              <div>
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={rooms.length > 0 ? rooms : []}
                  loading={loading}
                  pagination={{
                    pageSize: 5, // Số phòng hiển thị trên mỗi trang
                    showSizeChanger: false, // Ẩn tùy chọn thay đổi số lượng hiển thị mỗi trang
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
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
                  transition: "background-color 0.3s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#66C6A1"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#79D7BE"}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </Card>
    </Booking>
  );
};
export default BookingPage;
