/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { MdDelete } from "react-icons/md";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import TabModal from "../components/modals/TabModal";
import { IoMdMore } from "react-icons/io";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import { Dropdown } from "antd";
const LeadReport = () => {
  const [groups, setGroups] = useState([]);
  const [TableGroups, setTableGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [selectiveGroups, setSelectiveGroups] = useState([]);
  const [loader, setLoader] = useState(false);
  const [secondaryLoader, setSecondaryLoader] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchText, setSearchText] = useState("");
  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
  };
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const handleGroupChange = async (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
  };

  const [formData, setFormData] = useState({
    lead_name: "",
    lead_phone: "",
    lead_profession: "",
    group_id: "",
    lead_type: "",
    lead_customer: "",
    lead_needs: "",
    note: "",
  });
  const [showContextMenu, setShowContextMenu] = useState({});
  const [updateFormData, setUpdateFormData] = useState({
    lead_name: "",
    lead_phone: "",
    lead_profession: "",
    group_id: "",
    lead_type: "",
    lead_customer: "",
    lead_agent: "",
    lead_needs: "",
    note: "",
  });
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [selectedLeadSourceName, setSelectedLeadSourceName] = useState("");
  const [selectedNote, setSelectedNote] = useState("");

  const validateForm = (type) => {
    const newErrors = {};
    const data = type === "addLead" ? formData : updateFormData;
    if (!data.lead_name.trim()) {
      newErrors.lead_name = "Lead Name is required";
    }

    if (!data.lead_phone) {
      newErrors.lead_phone = "Phone Number is required";
    } else if (!/^[6-9]\d{9}$/.test(data.lead_phone)) {
      newErrors.lead_phone = "Invalid phone number (must be 10 digits)";
    }

    if (!data.lead_profession) {
      newErrors.lead_profession = "Profession is required";
    }

    if (!data.lead_type) {
      newErrors.lead_type = "Lead Source Type is required";
    }

    if (data.lead_type === "customer" && !data.lead_customer) {
      newErrors.lead_customer = "Customer selection is required";
    }

    if (data.lead_type === "agent" && !data.lead_agent) {
      newErrors.lead_agent = "Agent selection is required";
    }
    if (!data.lead_needs.trim()) {
      newErrors.lead_needs = "Lead Needs and Goals is required";
    }
    // if(!data.note.trim()){
    //   newErrors.note ="Note Field is Mandatory"
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");

        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);
  const onContextMenuPressed = (id) => {
    setShowContextMenu((prev) => ({ ...prev, [id]: true }));
    console.log(showContextMenu);
  };
  useEffect(() => {
    const fetchLeads = async () => {
      setLoader(true);
      try {
        const response = await api.get("/lead/get-lead");
        setLoader(false);
        const tempData = {};
        if (response.data) {
          //   response.data.forEach((element) => {
          //     tempData[element.group_id._id] = false;
          //   });
          setShowContextMenu(tempData);
          setLeads(response.data);
          console.log("this is leads", leads);
          const formattedData = response.data.map((group, index) => ({
            _id: group._id,
            id: index + 1,
            name: group.lead_name,
            phone: group.lead_phone,
            profession: group.lead_profession,
            lead_needs: group?.lead_needs,
            group_id: group?.group_id?.group_name,
            date: group?.createdAt.split("T")[0],
            lead_type:
              group.lead_type === "agent" ? "employee" : group.lead_type,
            note: group?.note,
            lead_type_name:
              group.lead_type === "customer"
                ? group?.lead_customer?.full_name
                : group.lead_type === "agent"
                ? group?.lead_agent?.name
                : "",
            action: (
              <div className="flex justify-center gap-2 ">
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
          }));
          setTableGroups(formattedData);
        }
      } catch (error) {
        setLoader(true);
        console.error("Error fetching group data:", error);
      }
    };
    fetchLeads();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/lead/get-lead-by-id/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching lead:", error);
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/lead/get-lead-by-id/${groupId}`);
      console.log("The response data is ", response.data);
      const groupData = response.data;
      //const formattedStartDate = groupData.start_date.split("T")[0];
      //  const formattedEndDate = groupData.end_date.split("T")[0];
      setCurrentUpdateGroup(response.data);
      setUpdateFormData({
        lead_name: response.data.lead_name,
        lead_phone: response.data.lead_phone,
        lead_profession: response.data.lead_profession,
        group_id: response.data.group_id,
        lead_type: response.data.lead_type,
        lead_customer: response.data.lead_customer,
        lead_agent: response.data.lead_agent,
        lead_needs: response.data?.lead_needs,
        note: response.data.note,
      });
      setShowModalUpdate(true);
      setErrors({});
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
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleDeleteGroup = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/lead/delete-lead/${currentGroup._id}`);
        setShowModalDelete(false);
        setCurrentGroup(null);

        setAlertConfig({
          visibility: true,
          message: "Lead deleted successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    try {
      if (isValid) {
        await api.put(
          `/lead/update-lead/${currentUpdateGroup._id}`,
          updateFormData
        );
        setShowModalUpdate(false);
        setAlertConfig({
          visibility: true,
          message: "Lead Updated Successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Lead Name" },
    { key: "phone", header: "Lead Phone Number" },
    { key: "profession", header: "Lead Profession" },
    { key: "date", header: "Date" },
    { key: "group_id", header: "Group Name" },
    { key: "lead_type", header: "Lead Source Type" },
    { key: "lead_needs", header: "Lead Needs And Goals" },
    { key: "lead_type_name", header: "Lead Source Name" },
    { key: "note", header: "Note" },
    { key: "action", header: "Action" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get-user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get-agent");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };
    fetchAgents();
  }, []);
  useEffect(() => {
    const fetchFilteredLead = async () => {
      setLoader(true);
      try {
        const response = await api.get("/lead-report/get-lead-report", {
          params: {
            from_date: selectedFromDate,
            to_date: selectedToDate,
            lead_source_name: selectedLeadSourceName,
            group_id: selectedGroup,
            note: selectedNote,
          },
        });
        setLoader(false);

        const formattedData = response.data.map((group, index) => ({
          _id: group._id,
          id: index + 1,
          name: group.lead_name,
          phone: group.lead_phone,
          profession: group.lead_profession,
          lead_needs: group?.lead_needs,
          group_id: group?.group_id?.group_name,
          date: group?.createdAt.split("T")[0],
          lead_type: group.lead_type === "agent" ? "employee" : group.lead_type,
          note: group?.note,
          lead_type_name:
            group.lead_type === "customer"
              ? group?.lead_customer?.full_name
              : group.lead_type === "agent"
              ? group?.lead_agent?.name
              : "",
          action: (
            <div className="flex justify-center gap-2 relative">
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
        }));
        setTableGroups(formattedData);
      } catch (err) {
        console.error("Failed to fetch Data", err.message);
        setLoader(true);
      }
    };

    fetchFilteredLead();
  }, [
    selectedFromDate,
    selectedToDate,
    selectedLeadSourceName,
    selectedGroup,
    selectedNote,
  ]);

  return (
    <div className="w-full">
      <div>
        <Navbar
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
          visibility={true}
        />
        <div className=" flex mt-20">
          <CustomAlert
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
          />
          <div className="flex-grow p-7">
            <h1 className="font-bold text-2xl">Lead Report</h1>
            <div className="mt-6 mb-8">
              <div className="mb-2">
                <div className="flex justify-start items-center w-full gap-4">
                  <div className="mb-2">
                    <label>From Date</label>
                    <input
                      type="date"
                      value={selectedFromDate}
                      onChange={(e) => setSelectedFromDate(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
                    />
                  </div>
                  <div className="mb-2">
                    <label>To Date</label>
                    <input
                      type="date"
                      value={selectedToDate}
                      onChange={(e) => setSelectedToDate(e.target.value)}
                      className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Group</label>
                    <select
                      value={selectedGroup}
                      onChange={handleGroupChange}
                      className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="">Select Group</option>
                      {filteredGroups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.group_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Lead Source Name</label>
                    <select
                      value={selectedLeadSourceName}
                      onChange={(e) =>
                        setSelectedLeadSourceName(e.target.value)
                      }
                      className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="">Select Lead Name</option>
                      {leads
                        .filter(
                          (lead) => lead?.lead_agent || lead?.lead_customer
                        )
                        .map((lead) => {
                          console.log("this is lead", lead);
                          return (
                            <option
                              key={lead?._id}
                              value={
                                lead?.lead_agent?._id ||
                                lead?.lead_customer?._id
                              }
                            >
                              {lead?.lead_agent?.name ||
                                lead?.lead_customer?.full_name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Note</label>
                    <select
                      value={selectedNote}
                      onChange={(e) => setSelectedNote(e.target.value)}
                      className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="">Select Note</option>
                      {leads
                        .filter((lead) => lead?.note)
                        .map((lead) => (
                          <option key={lead?._id} value={lead?.note}>
                            {lead.note}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {loader ? (
              <div className="flex w-full justify-center items-center">
                <CircularLoader />;
              </div>
            ) : (
              <DataTable
                updateHandler={handleUpdateModalOpen}
                data={filterOption(TableGroups, searchText)}
                columns={columns}
                exportedFileName={`Leads-${
                  TableGroups.length > 0
                    ? TableGroups[0].date +
                      " to " +
                      TableGroups[TableGroups.length - 1].date
                    : "empty"
                }.csv`}
              />
            )}

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

        <Modal
          isVisible={showModalUpdate}
          onClose={() => {
            setShowModalUpdate(false);
            setErrors({});
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Update Lead
            </h3>

            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Lead Name
                </label>
                <input
                  type="text"
                  name="lead_name"
                  value={updateFormData.lead_name}
                  onChange={handleInputChange}
                  id="name"
                  placeholder="Enter the Group Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                {errors.lead_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lead_name}
                  </p>
                )}
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Lead Phone Number
                  </label>
                  <input
                    type="text"
                    name="lead_phone"
                    value={updateFormData.lead_phone}
                    onChange={handleInputChange}
                    id="text"
                    placeholder="Enter Lead Phone Number"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                  {errors.lead_phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lead_phone}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="date"
                  >
                    Lead Work/Profession
                  </label>
                  <select
                    name="lead_profession"
                    id="category"
                    value={updateFormData.lead_profession}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                    <option value="">Select Work/Profession</option>
                    <option value="employed">Employed</option>
                    <option value="self_employed">Self Employed</option>
                  </select>
                  {errors.lead_profession && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lead_profession}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="category"
                >
                  Group
                </label>
                <select
                  name="group_id"
                  id="category"
                  value={updateFormData.group_id}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="category"
                >
                  Lead Source Type
                </label>
                <select
                  name="lead_type"
                  id="category"
                  value={updateFormData.lead_type}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Lead Source Type</option>
                  <option value="social">Social Media</option>
                  <option value="customer">Customer</option>
                  <option value="agent">Employee</option>
                  <option value="walkin">Walkin</option>
                </select>
                {errors.lead_type && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lead_type}
                  </p>
                )}
              </div>
              {updateFormData.lead_type === "customer" && (
                <>
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="category"
                    >
                      Customers
                    </label>
                    <select
                      name="lead_customer"
                      id="category"
                      value={updateFormData.lead_customer}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    >
                      <option value="">Select Customer</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.full_name}
                        </option>
                      ))}
                    </select>
                    {errors.lead_customer && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lead_customer}
                      </p>
                    )}
                  </div>
                </>
              )}{" "}
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="date"
              >
                Note
              </label>
              <input
                type="text"
                name="note"
                value={updateFormData.note}
                onChange={handleInputChange}
                id="text"
                placeholder="Specify note if any!"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              />
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="category"
                >
                  Lead Needs and Goals
                </label>
                <select
                  name="lead_needs"
                  id="category"
                  value={updateFormData.lead_needs}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Lead Needs and Goals</option>
                  <option value="savings">Savings</option>
                  <option value="borrowings">Borrowings</option>
                </select>
                {errors.lead_needs && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lead_needs}
                  </p>
                )}
              </div>
              {updateFormData.lead_type === "agent" && (
                <>
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="category"
                    >
                      Agents
                    </label>
                    <select
                      name="lead_agent"
                      id="category"
                      value={updateFormData.lead_agent}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    >
                      <option value="">Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                    {errors.lead_agent && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lead_agent}
                      </p>
                    )}
                  </div>
                </>
              )}
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
              Delete Lead
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
                      {currentGroup.lead_name}
                    </span>{" "}
                    to confirm deletion.
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    placeholder="Enter the Lead Name"
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
    </div>
  );
};

export default LeadReport;
