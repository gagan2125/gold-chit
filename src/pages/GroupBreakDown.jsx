
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";

const GroupBreakDown = () => {
  const [groups, setGroups] = useState([]);
  const [group_id, setGroup_id] = useState("");
  const [TableGroups, setTableGroups] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [auctionBreakModal, setAuctionBreakModal] = useState(false);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [entries, setEntries] = useState([]);
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

  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
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
          type: group.group_type,
          value: group.group_value,
          installment: group.group_install,
          members: group.group_members,
          action: (
            <div className="flex justify-center gap-2">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div onClick={() => handleUpdateModalOpen(group._id)}>
                          Manage
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
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  const fetchBreakdown = async (groupId) => {
    try {
      setEntries([]);
      const response = await api.get(`/group/get-by-id-group-auction/${groupId}`);
      if (response.data.length > 0) {
        const entriesWithSlNo = response.data.map((entry, index) => ({
          ...entry,
          slNo: index + 1,
        }));
        setEntries(entriesWithSlNo);
      } else {
        generateDefaultEntries();
      }
    } catch (error) {
      console.error("Error fetching group auction breakdown:", error);
      generateDefaultEntries();
    }
  };
  
  

  const generateDefaultEntries = () => {
    if (updateFormData.group_members) {
      const initialEntries = Array.from({ length: updateFormData.group_members }, (_, index) => ({
        slNo: index + 1,
        auctionDate: '',
        bidAmount: '',
        bidPercentage: '',
        commission: '',
        winningAmount: '',
        dividend: '',
        dividendPerHead: ''
      }));
      setEntries(initialEntries);
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    setGroup_id(groupId);
    try {
      const response = await api.get(`/group/get-by-id-group/${groupId}`);
      const groupData = response.data;
      setCurrentUpdateGroup(response.data);
      setUpdateFormData({
        group_name: groupData.group_name,
        group_type: groupData.group_type,
        group_value: groupData.group_value,
        group_install: groupData.group_install,
        group_members: groupData.group_members,
        group_duration: groupData.group_duration,
        start_date: groupData.start_date?.split("T")[0],
        end_date: groupData.end_date?.split("T")[0],        
        minimum_bid: groupData.minimum_bid,
        maximum_bid: groupData.maximum_bid,
        commission: groupData.commission,
        reg_fee: groupData.reg_fee,
      });
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleContinueClick = async () => {
    try {
      await fetchBreakdown(group_id);
  
      if (entries.length === 0 && updateFormData.group_members) {
        const defaultEntries = Array.from({ length: updateFormData.group_members }, (_, index) => ({
          slNo: index + 1,
          auctionDate: '',
          bidAmount: '',
          bidPercentage: '',
          commission: '',
          winningAmount: '',
          dividend: '',
          dividendPerHead: '',
        }));
  
        setEntries(defaultEntries); 
  
        await api.post(`/group/create-group-break/${group_id}`, {
          auctionEntries: defaultEntries,
        });
      }
  
      setAuctionBreakModal(true);
    } catch (error) {
      console.error("Error preparing auction breakdown:", error);
    }
  };
  

  const handleBreakChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };

    if (field === "bidPercentage") {
      updatedEntries[index].bidAmount = ((value / 100) * updateFormData.group_value).toFixed(1);
      updatedEntries[index].commission = ((updateFormData.commission / 100) * updateFormData.group_value).toFixed(1);
      updatedEntries[index].winningAmount = (updateFormData.group_value - updatedEntries[index].bidAmount).toFixed(1);
      updatedEntries[index].dividend = (updatedEntries[index].bidAmount - updatedEntries[index].commission).toFixed(1);
      updatedEntries[index].dividendPerHead = (updatedEntries[index].dividend / updateFormData.group_members).toFixed(1);
    }

    setEntries(updatedEntries);
  };

  const handleBreakGroup = async (e) => {
    e.preventDefault();
    try {
      const completeFormData = { auctionEntries: entries };
      const response = await api.put(`/group/update-group-break/${group_id}`, completeFormData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        alert("Auction breakdown saved successfully!");
        window.location.reload();
      } else {
        alert("Failed to save auction breakdown!");
      }
    } catch (error) {
      console.error("Error updating auction breakdown:", error);
      alert("Failed to save auction breakdown!");
    }
  };
  

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Group Name" },
    { key: "type", header: "Group Type" },
    { key: "value", header: "Group Value" },
    { key: "installment", header: "Installment" },
    { key: "members", header: "Members" },
    { key: "action", header: "Action" },
  ];

  return (
    <>
      <Navbar visibility={true} onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} />
      <div className="flex mt-20">
        <Sidebar />
        <div className="flex-grow p-7">
          <div className="mt-6 mb-8">
            <h1 className="text-2xl font-semibold">Group Breakdown</h1>
          </div>
          <DataTable data={filterOption(TableGroups, searchText)} columns={columns} />
        </div>
      </div>
{/* Update Group Modal */}
<Modal isVisible={showModalUpdate} onClose={() => setShowModalUpdate(false)}>
  <div className="py-6 px-5 lg:px-8 text-left w-full max-w-3xl mx-auto bg-white rounded-lg shadow-xl">
    <h3 className="mb-4 text-xl font-bold text-gray-900">Update Group</h3>
    <form className="space-y-6 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Group Name</label>
          <input type="text" value={updateFormData.group_name} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Group Type</label>
          <input type="text" value={updateFormData.group_type} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Group Value</label>
          <input type="text" value={updateFormData.group_value} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Group Installment</label>
          <input type="text" value={updateFormData.group_install} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Group Members</label>
          <input type="text" value={updateFormData.group_members} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Group Duration</label>
          <input type="text" value={updateFormData.group_duration} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Start Date</label>
          <input type="text" value={updateFormData.start_date} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">End Date</label>
          <input type="text" value={updateFormData.end_date} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Minimum Bid</label>
          <input type="text" value={updateFormData.minimum_bid} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Maximum Bid</label>
          <input type="text" value={updateFormData.maximum_bid} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Commission (%)</label>
          <input type="text" value={updateFormData.commission} readOnly className="input" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Registration Fee</label>
          <input type="text" value={updateFormData.reg_fee} readOnly className="input" />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={handleContinueClick}
          className="px-6 py-2 bg-yellow-500 text-black rounded-lg"
        >
          Continue &gt;
        </button>
      </div>
    </form>
  </div>
</Modal>


<Modal isVisible={auctionBreakModal} onClose={() => setAuctionBreakModal(false)}>
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-[98vw] max-w-[98vw] p-8 rounded-lg shadow-xl overflow-y-auto h-[90vh]">
    <div className="flex justify-end">
        <button
          onClick={() => setAuctionBreakModal(false)}
          className="text-gray-500 hover:text-black text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>
      </div>
    <h2 className="text-3xl font-bold mb-8 border-b pb-4">Auction Breakdown</h2>

    <form onSubmit={handleBreakGroup} className="space-y-12">
      {entries.map((entry, index) => (
        <div key={index} className="space-y-8">
          {/* Auction Heading */}
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Auction {entry.slNo}</h3>

          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sl.No</label>
              <input
                type="number"
                value={entry.slNo}
                readOnly
                className="w-full border rounded-md px-4 py-3 bg-gray-100 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Auction Date</label>
              <input
                type="date"
                value={entry.auctionDate}
                onChange={(e) => handleBreakChange(index, 'auctionDate', e.target.value)}
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bid Percentage</label>
              <input
                type="number"
                value={entry.bidPercentage}
                onChange={(e) => handleBreakChange(index, 'bidPercentage', e.target.value)}
                className="w-full border rounded-md px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bid Amount</label>
              <input
                type="number"
                value={entry.bidAmount}
                readOnly
                className="w-full border rounded-md px-4 py-3 bg-gray-100 text-gray-800"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Commission</label>
              <input
                type="number"
                value={entry.commission}
                readOnly
                className="w-full border rounded-md px-4 py-3 bg-gray-100 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Winning Amount</label>
              <input
                type="number"
                value={entry.winningAmount}
                readOnly
                className="w-full border rounded-md px-4 py-3 bg-gray-100 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dividend</label>
              <input
                type="number"
                value={entry.dividend}
                readOnly
                className="w-full border rounded-md px-4 py-3 bg-gray-100 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dividend Per Head</label>
              <input
                type="number"
                value={entry.dividendPerHead}
                readOnly
                className="w-full border rounded-md px-4 py-3 bg-gray-100 text-gray-800"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-lg text-xl"
        >
          Save Breakdown
        </button>
      </div>
      
    </form>
  </div>
  </div>
</Modal>

   </>
  );
};

export default GroupBreakDown;
