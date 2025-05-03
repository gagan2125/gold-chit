/* eslint-disable react/prop-types */
import * as XLSX from "xlsx";

const UploadModal = ({ show, onClose, onSubmit, groups, selectedGroupId, handleGroup, handleChangeUser, formData, filteredAuction }) => {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const downloadExcel = () => {
    const data = [
      { payment_date: "", old_receipt_number: "", payment_type: "", amount: "" }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "payment-upload.xlsx");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upload Payment</h2>
          <button
            onClick={downloadExcel}
            className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
          >
            Download Excel
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="flex justify-between mb-4">
            <select
              name="selectOption1"
              value={selectedGroupId}
              onChange={handleGroup}
              required
              className="w-full border border-gray-300 rounded-md p-2 mr-2"
            >
              <option value="" disabled selected>
                Select Customer
              </option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between mb-4">
            <select
              name="group_id"
              value={`${formData.group_id}|${formData.ticket}`}
              onChange={handleChangeUser}
              required
              className="w-full border border-gray-300 rounded-md p-2 mr-2"
            >
              <option value="">Select Group | Ticket</option>
              {filteredAuction.map((group) => {
                if (!group.enrollment.group) return null;

                return (
                  <option
                    key={group.enrollment.group._id}
                    value={`${group.enrollment.group._id}|${group.enrollment.tickets}`}
                  >
                    {group.enrollment.group.group_name} | {group.enrollment.tickets}
                  </option>
                );
              })}
            </select>
          </div>
          <input
            type="file"
            name="file"
            accept=".xlsx, .xls"
            required
            className="block w-full border border-gray-300 rounded-md mb-4 p-2"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded shadow-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default UploadModal;
