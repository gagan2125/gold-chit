import React, { useEffect, useState } from "react";
import { Select } from "antd";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";

const EmployeeReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [employeeCustomerData, setEmployeeCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/agent/get-agent");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchEmployeeReport = async (employeeId) => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/agent/getemployeereport?agentId=${employeeId}`
      );
      setEmployeeCustomerData(res.data);
    } catch (err) {
      console.error("Error fetching employee report:", err);
      setEmployeeCustomerData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (value) => {
    setSelectedEmployeeId(value);
    const selectedEmp = employees.find((emp) => emp._id === value);
    setSelectedEmployeeDetails(selectedEmp || null);
    fetchEmployeeReport(value);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalCommission = employeeCustomerData.reduce(
    (acc, curr) =>
      acc + parseFloat(curr.commissionValue?.replace(/,/g, "") || 0),
    0
  );

  const totalBusiness = employeeCustomerData.reduce(
    (acc, curr) => acc + parseFloat(curr.groupValue || 0),
    0
  );

  const totalCustomers = employeeCustomerData.length;

  const processedTableData = employeeCustomerData.map((item, index) => ({
    ...item,
    enrollmentStartDate:item?.enrollmentStartDate?.split("T")[0],
    sl_no: index + 1,
  }));

  const columns = [
    { key: "sl_no", header: "SL. NO" },
    { key: "customerName", header: "Customer Name" },
    { key: "customerId", header: "Customer ID" },
    { key: "userPhone", header: "Phone Number" },
    { key: "groupName", header: "Group" },
    { key: "groupValue", header: "Group Value" },
    {
      key: "enrollmentStartDate",
      header: "Enrollment Start Date",
    },
    { key: "ticket", header: "Ticket" },
    { key: "amountPaid", header: "Amount Paid" },
    { key: "toBePaidAmount", header: "To Be Paid" },
    { key: "balance", header: "Balance" },
    { key: "commissionPercent", header: "Commission (%)" },
    { key: "commissionValue", header: "Commission (₹)" },
    { key: "incentives", header: "Incentives" },
  ];

  return (
    <div className="w-screen min-h-screen">
      <div className="flex mt-20">
        <Navbar
         
          visibility={true}
        />
        
        <div className="flex-grow p-7">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Reports - Employee
          </h1>

          <div className="mt-6 mb-8">
            <div className="flex justify-center items-center w-full gap-4 bg-blue-50 rounded-md shadow-md p-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select Employee
                </label>
                <Select
                  value={selectedEmployeeId || undefined}
                  onChange={handleEmployeeChange}
                  showSearch
                  popupMatchSelectWidth={false}
                  placeholder="Search or Select Employee"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ height: "50px", width: "400px" }}
                >
                  {employees.map((emp) => (
                    <Select.Option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="ml-6 text-md font-semibold text-blue-700">
                Total Business: ₹
                {totalBusiness.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* Employee Info */}
          {selectedEmployeeDetails && (
            <div className="mb-8 bg-gray-50 rounded-md shadow-md p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">Name</label>
                  <input
                    value={selectedEmployeeDetails.name || "-"}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-white"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">Email</label>
                  <input
                    value={selectedEmployeeDetails.email || "-"}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-white"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    value={selectedEmployeeDetails.phone_number || "-"}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">
                    Adhaar Number
                  </label>
                  <input
                    value={selectedEmployeeDetails.adhaar_no || "-"}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-white"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">PAN Number</label>
                  <input
                    value={selectedEmployeeDetails.pan_no || "-"}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-white"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-sm font-medium mb-1">Pincode</label>
                  <input
                    value={selectedEmployeeDetails.pincode || "-"}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 bg-white"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Address</label>
                <input
                  value={selectedEmployeeDetails.address || "-"}
                  readOnly
                  className="border border-gray-300 rounded px-4 py-2 bg-white"
                />
              </div>
            </div>
          )}

          {/* Table Section */}
          {loading ? (
            <CircularLoader isLoading={true} />
          ) : employeeCustomerData.length > 0 ? (
            <>
              <DataTable
                data={processedTableData}
                columns={columns}
                exportedFileName={`EmployeeReport-${selectedEmployeeId}.csv`}
              />

              <div className="mt-6 pr-10 text-right flex justify-end gap-12">
                <div className="text-lg font-semibold text-green-700">
                  Total Commission: ₹
                  {totalCommission.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="text-lg font-semibold text-green-700">
                  Total Customers: {totalCustomers}
                </div>
              </div>
            </>
          ) : (
            selectedEmployeeId && (
              <p>No data found for the selected employee.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;
