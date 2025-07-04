/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "../components/modals/Modal";
import { BsEye } from "react-icons/bs";
import {Dropdown} from "antd"
import DataTable from "../components/layouts/Datatable";
import { EyeIcon } from "lucide-react";
import CustomAlert from "../components/alerts/CustomAlert";
import Navbar from "../components/layouts/Navbar";
import { Select } from "antd";
import { IoMdMore } from "react-icons/io";
const Auction = () => {
  const [groups, setGroups] = useState([]);
  const [TableAuctions, setTableAuctions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedAuctionGroup, setSelectedAuctionGroup] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedAuctionGroupId, setSelectedAuctionGroupId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredAuction, setFilteredAuction] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [double, setDouble] = useState({});
  const [errors, setErrors] = useState({});
  const [searchText, setSearchText] = useState("");
  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [formData, setFormData] = useState({
    group_id: "",
    user_id: "",
    ticket: "",
    bid_amount: "",
    commission: "",
    win_amount: "",
    divident: "",
    divident_head: "",
    payable: "",
    auction_date: "",
    next_date: "",
    group_type: "",
    auction_type: "normal",
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        console.log(response);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchDouble = async () => {
      try {
        const response = await api.get(
          `/double/get-double/${selectedAuctionGroupId}`
        );
        console.log(response.data);
        setDouble(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchDouble();
  }, [selectedAuctionGroupId]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedGroupId) {
      newErrors.group = "Group selection is required";
    }

    if (!formData.auction_type) {
      newErrors.auction_type = "Auction type is required";
    }

    // Customer validation
    if (!formData.user_id) {
      newErrors.customer = "Customer selection is required";
    }

    // Bid Amount validation
    if (!formData.bid_amount) {
      newErrors.bid_amount = "Bid amount is required";
    } else if (
      isNaN(formData.bid_amount) ||
      parseFloat(formData.bid_amount) <= 0
    ) {
      newErrors.bid_amount = "Bid amount must be a positive number";
    } else if (
      groupInfo.group_value &&
      parseFloat(formData.bid_amount) > parseFloat(groupInfo.group_value)
    ) {
      newErrors.bid_amount = `Bid amount cannot exceed group value of ${groupInfo.group_value}`;
    }

    // Date validations
    if (!formData.auction_date) {
      newErrors.auction_date = "Auction date is required";
    }

    if (!formData.next_date) {
      newErrors.next_date = "Next date is required";
      console.log(formData.auction_type);
    } else if (formData.next_date < formData.auction_date) {
      newErrors.next_date = "Next date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    const [user_id, ticket] = value.split("-");
    setFormData((prevData) => ({
      ...prevData,
      user_id,
      ticket,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, customer: "" }));
  };

  const handleGroupChange = async (groupId) => {
    setSelectedGroup(groupId);

    if (groupId) {
      try {
        const response = await api.get(
          `/enroll/get-group-enroll-auction/${groupId}`
        );
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredUsers([]);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const handleGroup = async (event) => {
    const groupId = event.target.value;
    setErrors((prevErrors) => ({ ...prevErrors, group: "" }));
    setSelectedGroupId(groupId);
    handleGroupChange(groupId);

    if (groupId) {
      try {
        const response = await api.get(`/group/get-by-id-group/${groupId}`);
        console.log("API Response:", response.data);
        setGroupInfo(response.data || {});
      } catch (error) {
        console.error("Error fetching group data:", error);
        setGroupInfo({});
      }
    } else {
      setGroupInfo({});
    }
  };

  const handleGroupAuction = async (groupId) => {
  
    setSelectedAuctionGroupId(groupId);
    handleGroupAuctionChange(groupId);
  };

  const formatPayDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", " ");
  };
  const prevDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 10);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", " ");
  };
  const handleGroupAuctionChange = async (groupId) => {
    setSelectedAuctionGroup(groupId);
    if (groupId) {
      try {
        const response = await api.get(`/auction/get-group-auction/${groupId}`);
        if (response.data && response.data.length > 0) {
          setFilteredAuction(response.data);
          const formattedData = [
            {
              id: 1,
              date: prevDate(response?.data[0]?.auction_date),
              name: "Commencement",
              phone_number: "Commencement",
              ticket: "Commencement",
              bid_amount: 0,
              amount: 0,
              auction_type: "Commencement Auction",
              // action: (
              //   <div className="flex justify-end gap-2">
              //     <button
              //       onClick={() => console.log("Custom View Action")}
              //       className="border border-green-400 text-white px-4 py-2 rounded-md shadow hover:border-green-700 transition duration-200"
              //     >
              //       <EyeIcon color="green" />
              //     </button>
              //     <button
              //       onClick={() => console.log("Custom Delete Action")}
              //       className="border border-red-400 text-white px-4 py-2 rounded-md shadow hover:border-red-700 transition duration-200"
              //     >
              //       <MdDelete color="red" />
              //     </button>
              //   </div>
              // ),
            },
            ...response.data.map((group, index) => ({
              _id:group._id,
              id: index + 2,
              date: formatPayDate(group.auction_date),
              name: group.user_id?.full_name,
              phone_number: group.user_id?.phone_number,
              ticket: group.ticket,
              bid_amount: parseInt(group.divident) + parseInt(group.commission),
              amount: group.win_amount,
              auction_type:
                group?.auction_type.charAt(0).toUpperCase() +
                group?.auction_type.slice(1) +
                " Auction",
              action: (
                <div className="flex justify-center gap-2">
                  {/* <button
                    onClick={() => handleUpdateModalOpen(group._id)}
                    className="border border-green-400 text-white px-4 py-2 rounded-md shadow hover:border-green-700 transition duration-200"
                  >
                    <EyeIcon color="green" />
                  </button> */}
                  {/* <button
                    onClick={() => handleDeleteModalOpen(group._id)}
                    className="border border-red-400 text-white px-4 py-2 rounded-md shadow hover:border-red-700 transition duration-200"
                  >
                    <MdDelete color="red" />
                  </button> */}
                   <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div
                          className="text-green-600"
                          onClick={() => handleUpdateModalOpen(group._id)}
                        >
                          Edit
                        </div>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <div
                          className="text-red-600"
                          onClick={() => handleDeleteModalOpen(group._id)}
                        >
                          Delete
                        </div>
                      ),
                    },
                  ],
                }}
                placement="bottomLeft"
              >
                <IoMdMore className="text-bold" />
              </Dropdown>
                </div>
              ),
            })),
          ];
          setTableAuctions(formattedData);
        } else {
          setFilteredAuction([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredAuction([]);
      }
    } else {
      setFilteredAuction([]);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "date", header: "Auction Date" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
    { key: "ticket", header: "Ticket" },
    { key: "bid_amount", header: "Bid Amount" },
    { key: "amount", header: "Win Amount" },
    { key: "auction_type", header: "Auction Type" },
    { key: "action", header: "Action" },
  ];

  useEffect(() => {
    if (groupInfo && formData.bid_amount) {
      const commission = (groupInfo.group_value * 5) / 100 || 0;
      const win_amount =
        (groupInfo.group_value || 0) - (formData.bid_amount || 0);
      const divident = (formData.bid_amount || 0) - commission;
      const divident_head = groupInfo.group_members
        ? divident / groupInfo.group_members
        : 0;
      const payable = (groupInfo.group_install || 0) - divident_head;

      setFormData((prevData) => ({
        ...prevData,
        group_id: groupInfo._id,
        commission,
        win_amount,
        divident,
        divident_head,
        payable,
        group_type: groupInfo.group_type,
      }));
    }
  }, [groupInfo, formData.bid_amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isvalid = validateForm();
    try {
      if (isvalid) {
        const response = await api.post("/auction/add-auction", formData);
        if (response.status === 201) {
          setAlertConfig({
            visibility: true,
            message: "Auction Added Successfully",
            type: "success",
          });
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error submitting auction data:", error);
    }
  };

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/auction/get-auction-by-id/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching enroll:", error);
    }
  };

  const handleDeleteAuction = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/auction/delete-auction/${currentGroup._id}`);
        setAlertConfig({
          visibility: true,
          message: "Auction deleted successfully",
          type: "success",
        });
        setShowModalDelete(false);
        setCurrentGroup(null);
      } catch (error) {
        console.error("Error deleting auction:", error);
      }
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/auction/get-auction-by-id/${groupId}`);
      setCurrentUpdateGroup(response.data);
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  console.log(filteredAuction);

  return (
    <>
      <div>
        <div className="flex mt-20">
        <Navbar onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} visibility={true}/>
          <Sidebar />

          <CustomAlert
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
          />
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-semibold">Auctions</h1>
            <div className="mt-6 mb-8">
              <div className="mb-10">
                <label>Select or Search Group</label>
                <div className="flex justify-between items-center w-full">
                  <Select
                    value={selectedAuctionGroupId || undefined}
                    onChange={handleGroupAuction}
                    popupMatchSelectWidth={false}
                    showSearch
                    className="w-full max-w-md"
                    filterOption={(input, option) =>
                      option.children.toString()
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                        placeholder="Search or Select Group"
                  >
                    
                    {groups.map((group) => (
                      <Select.Option key={group?._id} value={group?._id}>
                        {group.group_name}
                      </Select.Option>
                    ))}
                  </Select>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setErrors({});
                    }}
                    className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                  >
                    + Add Auction
                  </button>
                </div>
                <p className="text-xl items-center mt-5"></p>
                {filteredAuction[0]?.group_id?.group_type  && ( //
                  <>
                    <p className="text-xl items-center">
                      Balance: {double.amount}
                    </p>
                  </>
                )}
              </div>
              <div className="">
                <DataTable
                updateHandler={handleUpdateModalOpen}
               
                  data={TableAuctions.filter((item) =>
                    Object.values(item).some((value) =>
                      String(value).toLowerCase().includes(searchText.toLowerCase())
                    )
                  )}
                  columns={columns}
                  exportedFileName={`Auctions ${
                    TableAuctions.length > 0
                      ? TableAuctions[1].date +
                        " to " +
                        TableAuctions[TableAuctions.length - 1].date
                      : "empty"
                  }.csv`}
                />
              </div>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                {filteredAuction.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500 text-lg">
                      {selectedAuctionGroup
                        ? "No Auction is present for the selected group"
                        : "Select Group to View"}
                    </p>
                  </div>
                ) : (
                  filteredAuction.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <div className="flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-3 text-gray-700 text-center">
                          {user.user_id?.full_name}
                        </h2>
                        <div className="flex gap-16 py-3">
                          <p className="text-gray-500 mb-2 text-center">
                            <span className="font-medium text-gray-700 text-xl">
                              {user.user_id?.phone_number}
                            </span>
                            <br />
                            <span className="font-bold text-sm">
                              Phone Number
                            </span>
                          </p>
                          <p className="text-gray-500 mb-4 text-center">
                            <span className="font-medium text-gray-700 text-xl">
                              {user.ticket}
                            </span>
                            <br />
                            <span className="font-bold text-sm">Ticket</span>
                          </p>
                          <p className="text-gray-500 mb-4 text-center">
                            <span className="font-medium text-gray-700 text-xl">
                              {user.win_amount}
                            </span>
                            <br />
                            <span className="font-bold text-sm">Amount</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateModalOpen(user._id)}
                          className="border border-green-400 text-white px-4 py-2 rounded-md shadow hover:border-green-700 transition duration-200"
                        >
                          <BsEye color="green" />
                        </button>
                        <button
                          onClick={() => handleDeleteModalOpen(user._id)}
                          className="border border-red-400 text-white px-4 py-2 rounded-md shadow hover:border-red-700 transition duration-200"
                        >
                          <MdDelete color="red" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div> */}
            </div>
          </div>
          <Modal
            isVisible={showModal}
            onClose={() => {
              setShowModal(false), setErrors({});
            }}
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Add Auction
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedGroupId}
                    onChange={handleGroup}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                    <option value="">Select Group</option>
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.group_name}
                      </option>
                    ))}
                  </select>
                  {errors.group && (
                    <p className="mt-1 text-sm text-red-500">{errors.group}</p>
                  )}
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Group Value
                    </label>
                    <input
                      type="number"
                      name="group_value"
                      value={groupInfo.group_value || 0}
                      id="group_value"
                      placeholder="select group to check"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Group Installment
                    </label>
                    <input
                      type="text"
                      name="group_install"
                      value={groupInfo.group_install || 0}
                      id="group_install"
                      placeholder="select group to check"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                {groupInfo.group_type === "double" && (
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="category"
                    >
                      Auction Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="auction_type"
                      value={formData.auction_type}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    >
                      <option value="normal">Normal Auction</option>
                      <option value="free">Free Auction</option>
                    </select>

                    {errors.auction_type && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.auction_type}
                      </p>
                    )}
                  </div>
                )}
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Customers <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="user_id"
                    value={`${formData.user_id}-${formData.ticket}`}
                    onChange={handleChangeUser}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                    <option value="">Select Customer</option>
                    {filteredUsers.map((user) => (
                      user?.user_id?._id && <option
                        key={`${user.user_id._id}-${user.tickets}`}
                        value={`${user.user_id._id}-${user.tickets}`}
                      >
                        {user.user_id.full_name} | {user.tickets}
                      </option>
                    ))}
                  </select>
                  {errors.customer && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.customer}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Bid Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bid_amount"
                    value={formData.bid_amount}
                    onChange={handleChange}
                    id="name"
                    placeholder="Enter the Bid Amount"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.bid_amount && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bid_amount}
                    </p>
                  )}
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Commission
                    </label>
                    <input
                      type="text"
                      name="commission"
                      value={formData.commission}
                      id="commission"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Winning Amount
                    </label>
                    <input
                      type="text"
                      name="win_amount"
                      value={formData.win_amount}
                      id="win_amount"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Divident
                    </label>
                    <input
                      type="text"
                      name="divident"
                      value={formData.divident}
                      id="divident"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Divident per Head
                    </label>
                    <input
                      type="text"
                      name="divident_head"
                      value={formData.divident_head}
                      id="divident_head"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Next Payable
                    </label>
                    <input
                      type="text"
                      name="payable"
                      value={formData.payable}
                      id="payable"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="date"
                    >
                      Auction Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="auction_date"
                      value={formData.auction_date}
                      onChange={handleChange}
                      id="date"
                      placeholder="Enter the Date"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                    {errors.auction_date && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.auction_date}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="date"
                    >
                      Next Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="next_date"
                      value={formData.next_date}
                      onChange={handleChange}
                      id="date"
                      placeholder="Enter the Date"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                    {errors.next_date && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.next_date}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-yellow-500
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Add
                </button>
              </form>
            </div>
          </Modal>
          <Modal
            isVisible={showModalUpdate}
            onClose={() => setShowModalUpdate(false)}
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                View Auction
              </h3>
              <form className="space-y-6" onSubmit={() => {}}>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Group
                  </label>
                  <input
                    type="text"
                    name="group_id"
                    value={currentUpdateGroup?.group_id?.group_name}
                    onChange={() => {}}
                    id="name"
                    placeholder="Enter the Group Name"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Group Value
                    </label>
                    <input
                      type="text"
                      name="group_value"
                      value={currentUpdateGroup?.group_id?.group_value}
                      id="group_value"
                      placeholder="select group to check"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Group Installment
                    </label>
                    <input
                      type="text"
                      name="group_install"
                      value={currentUpdateGroup?.group_id?.group_install}
                      id="group_install"
                      placeholder="select group to check"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                {currentUpdateGroup?.group_id?.group_type === "double" && (
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="category"
                    >
                      Auction Type
                    </label>
                    <input
                      type="text"
                      name="group_id"
                      value={
                        currentUpdateGroup?.auction_type
                          .charAt(0)
                          .toUpperCase() +
                        currentUpdateGroup?.auction_type.slice(1) +
                        " Auction"
                      }
                      onChange={() => {}}
                      id="name"
                      placeholder="Enter the User Name"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                )}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Customer
                  </label>
                  <input
                    type="text"
                    name="group_id"
                    value={`${currentUpdateGroup?.user_id?.full_name} | ${currentUpdateGroup?.ticket}`}
                    onChange={() => {}}
                    id="name"
                    placeholder="Enter the User Name"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Bid Amount
                  </label>
                  <input
                    type="number"
                    name="bid_amount"
                    value={
                      currentUpdateGroup?.group_id?.group_value -
                      currentUpdateGroup?.win_amount
                    }
                    onChange={() => {}}
                    id="name"
                    placeholder="Enter the Bid Amount"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Commission
                    </label>
                    <input
                      type="text"
                      name="commission"
                      value={currentUpdateGroup?.commission}
                      id="commission"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Winning Amount
                    </label>
                    <input
                      type="text"
                      name="win_amount"
                      value={currentUpdateGroup?.win_amount}
                      id="win_amount"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Divident
                    </label>
                    <input
                      type="text"
                      name="divident"
                      value={currentUpdateGroup?.divident}
                      id="divident"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Divident per Head
                    </label>
                    <input
                      type="text"
                      name="divident_head"
                      value={currentUpdateGroup?.divident_head}
                      id="divident_head"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Next Payable
                    </label>
                    <input
                      type="text"
                      name="payable"
                      value={currentUpdateGroup?.payable}
                      id="payable"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="date"
                    >
                      Auction Date
                    </label>
                    <input
                      type="date"
                      name="auction_date"
                      value={currentUpdateGroup?.auction_date}
                      onChange={() => {}}
                      id="date"
                      placeholder="Enter the Date"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="date"
                    >
                      Next Date
                    </label>
                    <input
                      type="date"
                      name="next_date"
                      value={currentUpdateGroup?.next_date}
                      onChange={() => {}}
                      id="date"
                      placeholder="Enter the Date"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
              </form>
            </div>
          </Modal>
          <Modal
            isVisible={showModalDelete}
            onClose={() => {
              setShowModalDelete(false);
              setCurrentGroup(null);
            }}
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Sure want to delete this Auction ? <span className="text-red-500">*</span>
              </h3>
              {currentGroup && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDeleteAuction();
                  }}
                  className="space-y-6"
                >
                  <button
                    type="submit"
                    className="w-full text-white bg-red-700 hover:bg-red-800
                    focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Delete
                  </button>
                </form>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Auction;
