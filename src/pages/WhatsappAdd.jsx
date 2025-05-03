/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import { FaWhatsapp } from "react-icons/fa";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import whatsappApi from "../instance/WhatsappInstance";

const WhatsappAdd = () => {
  const [users, setUsers] = useState([]);
  const [TableUsers, setTableUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const [selectUser, setSelectUser] = useState({});
  const [customerCount, setCustomerCount] = useState(0);
  const [selectAll, setSelectAll] = useState({ msg: "No", checked: false });
  const [formData, setFormData] = useState({ template_name: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.template_name.trim()) {
      newErrors.template_name = "Template name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (!isValid) return;

    try {
      setDisabled(true);
      const response = await whatsappApi.post("/marketing", {
        selectUser,
        template_name: formData.template_name,
      });

      if (response.status === 201) {
        setAlertConfig({
          type: "success",
          message: "Whatsapped Successfully",
          visibility: true,
        });
      } else {
        setAlertConfig({
          type: "error",
          message: "Whatsapp Failure",
          visibility: true,
        });
      }

      setShowModal(false);
      setFormData({ template_name: "" });
      setErrors({});
      setDisabled(false);
    } catch (err) {
      console.error("whatsapp error", err.message);
      setAlertConfig({
        type: "error",
        message: "Whatsapp Failure",
        visibility: true,
      });
      setDisabled(false);
    }
  };

  const handleSelectAll = () => {
    const checked = !selectAll.checked;
    const updatedUsers = {};
    Object.keys(selectUser).forEach((userId) => {
      updatedUsers[userId] = checked;
    });
    setSelectUser(updatedUsers);
    setSelectAll({ msg: checked ? "All" : "No", checked });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/get-user");
        setUsers(res.data);

        const initialSelection = {};
        res.data.forEach((user) => {
          initialSelection[user._id] = false;
        });

        setSelectUser(initialSelection);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const formatted = users.map((user, index) => ({
      id: index + 1,
      name: user.full_name,
      phone_number: user.phone_number,
      customer_id: user.customer_id || "Updating soon...",
      action: (
        <div key={user._id} className="flex justify-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectUser[user._id] ?? false}
              onChange={() =>
                setSelectUser((prev) => ({
                  ...prev,
                  [user._id]: !prev[user._id],
                }))
              }
              className="form-checkbox h-5 w-5 text-green-500 rounded transition-all duration-150"
            />
          </label>
        </div>
      ),
    }));
    setTableUsers(formatted);
  }, [selectUser]);

  useEffect(() => {
    const count = Object.values(selectUser).filter((v) => v).length;
    setCustomerCount(count);
  }, [selectUser]);

  const columns = [
    { key: "action", header: "Action" },
    { key: "id", header: "SL. NO" },
    { key: "customer_id", header: "Customer Id" },
    { key: "name", header: "Customer Name" },
    { key: "phone_number", header: "Customer Phone Number" },
  ];

  return (
    <div className="w-screen">
      <div className="flex mt-20 px-6 lg:px-12">
        <CustomAlert
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
        />
        <div className="flex-grow p-6">
          <div className="mb-8">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <div className="flex items-center mb-2">
                  <FaWhatsapp color="green" size={28} className="mr-2" />
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Whatsapp Customers
                  </h1>
                </div>
                <div
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-green-600"
                >
                  <input
                    type="checkbox"
                    checked={selectAll.checked}
                    className="h-4 w-4 text-green-600 rounded"
                  />
                  <span className="font-medium">{`Select ${selectAll.msg} Customers`}</span>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="relative mt-4 lg:mt-0 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-lg transition-all duration-200 ease-in-out"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaWhatsapp />
                  <span>Whatsapp</span>
                  {customerCount > 0 && (
                    <div
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-xs text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md animate-bounce"
                      title={`Selected ${customerCount} customer(s)`}
                    >
                      {customerCount}
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          <DataTable
            isExportEnabled={false}
            data={TableUsers}
            columns={columns}
            exportedFileName={`Customers-${
              TableUsers.length > 0
                ? TableUsers[0].name + " to " + TableUsers[TableUsers.length - 1].name
                : "empty"
            }.csv`}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="py-6 px-5 text-left">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">Send Message</h3>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="template_name"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Template Name
              </label>
              <input
                type="text"
                id="template_name"
                name="template_name"
                value={formData.template_name}
                onChange={handleChange}
                placeholder="Paste template name"
                required
                className="w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 border-gray-300"
              />
              {errors.template_name && (
                <p className="mt-1 text-sm text-red-600">{errors.template_name}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={disabled}
              className={`w-full text-white font-medium text-sm px-5 py-2.5 rounded-md transition duration-300 ${
                disabled
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Send
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default WhatsappAdd;
