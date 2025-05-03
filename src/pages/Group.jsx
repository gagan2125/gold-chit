/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "../components/modals/Modal";
import axios from "axios";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import { Edit, Trash2 } from "lucide-react";
import CustomAlert from "../components/alerts/CustomAlert";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [TableGroups, setTableGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
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
    group_name: "",
    group_type: "",
    group_value: "",
    group_install: "",
    group_members: "",
    group_duration: "",
    start_date: "",
    end_date: "",
    minimum_bid: "",
    maximum_bid: "",
    commission: 5,
    reg_fee: "",
  });
  const [errors, setErrors] = useState({});
  const [updateFormData, setUpdateFormData] = useState({
    group_name: "",
    group_type: "",
    group_value: "",
    group_install: "",
    group_members: "",
    group_duration: "",
    start_date: "",
    end_date: "",
    minimum_bid: "",
    maximum_bid: "",
    commission: 5,
    reg_fee: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // apply validation here
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevData) => ({
      ...prevData,
      [name]: "",
    }));
  };

  const validateForm = (type) => {
    const newErrors = {};

    const data = type === "addGroup" ? formData : updateFormData;

    if (!data.group_name.trim()) {
      newErrors.group_name = "Group Name is required";
    }

    if (!data.group_type) {
      newErrors.group_type = "Group Type is required";
    }

    if (!data.group_value || isNaN(data.group_value) || data.group_value <= 0) {
      newErrors.group_value = "Group Value must be a positive number";
    }

    if (
      !data.group_install ||
      isNaN(data.group_install) ||
      data.group_install <= 0
    ) {
      newErrors.group_install =
        "Group Installment Amount must be a positive number";
    }

    if (
      !data.group_members ||
      isNaN(data.group_members) ||
      data.group_members <= 0
    ) {
      newErrors.group_members = "Group Members must be a positive number";
    }

    if (
      !data.group_duration ||
      isNaN(data.group_duration) ||
      data.group_duration <= 0
    ) {
      newErrors.group_duration = "Group Duration must be a positive number";
    }

    if (!data.reg_fee || isNaN(data.reg_fee) || data.reg_fee < 0) {
      newErrors.reg_fee = "Registration Fee must be a zero or positive number";
    }

    if (!data.start_date) {
      newErrors.start_date = "Start Date is required";
    }

    if (formData.end_date && !data.end_date) {
      newErrors.end_date = "End Date is required";
    } else if (
      formData.end_date &&
      new Date(data.end_date) < new Date(data.start_date)
    ) {
      newErrors.end_date = "End Date cannot be earlier than Start Date";
    }

    if (!data.minimum_bid || isNaN(data.minimum_bid) || data.minimum_bid <= 0) {
      newErrors.minimum_bid = "Minimum Bid must be a positive number";
    }

    if (!data.maximum_bid || isNaN(data.maximum_bid) || data.maximum_bid <= 0) {
      newErrors.maximum_bid = "Maximum Bid must be a positive number";
    } else if (parseFloat(data.maximum_bid) < parseFloat(data.minimum_bid)) {
      newErrors.maximum_bid =
        "Maximum Bid must be greater than or equal to Minimum Bid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm("addGroup");
    try {
      if (isValid) {
        const response = await api.post("/group/add-group", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // alert("Group Added Successfully");

        setAlertConfig({
          visibility: true,
          message: "Group Added Successfully",
          type: "success",
        });

        setShowModal(false);
        setFormData({
          group_name: "",
          group_type: "",
          group_value: "",
          group_install: "",
          group_members: "",
          group_duration: "",
          start_date: "",
          end_date: "",
          minimum_bid: "",
          maximum_bid: "",
          commission: "",
        });
      } else {
        console.log(errors);
      }
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
        const formattedData = response.data.map((group, index) => ({
          _id: group._id,
          id: index + 1,
          name: group.group_name,
          type:
            group.group_type.charAt(0).toUpperCase() +
            group.group_type.slice(1) +
            " Group",
          value: group.group_value,
          installment: group.group_install,
          members: group.group_members,
          date: group.createdAt,
          action: (
            <div className="flex justify-center gap-2">
              {/* <button
                onClick={() => handleUpdateModalOpen(group._id)}
                className="border border-green-400 text-white px-4 py-2 rounded-md shadow hover:border-green-700 transition duration-200"
              >
                <CiEdit color="green" />
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

              {/* <button
                onClick={() => handleDeleteModalOpen(group._id)}
                className="border border-red-400 text-white px-4 py-2 rounded-md shadow hover:border-red-700 transition duration-200"
              >
                <MdDelete color="red" />
              </button> */}
            </div>
          ),
        }));
        setTableGroups(formattedData);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/group/get-by-id-group/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    console.log("group id is ", groupId);
    try {
      const response = await api.get(`/group/get-by-id-group/${groupId}`);
      const groupData = response.data;
      const formattedStartDate = groupData.start_date.split("T")[0];
      const formattedEndDate = groupData.end_date.split("T")[0];
      setCurrentUpdateGroup(response.data);
      setUpdateFormData({
        group_name: response.data.group_name,
        group_type: response.data.group_type,
        group_value: response.data.group_value,
        group_install: response.data.group_install,
        group_members: response.data.group_members,
        group_duration: response.data.group_duration,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        minimum_bid: response.data.minimum_bid,
        maximum_bid: response.data.maximum_bid,
        reg_fee: response.data.reg_fee,
      });
      setShowModalUpdate(true);
      setErrors({});
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleInputChange = (e) => {
    console.log("updateFormData", updateFormData);
    const { name, value } = e.target;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: "" });
  };

  const handleDeleteGroup = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/group/delete-group/${currentGroup._id}`);
        // alert("Group deleted successfully");
        setAlertConfig({
          message: "Group deleted successfully",
          type: "success",
          visibility: true,
        });
        setShowModalDelete(false);
        setCurrentGroup(null);
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    try {
      if (isValid) {
        await api.put(
          `/group/update-group/${currentUpdateGroup._id}`,
          updateFormData
        );
        setShowModalUpdate(false);
        // alert("Group Updated Successfully");
        setAlertConfig({
          message: "Group updated successfully",
          type: "success",
          visibility: true,
        });

        //
      }
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Group Name" },
    { key: "type", header: "Group Type" },
    { key: "value", header: "Group Value" },
    { key: "installment", header: "Group Installment" },
    { key: "members", header: "Group Members" },
    { key: "action", header: "Action" },
  ];

  return (
    <>
      <div>
        <Navbar visibility={true} onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} />
        <CustomAlert
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
        />
        <div className="flex mt-20">
          <Sidebar />

          <div className="flex-grow p-7">
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">Groups</h1>
                <button
  onClick={() => {
    setShowModal(true);
    setErrors({});
  }}
  className="ml-4 bg-yellow-600 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-500 transition duration-200"
>
  + Add Group
</button>

              </div>
            </div>

            <DataTable
              catcher="_id"
              updateHandler={handleUpdateModalOpen}
              data={filterOption(TableGroups,searchText)}
              columns={columns}
                      exportedFileName={`Groups-${
                TableGroups.length > 0
                  ? TableGroups[0].date.split("T")[0] +
                    " to " +
                    TableGroups[TableGroups.length - 1].date.split("T")[0]
                  : "empty"
              }.csv`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* {filteredGroups.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500 text-lg">No groups added yet</p>
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center">
                      <h2 className="text-xl font-bold mb-3 text-gray-700 text-center">
                        {group.group_name}
                      </h2>
                      <p className="">{group.group_type.charAt(0).toUpperCase() + group.group_type.slice(1)} Group</p>
                      <div className="flex gap-16 py-3">
                        <p className="text-gray-500 mb-2 text-center">
                          <span className="font-medium text-gray-700 text-lg">
                            {group.group_members}
                          </span>
                          <br />
                          <span className="font-bold text-sm">Members</span>
                        </p>
                        <p className="text-gray-500 mb-4 text-center">
                          <span className="font-medium text-gray-700 text-lg">
                            ₹{group.group_install}
                          </span>
                          <br />
                          <span className="font-bold text-sm">Installment</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdateModalOpen(group._id)}
                        className="border border-green-400 text-white px-4 py-2 rounded-md shadow hover:border-green-700 transition duration-200"
                      >
                        <CiEdit color="green" />
                      </button>
                      <button
                        onClick={() => handleDeleteModalOpen(group._id)}
                        className="border border-red-400 text-white px-4 py-2 rounded-md shadow hover:border-red-700 transition duration-200"
                      >
                        <MdDelete color="red" />
                      </button>
                    </div>
                  </div>
                ))
              )} */}
            </div>
          </div>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
  <div className="py-6 px-5 lg:px-8 text-left bg-white rounded-xl shadow-lg">
    <h3 className="mb-4 text-xl font-bold text-black">Add Group</h3>
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      
      {/* Group Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-black">Group Name</label>
        <input
          type="text"
          name="group_name"
          value={formData.group_name}
          onChange={handleChange}
          placeholder="Enter the Group Name"
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        />
        {errors.group_name && <p className="text-red-500 text-sm mt-1">{errors.group_name}</p>}
      </div>

      {/* Group Type */}
      <div className="w-full">
        <label className="block mb-2 text-sm font-medium text-black">Group Type</label>
        <select
          name="group_type"
          value={formData.group_type}
          onChange={handleChange}
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        >
          <option value="">Select Group Type</option>
          <option value="divident">Divident Group</option>
          <option value="double">Double Group</option>
        </select>
        {errors.group_type && <p className="text-red-500 text-sm mt-1">{errors.group_type}</p>}
      </div>

      {/* Minimum Amount */}
      <div>
        <label className="block mb-2 text-sm font-medium text-black">Minimum Amount</label>
        <input
          type="number"
          name="minimum_amount"
          value={formData.minimum_amount}
          onChange={handleChange}
          placeholder="Enter Minimum Amount"
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        />
        {errors.minimum_amount && <p className="text-red-500 text-sm mt-1">{errors.minimum_amount}</p>}
      </div>

      {/* Per Member Amount */}
      <div>
        <label className="block mb-2 text-sm font-medium text-black">Per Member Amount</label>
        <input
          type="number"
          name="per_member_amount"
          value={formData.per_member_amount}
          onChange={handleChange}
          placeholder="Enter Per Member Amount"
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        />
        {errors.per_member_amount && <p className="text-red-500 text-sm mt-1">{errors.per_member_amount}</p>}
      </div>

      {/* Commission */}
      <div>
        <label className="block mb-2 text-sm font-medium text-black">Commission</label>
        <input
          type="number"
          name="commission"
          value={formData.commission}
          onChange={handleChange}
          placeholder="Enter Commission"
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        />
        {errors.commission && <p className="text-red-500 text-sm mt-1">{errors.commission}</p>}
      </div>

      {/* Minimum Group Member */}
      <div>
        <label className="block mb-2 text-sm font-medium text-black">Minimum Group Member</label>
        <input
          type="number"
          name="minimum_group_member"
          value={formData.minimum_group_member}
          onChange={handleChange}
          placeholder="Enter Minimum Group Member"
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        />
        {errors.minimum_group_member && <p className="text-red-500 text-sm mt-1">{errors.minimum_group_member}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block mb-2 text-sm font-medium text-black">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="bg-white border border-[#d4af37] text-black text-sm rounded-lg focus:ring-[#d4af37] focus:border-[#d4af37] w-full p-2.5"
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full text-white bg-[#d4af37] hover:bg-[#b48a2f] hover:text-black 
        focus:ring-4 focus:outline-none focus:ring-[#d4af37] font-semibold rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300"
      >
        Add Group
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
              Update Group
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  name="group_name"
                  value={updateFormData.group_name}
                  onChange={handleInputChange}
                  id="name"
                  placeholder="Enter the Group Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                {errors.group_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.group_name}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="category"
                >
                  Group Type
                </label>
                <select
                  name="group_type"
                  value={updateFormData.group_type || ""}
                  onChange={handleInputChange}
                  id="category"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Group Type</option>
                  <option value="divident">Dividend Group</option>
                  <option value="double">Double Group</option>
                </select>
                {errors.group_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.group_type}
                  </p>
                )}
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Value
                  </label>
                  <input
                    type="number"
                    name="group_value"
                    value={updateFormData.group_value}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Value"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.group_value && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.group_value}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Installment Amount
                  </label>
                  <input
                    type="number"
                    name="group_install"
                    value={updateFormData.group_install}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Installment Amount"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.group_install && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.group_install}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Members
                  </label>
                  <input
                    type="number"
                    name="group_members"
                    value={updateFormData.group_members}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Members"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.group_members && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.group_members}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Duration
                  </label>
                  <input
                    type="number"
                    name="group_duration"
                    value={updateFormData.group_duration}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Duration"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.group_duration && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.group_duration}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Registration Fee
                </label>
                <input
                  type="number"
                  name="reg_fee"
                  value={updateFormData.reg_fee}
                  onChange={handleInputChange}
                  id="name"
                  placeholder="Enter the Registration Fee"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                {errors.reg_fee && (
                  <p className="text-red-500 text-sm mt-1">{errors.reg_fee}</p>
                )}
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={updateFormData.start_date}
                    onChange={handleInputChange}
                    id="date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={updateFormData.end_date}
                    onChange={handleInputChange}
                    id="date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Minimum Bid %
                  </label>
                  <input
                    type="number"
                    name="minimum_bid"
                    value={updateFormData.minimum_bid}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Minimum Bid"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.minimum_bid && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.minimum_bid}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Maximum Bid %
                  </label>
                  <input
                    type="number"
                    name="maximum_bid"
                    value={updateFormData.maximum_bid}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Maximum Bid"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.maximum_bid && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.maximum_bid}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Update
              </button>
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
              Delete Group
            </h3>
            {currentGroup && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteGroup();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="groupName"
                  >
                    Please enter{" "}
                    <span className="text-primary font-bold">
                      {currentGroup.group_name}
                    </span>{" "}
                    to confirm deletion.
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    placeholder="Enter the Group Name"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
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
    </>
  );
};

export default Group;
