/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "../components/modals/Modal";

import api from "../instance/TokenInstance";

const WeekGroup = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);

  const [formData, setFormData] = useState({
    group_name: "",
    group_type: "",
    group_method: "week",
    group_value: "",
    group_install: "",
    group_members: "",
    group_duration: "",
    start_date: "",
    end_date: "",
    minimum_bid: "",
    maximum_bid: "",
    commission: 5,
  });

  const [updateFormData, setUpdateFormData] = useState({
    group_name: "",
    group_type: "",
    group_method: "week",
    group_value: "",
    group_install: "",
    group_members: "",
    group_duration: "",
    start_date: "",
    end_date: "",
    minimum_bid: "",
    maximum_bid: "",
    commission: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/group/add-group", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.reload();
      alert("Group Added Successfully");

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
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        console.log(response);
        const filteredGroups = response.data.filter(
          (group) => group.group_method === "week"
        );

        setGroups(filteredGroups);
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
    try {
      const response = await api.get(`/group/get-by-id-group/${groupId}`);
      const groupData = response.data;
      const formattedStartDate = groupData.start_date.split("T")[0];
      const formattedEndDate = groupData.end_date.split("T")[0];
      setCurrentUpdateGroup(response.data);
      setUpdateFormData({
        group_name: response.data.group_name,
        group_type: response.data.group_type,
        group_method: "week",
        group_value: response.data.group_value,
        group_install: response.data.group_install,
        group_members: response.data.group_members,
        group_duration: response.data.group_duration,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        minimum_bid: response.data.minimum_bid,
        maximum_bid: response.data.maximum_bid,
      });
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteGroup = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/group/delete-group/${currentGroup._id}`);
        alert("Group deleted successfully");
        setShowModalDelete(false);
        setCurrentGroup(null);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/group/update-group/${currentUpdateGroup._id}`,
        updateFormData
      );
      setShowModalUpdate(false);
      alert("Group Updated Successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  return (
    <>
      <div>
        <div className="flex mt-20">
          <Sidebar />
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-semibold">Weekly Groups</h1>
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <input
                  type="text"
                  placeholder="Search week groups..."
                  className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => setShowModal(true)}
                  className="ml-4 bg-blue-700 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                >
                  + Add Week Group
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredGroups.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500 text-lg">
                    No week groups added yet
                  </p>
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
                      <div className="flex gap-16 py-3">
                        <p className="text-gray-500 mb-2 text-center">
                          <span className="font-medium text-gray-700 text-xl">
                            {group.group_members}
                          </span>
                          <br />
                          <span className="font-bold text-sm">Members</span>
                        </p>
                        <p className="text-gray-500 mb-4 text-center">
                          <span className="font-medium text-gray-700 text-xl">
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
              )}
            </div>
          </div>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Add Week Group
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={formData.group_name}
                  onChange={handleChange}
                  id="name"
                  placeholder="Enter the Group Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
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
                  id="category"
                  value={formData.group_type}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Group Type</option>
                  <option value="divident">Divident Auction</option>
                </select>
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
                    value={formData.group_value}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Group Value"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Installment
                  </label>
                  <input
                    type="number"
                    name="group_install"
                    value={formData.group_install}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Group Installment"
                    required
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
                    Group Members
                  </label>
                  <input
                    type="number"
                    name="group_members"
                    value={formData.group_members}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Group Members"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
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
                    value={formData.group_duration}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Group Duration"
                    required
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
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    id="date"
                    placeholder="Enter the Date"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
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
                    value={formData.end_date}
                    onChange={handleChange}
                    id="date"
                    placeholder="Enter the Date"
                    required
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
                    Minimum Bid
                  </label>
                  <input
                    type="number"
                    name="minimum_bid"
                    value={formData.minimum_bid}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Minimum Bid"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Maximum Bid
                  </label>
                  <input
                    type="number"
                    name="maximum_bid"
                    value={formData.maximum_bid}
                    onChange={handleChange}
                    id="text"
                    placeholder="Enter Maximum Bid"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800
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
              Update Week Group
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate}>
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
                  <option value="divident">Dividend Auction</option>
                </select>
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
                    type="text"
                    name="group_value"
                    value={updateFormData.group_value}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Value"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Installment
                  </label>
                  <input
                    type="text"
                    name="group_install"
                    value={updateFormData.group_install}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Installment"
                    required
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
                    Group Members
                  </label>
                  <input
                    type="text"
                    name="group_members"
                    value={updateFormData.group_members}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Members"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Group Duration
                  </label>
                  <input
                    type="text"
                    name="group_duration"
                    value={updateFormData.group_duration}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Group Duration"
                    required
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
                    type="text"
                    name="minimum_bid"
                    value={updateFormData.minimum_bid}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Minimum Bid"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Maximum Bid %
                  </label>
                  <input
                    type="text"
                    name="maximum_bid"
                    value={updateFormData.maximum_bid}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Maximum Bid"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
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
              Delete Week Group
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

export default WeekGroup;
