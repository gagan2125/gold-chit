/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import { FaWhatsappSquare } from "react-icons/fa";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import { Select } from "antd";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";
const Enroll = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [TableEnrolls, setTableEnrolls] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [availableTicketsAdd, setAvailableTicketsAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDataTableLoading, setIsDataTableLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allEnrollUrl, setAllEnrollUrl] = useState(true);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const whatsappEnable = true;
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const [formData, setFormData] = useState({
    group_id: "",
    user_id: "",
    no_of_tickets: "",
    referred_type: "",
    payment_type: "",
    referred_customer: "",
    agent: "",
    referred_lead: "",
  });

  const [updateFormData, setUpdateFormData] = useState({
    group_id: "",
    user_id: "",
    tickets: "",
    payment_type: "",
    referred_type: "",
    referred_customer: "",
    agent: "",
    referred_lead: "",
  });
  const [searchText, setSearchText] = useState("");
  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
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
  useEffect(() => {
    async function fetchAllEnrollmentData() {
      setAllEnrollUrl(true);
      let url = `/enroll/get-enroll`;
      try {
        setTableEnrolls([]);
        setIsDataTableLoading(true);
        const response = await api.get(url);
        console.info(response.data, "response data");
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
          const formattedData = response.data.map((group, index) => {
            if (!group?.group_id || !group?.user_id) return {};
            return {
              _id: group?._id,
              id: index + 1,
              name: group?.user_id?.full_name,
              phone_number: group?.user_id?.phone_number,
              group_name: group?.group_id?.group_name,
              payment_type: group?.payment_type,
              referred_type: group?.referred_type,
              referred_agent: group?.agent?.name,
              referred_customer: group?.referred_customer?.full_name,
              referred_lead: group?.referred_lead?.lead_name,
              ticket: group.tickets,
              action: (
                <div className="flex justify-center items-center gap-2">
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
            };
          });
          setTableEnrolls(formattedData);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredUsers([]);
        setTableEnrolls([]);
      } finally {
        setIsDataTableLoading(false);
      }
    }
    fetchAllEnrollmentData();
  }, []);

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
        // console.info(response.data,"agents")
      } catch (err) {
        console.error("Failed to fetch Leads", err);
      }
    };
    fetchAgents();
  }, []);
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get("/lead/get-lead");
        setLeads(response.data);
        // console.info(response.data,"leads data")
      } catch (err) {
        console.error("Failed to fetch Leads", err);
      }
    };
    fetchLeads();
  }, []);

  const handleGroupChange = async (groupId) => {
    setSelectedGroup(groupId);

    if (groupId) {
      let url;
      if (groupId === "all") {
        url = `/enroll/get-enroll`;
        setAllEnrollUrl(true);
      } else {
        url = `/enroll/get-group-enroll/${groupId}`;
        setAllEnrollUrl(false);
      }

      try {
        setTableEnrolls([]);
        setIsDataTableLoading(true);
        const response = await api.get(url);
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);
          const formattedData = response.data.map((group, index) => {
            if (!group?.group_id || !group?.user_id) return {};
            return {
              _id: group?._id,
              id: index + 1,
              name: group?.user_id?.full_name,
              phone_number: group?.user_id?.phone_number,
              group_name: group?.group_id?.group_name,
              payment_type: group?.payment_type,
              referred_type: group?.referred_type,
              referred_agent: group?.agent?.name,
              referred_customer: group?.referred_customer?.full_name,
              referred_lead: group?.referred_lead?.lead_name,
              ticket: group.tickets,
              action: (
                <div className="flex justify-center items-center gap-2">
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
            };
          });
          setTableEnrolls(formattedData);
        } else {
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        setFilteredUsers([]);
        setTableEnrolls([]);
      } finally {
        setIsDataTableLoading(false);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
  ];
  if (allEnrollUrl) {
    columns.push({ key: "group_name", header: "Enrolled Group" });
  }
  columns.push(
    { key: "ticket", header: "Ticket Number" },
    { key: "referred_type", header: "Referred Type" },
    { key: "payment_type", header: "Payment Type" },
    { key: "referred_agent", header: "Referred Employee | ID" },
    { key: "referred_customer", header: "Referred Customer | ID" },
    { key: "referred_lead", header: "Referred Lead | ID" },
    { key: "action", header: "Action" }
  );

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    if (name === "group_id") {
      try {
        const response = await api.post(`/enroll/get-next-tickets/${value}`);
        setAvailableTicketsAdd(response.data.availableTickets || []);
        console.log("Next tickets:", response.data.availableTickets);
      } catch (error) {
        console.error("Error fetching next tickets:", error);
      }
    }
  };
  const validate = (type) => {
    const newErrors = {};
    const data = type === "addEnrollment" ? formData : updateFormData;
    const noOfTickets = type === "addEnrollment" ? "no_of_tickets" : "tickets";
    if (!data.group_id.trim()) {
      newErrors.group_id = "Please select a group";
    }
    if (!data.user_id) {
      newErrors.user_id = "Please select a customer";
    }

    if (availableTicketsAdd.length > 0) {
      if (
        !data[noOfTickets] ||
        data[noOfTickets] <= 0 ||
        isNaN(data[noOfTickets])
      ) {
        newErrors[noOfTickets] = "Please enter number of tickets";
      } else if (data[noOfTickets] > availableTicketsAdd.length) {
        newErrors[
          noOfTickets
        ] = `Maximum ${availableTicketsAdd.length} tickets allowed`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isvalid = validate("addEnrollment");
    if (isvalid) {
      setLoading(true);
      const {
        no_of_tickets,
        group_id,
        user_id,
        payment_type,
        referred_customer,
        referred_type,
        agent,
        referred_lead,
      } = formData;
      const ticketsCount = parseInt(no_of_tickets, 10);
      const ticketEntries = availableTicketsAdd
        .slice(0, ticketsCount)
        .map((ticketNumber) => ({
          group_id,
          user_id,
          no_of_tickets,
          payment_type,
          referred_customer,
          agent,
          referred_lead,
          referred_type,
          tickets: ticketNumber,
        }));
      console.log(ticketEntries);

      try {
        for (const ticketEntry of ticketEntries) {
          console.log("ticket");
          await api.post("/enroll/add-enroll", ticketEntry, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        setShowModal(false);
        setFormData({
          group_id: "",
          user_id: "",
          no_of_tickets: "",
          referred_type: "",
          payment_type: "",
          referred_customer: "",
          agent: "",
          referred_lead: "",
        });
        setAlertConfig({
          visibility: true,
          message: "User Enrolled Successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error enrolling user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateModalOpen = async (enrollId) => {
    try {
      const response = await api.get(`/enroll/get-enroll-by-id/${enrollId}`);
      setCurrentUpdateGroup(response.data);
      setUpdateFormData({
        group_id: response.data?.group_id?._id,
        user_id: response.data?.user_id?._id,
        tickets: response.data?.tickets,
        payment_type: response.data?.payment_type,
        referred_customer: response.data?.referred_customer,
        agent: response.data?.agent,
        referred_lead: response.data?.referred_lead,
        referred_type:response.data?.referred_type
      });
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching enrollment:", error);
    }
  };

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/enroll/get-enroll-by-id/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching enroll:", error);
    }
  };

  const handleDeleteGroup = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/enroll/delete-enroll/${currentGroup._id}`);

        setShowModalDelete(false);
        setCurrentGroup(null);
        setAlertConfig({
          visibility: true,
          message: "Enroll deleted successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/enroll/update-enroll/${currentUpdateGroup._id}`,
        updateFormData
      );
      setShowModalUpdate(false);

      setAlertConfig({
        visibility: true,
        message: "Enrollment Updated Successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating enroll:", error);
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      api
        .post(`/enroll/get-next-tickets/${selectedGroup}`)
        .then((response) => {
          setAvailableTickets(response.data.availableTickets || []);
        })
        .catch((error) => {
          console.error("Error fetching available tickets:", error);
        });
    } else {
      setAvailableTickets([]);
    }
  }, [selectedGroup]);

  return (
    <>
      <div>
        <div className="flex mt-20">
          <Navbar
            onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
            visibility={true}
          />
          <Sidebar />
          <CustomAlert
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
          />
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-semibold">Enrollments</h1>
            <div className="mt-6 mb-8">
              <div className="mb-2">
                <label>Search or Select Group</label>
              </div>
              <div className="flex justify-between items-center w-full">
                <Select
                  showSearch
                  popupMatchSelectWidth={false}
                  value={selectedGroup || "all"}
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="Search or Select Group"
                  onChange={handleGroupChange}
                  className="border   w-full max-w-md"
                >
                  <Select.Option key={"$1"} value={"all"}>
                    All Customers Enrollments
                  </Select.Option>
                  {groups.map((group) => (
                    <Select.Option key={group._id} value={group._id}>
                      {group.group_name}
                    </Select.Option>
                  ))}
                </Select>
                <button
                  onClick={() => setShowModal(true)}
                  className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                >
                  + Add Enrollment
                </button>
              </div>
            </div>
            {TableEnrolls?.length > 0 ? (
              <DataTable
                updateHandler={handleUpdateModalOpen}
                data={filterOption(TableEnrolls, searchText)}
                columns={columns}
                exportedFileName={`Enrollments-${
                  TableEnrolls.length > 0
                    ? TableEnrolls[0].name +
                      " to " +
                      TableEnrolls[TableEnrolls.length - 1].name
                    : "empty"
                }.csv`}
              />
            ) : (
              <CircularLoader
                isLoading={isDataTableLoading}
                failure={TableEnrolls?.length <= 0 && selectedGroup}
                data={"Enrollment Data"}
              />
            )}
          </div>
        </div>
        <Modal
          isVisible={showModal}
          onClose={() => {
            setShowModal(false);
            setErrors({});
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Add Enrollment
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="category"
                >
                  Group <span className="text-red-500 ">*</span>
                </label>
                <select
                  name="group_id"
                  id="group_id"
                  value={formData.group_id}
                  onChange={handleChange}
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
                {errors.group_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.group_id}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="category"
                >
                  Customer <span className="text-red-500 ">*</span>
                </label>
                <select
                  name="user_id"
                  id="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
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

                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="payment_type"
                >
                  Select Payment Type <span className="text-red-500 ">*</span>
                </label>

                <select
                  value={formData.payment_type}
                  onChange={handleChange}
                  name="payment_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                <option value={""}>Select Payment Type</option>

                  {["Daily", "Weekely", "Monthly"].map((pType) => (
                    <option value={pType}>{pType}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="referred_type"
                >
                  Select Referred Type <span className="text-red-500 ">*</span>
                </label>
                <select
                  name="referred_type"
                  value={formData.referred_type}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                   <option value={""}>Select Referred Type</option>
                  {[
                    "Self Joining",
                    "Customer",
                    "Employee",
                    "Leads",
                    "Others",
                  ].map((refType) => (
                    <option value={refType}>{refType}</option>
                  ))}
                </select>
              </div>

              {formData.referred_type === "Customer" && (
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Select Referred Customer <span className="text-red-500 ">*</span> 
                  </label> 
                  <select
                    onChange={handleChange}
                    name="referred_customer"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                <option value={""}>Select Referred Customer</option>

                    {users.map((user) => (
                      <option value={user._id}>{user?.full_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {formData.referred_type === "Leads" && (
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Select Referred Leads <span className="text-red-500 ">*</span>
                  </label>
                  <select
                    onChange={handleChange}
                    name="referred_lead"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                <option value={""}>Select Referred Lead </option> 

                    {leads.map((lead) => (
                      <option value={lead._id}>{lead?.lead_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {formData.referred_type === "Employee" && (
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Select Referred Employee <span className="text-red-500 ">*</span>
                  </label>
                  <select
                    onChange={handleChange}
                    name="agent"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                <option value={""}>Select Referred Employee</option>

                    {agents.map((agent) => (
                      <option value={agent._id}>{agent?.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {formData.group_id && availableTicketsAdd.length === 0 ? (
                <>
                  <p className="text-center text-red-600">Group is Full</p>
                </>
              ) : formData.group_id && availableTicketsAdd.length !== 0 ? (
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Number of Tickets  <span className="text-red-500 ">*</span>
                  </label>
                  <input
                    type="number"
                    name="no_of_tickets"
                    value={formData.no_of_tickets}
                    id="name"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="Enter the Number of Tickets"
                    required
                    max={availableTicketsAdd.length}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />

                  {errors.no_of_tickets && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.no_of_tickets}
                    </p>
                  )}
                  <span className="mt-10 flex items-center justify-center text-sm text-blue-900">
                    Only {availableTicketsAdd.length} tickets left
                  </span>
                </div>
              ) : (
                <p className="text-center text-red-600"></p>
              )}

              <div className="flex flex-col items-center p-4 max-w-full bg-white rounded-lg shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <FaWhatsappSquare color="green" className="w-10 h-10" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    WhatsApp
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={whatsappEnable}
                    className="text-green-500 checked:ring-2  checked:ring-green-700  rounded-full w-4 h-4"
                  />
                  <span className="text-gray-700">Send Via Whatsapp</span>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  disabled={loading || availableTicketsAdd.length === 0}
                  className={`w-1/4 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 border-2 border-black"
                  }`}
                >
                  {loading ? (
                    <>
                      <p>Loading...</p>
                    </>
                  ) : (
                    <>Save Enrollment</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalUpdate}
          onClose={() => {
            setShowModalUpdate(false);
            setErrors({});
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Update Enrollment
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate}>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="group_id"
                >
                  Group
                </label>
                <select
                  name="group_id"
                  id="group_id"
                  value={updateFormData.group_id}
                  onChange={handleInputChange}
                  required
                  disabled
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
                  htmlFor="user_id"
                >
                  Customer
                </label>
                <select
                  name="user_id"
                  id="user_id"
                  value={updateFormData.user_id}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Customer</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="payment_type"
                >
                  Select Payment Type
                </label>

                <select
                  value={updateFormData.payment_type}
                  onChange={handleInputChange}
                  name="payment_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                <option value={""}>Select Payment Type</option>

                  {["Daily", "Weekely", "Monthly"].map((pType) => (
                    <option value={pType}>{pType}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="referred_type"
                >
                  Select Referred Type
                </label>
                <select
                  name="referred_type"
                  value={updateFormData.referred_type}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                   <option value={""}>Select Referred Type</option>
                  {[
                    "Self Joining",
                    "Customer",
                    "Employee",
                    "Leads",
                    "Others",
                  ].map((refType) => (
                    <option value={refType}>{refType}</option>
                  ))}
                </select>
              </div>

              {updateFormData.referred_type === "Customer" && (
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Select Referred Customer
                  </label>
                  <select
                    onChange={handleInputChange}
                    value={updateFormData.referred_customer}
                    name="referred_customer"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                <option value={""}>Select Referred Customer</option>

                    {users.map((user) => (
                      <option value={user._id}>{user?.full_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {updateFormData.referred_type === "Leads" && (
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Select Referred Leads
                  </label>
                  <select
                    onChange={handleInputChange}
                    value={updateFormData.referred_lead}
                    name="referred_lead"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                <option value={""}>Select Referred Lead</option>

                    {leads.map((lead) => (
                      <option value={lead._id}>{lead?.lead_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {updateFormData.referred_type === "Employee" && (
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Select Referred Employee
                  </label>
                  <select
                    onChange={handleInputChange}
                    value={updateFormData.agent}
                    name="agent"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                <option value={""}>Select Referred Employee</option>

                    {agents.map((agent) => (
                      <option value={agent._id}>{agent?.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="no_of_tickets"
                >
                  Select Ticket
                </label>
                <select
                  name="tickets"
                  value={updateFormData.tickets}
                  onChange={handleInputChange}
                  id="no_of_tickets"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Ticket</option>
                  {availableTickets
                    .concat([updateFormData.tickets])
                    .map((ticket, index) => (
                      <option key={index} value={ticket}>
                        {ticket}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
              Sure want to remove this Enrollment ?
            </h3>
            {currentGroup && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteGroup();
                }}
                className="space-y-6"
              >
                <button
                  type="submit"
                  className="w-full text-white bg-red-700 hover:bg-red-800
          focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Remove
                </button>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Enroll;
