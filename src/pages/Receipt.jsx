/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "../components/modals/Modal";
import { BsEye } from "react-icons/bs";
import UploadModal from "../components/modals/UploadModal";
import axios from "axios";
import url from "../data/Url";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import EndlessCircularLoader from "../components/loaders/EndlessCircularLoader";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
const Receipt = () => {
	const [groups, setGroups] = useState([]);
	const [TableDaybook, setTableDaybook] = useState([]);
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
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [receiptNo, setReceiptNo] = useState("");
	const [paymentMode, setPaymentMode] = useState("cash");
	const [searchText, setSearchText] = useState("");
	const onGlobalSearchChangeHandler = (e) => {
		setSearchText(e.target.value);
	};
	const [selectedFromDate, setSelectedFromDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	});
	const [selectedDate, setSelectedDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	});
	const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
	const [selectedCustomers, setSelectedCustomers] = useState("");
	const [payments, setPayments] = useState([]);

	const [formData, setFormData] = useState({
		group_id: "",
		user_id: "",
		ticket: "",
		receipt_no: "",
		pay_date: "",
		amount: "",
		pay_type: "cash",
		transaction_id: "",
	});
	const [alertConfig, setAlertConfig] = useState({
		visibility: false,
		message: "Something went wrong!",
		type: "info",
	});
	const handleModalClose = () => setShowUploadModal(false);

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
		const fetchReceipt = async () => {
			try {
				const response = await api.get("/payment/get-latest-receipt");
				setReceiptNo(response.data);
			} catch (error) {
				console.error("Error fetching receipt data:", error);
			}
		};
		fetchReceipt();
	}, []);

	useEffect(() => {
		if (receiptNo) {
			setFormData((prevData) => ({
				...prevData,
				receipt_no: receiptNo.receipt_no,
			}));
		}
	}, [receiptNo]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleChangeUser = (e) => {
		const { name, value } = e.target;
		const [user_id, ticket] = value.split("-");
		setFormData((prevData) => ({
			...prevData,
			user_id,
			ticket,
		}));
	};

	// const handleGroupChange = async (groupId) => {
	//     setSelectedGroup(groupId);
	//     if (groupId) {
	//         try {
	//             const response = await api.get(`/enroll/get-group-enroll/${groupId}`);
	//             if (response.data && response.data.length > 0) {
	//                 setFilteredUsers(response.data);
	//             } else {
	//                 setFilteredUsers([]);
	//             }
	//         } catch (error) {
	//             console.error("Error fetching enrollment data:", error);
	//             setFilteredUsers([]);
	//         }
	//     } else {
	//         setFilteredUsers([]);
	//     }
	// };

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await api.get("/user/get-user");
				setFilteredUsers(response.data);
			} catch (error) {
				console.error("Error fetching group data:", error);
			}
		};
		fetchGroups();
	}, []);

	const handleGroup = async (event) => {
		const groupId = event.target.value;
		setSelectedGroupId(groupId);
		setFormData((prevFormData) => ({
			...prevFormData,
			group_id: groupId,
		}));

		handleGroupChange(groupId);

		if (groupId) {
			try {
				const response = await api.get(`/group/get-by-id-group/${groupId}`);
				setGroupInfo(response.data || {});
			} catch (error) {
				console.error("Error fetching group data:", error);
				setGroupInfo({});
			}
		} else {
			setGroupInfo({});
		}
	};

	const handleGroupPayment = async (event) => {
		const groupId = event.target.value;
		setSelectedAuctionGroupId(groupId);
		handleGroupChange(groupId);
	};

	// const handleGroupPaymentChange = async (groupId) => {
	//     setSelectedAuctionGroup(groupId);
	//     if (groupId) {
	//         try {
	//             // Include selectedDate in the query parameters
	//             const response = await api.get(
	//                 `/payment/get-group-payment/${groupId}`,
	//                 {
	//                     params: { pay_date: selectedDate }, // Send selectedDate as a query parameter
	//                 }
	//             );
	//             if (response.data && response.data.length > 0) {
	//                 setFilteredAuction(response.data);
	//             } else {
	//                 setFilteredAuction([]);
	//             }
	//         } catch (error) {
	//             console.error("Error fetching payment data:", error);
	//             setFilteredAuction([]);
	//         }
	//     } else {
	//         setFilteredAuction([]);
	//     }
	// };

	const formatPayDate = (dateString) => {
		const date = new Date(dateString);
		const options = { day: "numeric", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-US", options).replace(",", "");
	};

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				const response = await api.get(`/payment/get-report-receipt`, {
					params: {
						from_date: selectedFromDate,
						to_date: selectedDate,
						groupId: selectedAuctionGroupId,
						userId: selectedCustomers,
						pay_type: selectedPaymentMode,
					},
				});
				if (response.data && response.data.length > 0) {
					const validPayments = response.data.filter(
						(payment) => payment.group_id !== null
					);

					setFilteredAuction(validPayments);
					console.log("payment:", validPayments);

					const totalAmount = validPayments.reduce(
						(sum, payment) => sum + Number(payment.amount || 0),
						0
					);
					setPayments(totalAmount);

					const formattedData = validPayments.map((group, index) => ({
						_id: group._id,
						id: index + 1,
						date: formatPayDate(group.pay_date),
						group: group.group_id.group_name,
						name: group.user_id?.full_name,
						phone_number: group.user_id?.phone_number,
						receipt_no: group?.receipt_no
							? group.receipt_no
							: `#${group.old_receipt_no.split("-")[1]}`,
						ticket: group.ticket,
						amount: group.amount,
						mode: group.pay_type,
						collected_by: group?.collected_name || "Admin",
					}));

					setTableDaybook(formattedData);
				} else {
					setFilteredAuction([]);
				}
			} catch (error) {
				console.error("Error fetching payment data:", error);
				setFilteredAuction([]);
				setPayments(0);
			}
		};

		fetchPayments();
	}, [
		selectedAuctionGroupId,
		selectedDate,
		selectedPaymentMode,
		selectedCustomers,
		selectedFromDate,
	]);

	const columns = [
		{ key: "id", header: "SL. NO" },
		{ key: "date", header: "Date" },
		{ key: "group", header: "Group Name" },
		{ key: "name", header: "Customer Name" },
		{ key: "phone_number", header: "Customer Phone Number" },
		{ key: "receipt_no", header: "Receipt Number" },
		{ key: "ticket", header: "Ticket" },
		{ key: "amount", header: "Amount" },
		{ key: "mode", header: "Payment Mode" },
		{ key: "collected_by", header: "Collected By" },
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
			}));
		}
	}, [groupInfo, formData.bid_amount]);

	const handlePaymentModeChange = (e) => {
		const selectedMode = e.target.value;
		setPaymentMode(selectedMode);
		setFormData((prevData) => ({
			...prevData,
			pay_type: selectedMode,
			transaction_id: selectedMode === "online" ? prevData.transaction_id : "",
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await api.post("/payment/add-payment", formData);
			if (response.status === 201) {
				alert("Payment Added Successfully");
				//window.location.reload();
				setShowModal(false);
			}
		} catch (error) {
			console.error("Error submitting payment data:", error);
		}
	};

	const handleDeleteModalOpen = async (groupId) => {
		try {
			const response = await api.get(`/payment/get-payment-by-id/${groupId}`);
			setCurrentGroup(response.data);
			setShowModalDelete(true);
		} catch (error) {
			console.error("Error fetching enroll:", error);
		}
	};

	const handleDeleteAuction = async () => {
		if (currentGroup) {
			try {
				await api.delete(`/payment/delete-payment/${currentGroup._id}`);
				alert("Payment deleted successfully");
				setShowModalDelete(false);
				setCurrentGroup(null);
				window.location.reload();
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

	const handleFileSubmit = async (e) => {
		e.preventDefault();

		const formDatas = new FormData();
		const fileInput = e.target.file;
		if (fileInput && fileInput.files[0]) {
			formDatas.append("file", fileInput.files[0]);

			try {
				const response = await api.post(`/payment/payment-excel`, formDatas, {
					headers: { "Content-Type": "multipart/form-data" },
				});

				if (response.status === 200) {
					alert("File uploaded successfully!");
					window.location.reload();
					setShowUploadModal(false);
				}
			} catch (error) {
				console.error("Error uploading file:", error);
				alert("Failed to upload file.");
			}
		} else {
			alert("Please select a file to upload.");
		}
	};

	return (
		<>
			<div className="w-screen">
				<div className="flex mt-20">
					<Navbar
						onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
						visibility={true}
					/>
					<CustomAlert
						type={alertConfig.type}
						isVisible={alertConfig.visibility}
						message={alertConfig.message}
					/>
					<div className="flex-grow p-7">
						<h1 className="text-2xl font-semibold">Reports - Receipt</h1>
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
											value={selectedDate}
											onChange={(e) => setSelectedDate(e.target.value)}
											className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
										/>
									</div>
									<div className="mb-2">
										<label>Group</label>
										<select
											value={selectedAuctionGroupId}
											onChange={handleGroupPayment}
											className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
										>
											<option value="">Select Group</option>
											{groups.map((group) => (
												<option key={group._id} value={group._id}>
													{group.group_name}
												</option>
											))}
										</select>
									</div>
									<div className="mb-2">
										<label>Customer</label>
										<select
											value={selectedCustomers}
											onChange={(e) => setSelectedCustomers(e.target.value)}
											className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
										>
											<option value="">Select Customer</option>
											{filteredUsers.map((group) => (
												<option key={group?._id} value={group?._id}>
													{group?.full_name} - {group.phone_number}
												</option>
											))}
										</select>
									</div>
									<div className="mb-2">
										<label>Payment Mode</label>
										<select
											value={selectedPaymentMode}
											onChange={(e) => setSelectedPaymentMode(e.target.value)}
											className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
										>
											<option value="">Select Payment Mode</option>
											<option value="cash">Cash</option>
											<option value="online">Online</option>
										</select>
									</div>
									<div>
										<h1 className="text-md mt-6">
											Total Amount:{" "}
											<span className="text-xl">₹{payments || 0}</span>
										</h1>
									</div>
								</div>
							</div>
							{filteredAuction && filteredAuction.length > 0 ? (
								<div className="mt-10">
									<DataTable
										data={filterOption(TableDaybook, searchText)}
										columns={columns}
										exportedFileName={`ReportsReceipt-${
											TableDaybook.length > 0
												? TableDaybook[0].name +
												  " to " +
												  TableDaybook[TableDaybook.length - 1].name
												: "empty"
										}.csv`}
									/>
								</div>
							) : (
								<div className="mt-10 text-center text-gray-500">
									<CircularLoader />
								</div>
							)}
						</div>
					</div>
					<Modal isVisible={showModal} onClose={() => setShowModal(false)}>
						<div className="py-6 px-5 lg:px-8 text-left">
							<h3 className="mb-4 text-xl font-bold text-gray-900">
								Add Payment
							</h3>
							<form className="space-y-6" onSubmit={handleSubmit}>
								<div className="w-full">
									<label
										className="block mb-2 text-sm font-medium text-gray-900"
										htmlFor="category"
									>
										Group
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
								</div>
								<div className="w-full">
									<label
										className="block mb-2 text-sm font-medium text-gray-900"
										htmlFor="category"
									>
										Customers
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
											<option
												key={`${user?.user_id?._id}-${user.tickets}`}
												value={`${user?.user_id?._id}-${user.tickets}`}
											>
												{user?.user_id?.full_name} | {user.tickets}
											</option>
										))}
									</select>
								</div>
								<div className="flex flex-row justify-between space-x-4">
									<div className="w-1/2">
										<label
											className="block mb-2 text-sm font-medium text-gray-900"
											htmlFor="group_value"
										>
											Receipt No.
										</label>
										<input
											type="text"
											name="receipt_no"
											value={formData.receipt_no}
											id="receipt_no"
											placeholder="Receipt No."
											readOnly
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
										/>
									</div>
									<div className="w-1/2">
										<label
											className="block mb-2 text-sm font-medium text-gray-900"
											htmlFor="group_install"
										>
											Payment Date
										</label>
										<input
											type="date"
											name="pay_date"
											value={formData.pay_date}
											id="pay_date"
											onChange={handleChange}
											placeholder=""
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
											Amount
										</label>
										<input
											type="text"
											name="amount"
											value={formData.amount}
											id="amount"
											onChange={handleChange}
											placeholder="Enter Amount"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
										/>
									</div>
									<div className="w-1/2">
										<label
											className="block mb-2 text-sm font-medium text-gray-900"
											htmlFor="pay_mode"
										>
											Payment Mode
										</label>
										<select
											name="pay_mode"
											id="pay_mode"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
											onChange={handlePaymentModeChange}
										>
											<option value="cash">Cash</option>
											<option value="online">Online</option>
										</select>
									</div>
								</div>
								{paymentMode === "online" && (
									<div className="w-full mt-4">
										<label
											className="block mb-2 text-sm font-medium text-gray-900"
											htmlFor="transaction_id"
										>
											Transaction ID
										</label>
										<input
											type="text"
											name="transaction_id"
											id="transaction_id"
											value={formData.transaction_id}
											onChange={handleChange}
											placeholder="Enter Transaction ID"
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
										/>
									</div>
								)}
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
								<div>
									<label
										className="block mb-2 text-sm font-medium text-gray-900"
										htmlFor="email"
									>
										User
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
								Sure want to delete this Payment ?
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

export default Receipt;
