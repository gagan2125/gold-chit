/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
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
import { Printer } from "lucide-react";
import { BiPrinter } from "react-icons/bi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import { FaWhatsappSquare } from "react-icons/fa";
import PrintModal from "../components/modals/PrintModal";
import PaymentPrint from "../components/printFormats/PaymentPrint";
import Navbar from "../components/layouts/Navbar";
import { Select, Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import { Link } from "react-router-dom";
const Payment = () => {
	const [groups, setGroups] = useState([]);
	const [actualGroups, setActualGroups] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState("");
	const [TablePayments, setTablePayments] = useState([]);
	const [selectedAuctionGroup, setSelectedAuctionGroup] = useState("");
	const [selectedGroupId, setSelectedGroupId] = useState("");
	const [selectedAuctionGroupId, setSelectedAuctionGroupId] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [userName, setUserName] = useState("");
	const [filteredAuction, setFilteredAuction] = useState([]);
	const [groupInfo, setGroupInfo] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showModalDelete, setShowModalDelete] = useState(false);
	const [currentGroup, setCurrentGroup] = useState(null);
	const [showModalUpdate, setShowModalUpdate] = useState(false);
	const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [receiptNo, setReceiptNo] = useState("");
	const whatsappEnable = true;
	const [paymentMode, setPaymentMode] = useState("cash");
	const today = new Date().toISOString().split("T")[0];
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [searchText, setSearchText] = useState("");

	const onGlobalSearchChangeHandler = (e) => {
		const { value } = e.target;
		setSearchText(value);
	};
	const [alertConfig, setAlertConfig] = useState({
		visibility: false,
		message: "Something went wrong!",
		noReload: false,
		type: "info",
	});
	const [EnrollGroupId, setEnrollGroupId] = useState({
		groupId: "",
		ticket: "",
	});
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		group_id: "",
		user_id: "",
		ticket: "",
		receipt_no: "",
		pay_date: today,
		amount: "",
		pay_type: "cash",
		transaction_id: "",
	});
	const [showPrintModal, setShowPrintModal] = useState(false);
	const [printDetails, setPrintDetails] = useState({
		customerName: "",
		groupName: "",
		ticketNumber: "",
		receiptNumber: "",
		paymentDate: "",
		paymentMode: "",
		amount: "",
		transactionId: "",
	});
	const printModalOnCloseHandler = () => setShowPrintModal(false);

	const handleModalClose = () => setShowUploadModal(false);
	const [reload, setReload] = useState(false);

	const handlePrint = async (id) => {
		const receiptElement = document.getElementById("receipt");
		const canvas = await html2canvas(receiptElement);
		const imgData = canvas.toDataURL("image/png");

		const pdf = new jsPDF("portrait", "mm", "a4");
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
		pdf.save(`Receipt_${id}.pdf`);
	};

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await api.get("/user/get-user");
				setGroups(response.data);
				console.log("useEffect Groups", response.data);
			} catch (error) {
				console.error("Error fetching group data:", error);
			}
		};
		fetchGroups();
	}, [alertConfig]);

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await api.get("/group/get-group-admin");
				console.log("useEffect actual Group", actualGroups);
				setActualGroups(response.data);
			} catch (error) {
				console.error("Error fetching group data:", error);
			}
		};
		fetchGroups();
	}, [alertConfig]);

	useEffect(() => {
		const fetchReceipt = async () => {
			try {
				const response = await api.get("/payment/get-latest-receipt");
				setReceiptNo(response.data);
				console.log("selectedgroupid", selectedGroupId);
			} catch (error) {
				console.error("Error fetching receipt data:", error);
			}
		};
		fetchReceipt();
	}, [alertConfig]);

	useEffect(() => {
		if (receiptNo) {
			setFormData((prevData) => ({
				...prevData,
				receipt_no: receiptNo.receipt_no,
			}));
		}
	}, [receiptNo]);

	const validateForm = () => {
		const newErrors = {};

		// Customer validation
		if (!selectedGroupId) {
			newErrors.customer = "Please select a customer";
		}

		// Group & Ticket validation
		if (!formData.group_id || !formData.ticket) {
			newErrors.group_ticket = "Please select a group and ticket";
		}

		// Payment Date validation
		if (!formData.pay_date) {
			newErrors.pay_date = "Payment date is required";
		}

		// Amount validation
		const amount = parseFloat(formData.amount);
		if (isNaN(amount) || amount <= 0) {
			newErrors.amount = "Please enter a valid positive amount";
		}

		// Transaction ID validation
		if (paymentMode === "online" && !formData.transaction_id?.trim()) {
			newErrors.transaction_id =
				"Transaction ID is required for online payments";
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
		setErrors((prevData) => ({ ...prevData, [name]: "" }));
	};

	const handleChangeUser = (e) => {
		const { name, value } = e.target;

		const [group_id, ticket] = value.split("|");
		setUserName(name);
		setFormData((prevData) => ({
			...prevData,
			group_id,
			ticket,
		}));
		setErrors((prevData) => ({ ...prevData, group_ticket: "" }));
	};

	const handleGroupChange = async (groupId) => {
		setSelectedGroup(groupId);

		if (groupId) {
			try {
				const response = await api.get(`/enroll/get-group-enroll/${groupId}`);
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

	const columns = [
		{ key: "id", header: "SL. NO" },
		{ key: "name", header: "Customer Name" },
		{ key: "phone_number", header: "Customer Phone Number" },
		{ key: "ticket", header: "Ticket Number" },
		{ key: "old_receipt", header: "Old Receipt" },
		{ key: "receipt", header: "Receipt" },
		{ key: "amount", header: "Amount" },
		{ key: "date", header: "Paid Date" },
		{ key: "collected_by", header: "Collected By" },
		{ key: "action", header: "Action" },
	];

	const handleGroup = async (event) => {
		const groupId = event.target.value;
		setSelectedGroupId(groupId);
		setFormData((prevFormData) => ({
			...prevFormData,
			user_id: groupId,
		}));
		setErrors((prevData) => ({ ...prevData, customer: "" }));

		handleGroupChange(groupId);
		handleGroupAuctionChange(groupId);

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

	const handleGroupPayment = async (groupId) => {
		setSelectedAuctionGroupId(groupId);
		handleGroupPaymentChange(groupId);
	};

	const formatPayDate = (dateString) => {
		const date = new Date(dateString);
		const options = { day: "numeric", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-US", options);
	};

	const handleGroupPaymentChange = async (groupId) => {
		setLoading(true);
		setSelectedAuctionGroup(groupId);
		if (groupId) {
			try {
				const response = await api.get(`/payment/get-group-payment/${groupId}`);
				setLoading(false);
				if (response.data && response.data.length > 0) {
					//setFilteredAuction(response.data);
					const formattedData = response.data.map((group, index) => ({
						_id: group._id,
						id: index + 1,
						name: group?.user_id?.full_name,
						phone_number: group?.user_id?.phone_number,
						ticket: group.ticket,
						receipt: group.receipt_no,
						old_receipt: group.old_receipt_no,
						amount: group.amount,
						date: formatPayDate(group.pay_date),
						collected_by: group?.collected_name || "Admin",
						action: (
							<div className="flex justify-center gap-2">
								{/* <a
                  href={`/print/${group._id}`}
                  className="border border-blue-400 text-white px-4 py-2 rounded-md shadow hover:border-blue-700 transition duration-200"
                >
                  <BiPrinter color="blue" />
                </a>
                <button
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
													<Link
														to={`/print/${group._id}`}
														className="text-blue-600 "
													>
														Print
													</Link>
												),
											},
											{
												key: "2",
												label: (
													<div
														className="text-red-600 "
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
					setTablePayments(formattedData);
				} else {
					setFilteredAuction([]);
				}
			} catch (error) {
				setLoading(false);
				console.error("Error fetching payment data:", error);
				setFilteredAuction([]);
			}
		} else {
			setFilteredAuction([]);
		}
	};

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
	const createReceipt = async (formData) => {
		try {
			const {
				group_id,
				user_id,
				ticket,
				receipt_no,
				pay_date,
				amount,
				pay_type,
				transaction_id,
			} = formData;

			const responseUser = await api.get(`user/get-user-by-id/${user_id}`);

			const responseGroup = await api.get(`group/get-by-id-group/${group_id}`);
			console.log(responseGroup, "hurrauy");

			if (responseUser.status === 200 && responseGroup.status === 200) {
				const customerName = responseUser?.data?.full_name;
				const groupName = responseGroup?.data?.group_name;
				if (customerName && groupName) {
					setPrintDetails((prev) => ({
						...prev,
						customerName,
						groupName,
						ticketNumber: ticket,
						receiptNumber: receipt_no,
						paymentDate: pay_date,
						paymentMode: pay_type,
						transactionId: pay_type === "cash" ? "" : transaction_id,
						amount,
					}));
					setShowPrintModal(true);
				}
			}
			if (responseUser.status >= 400 || responseGroup.status >= 400) {
				setAlertConfig({
					visibility: true,
					noReload: true,
					message: `Error Creating Receipt`,
					type: "error",
				});
			}
		} catch (err) {
			setAlertConfig({
				visibility: true,
				noReload: true,
				message: `Error Creating Receipt`,
				type: "error",
			});
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const isValid = validateForm();
		try {
			if (isValid) {
				setDisabled(true);
				setAlertConfig((prev) => ({
					...prev,
					visibility: false,
				}));
				setShowModal(false);
				const response = await api.post("/payment/add-payment", formData);
				if (response.status === 201) {
					setSelectedGroupId("");
					createReceipt(formData);
					setDisabled(false);
					setFormData({
						group_id: "",
						user_id: "",
						ticket: "",
						receipt_no: "",
						pay_date: "",
						amount: "",
						pay_type: "cash",
						transaction_id: "",
					});
					setAlertConfig({
						visibility: true,
						noReload: true,
						message: "Payment Added Successfully",
						type: "success",
					});
				}
				if (response.status >= 400) {
					setShowModal(false);
					setSelectedGroupId("");
					setDisabled(false);
					setFormData({
						group_id: "",
						user_id: "",
						ticket: "",
						receipt_no: "",
						pay_date: "",
						amount: "",
						pay_type: "cash",
						transaction_id: "",
					});
					setAlertConfig({
						visibility: true,
						noReload: true,
						message: "Payment Added Failed",
						type: "error",
					});
				}
			}
		} catch (error) {
			setShowModal(false);
			setSelectedGroupId("");
			setFormData({
				group_id: "",
				user_id: "",
				ticket: "",
				receipt_no: "",
				pay_date: "",
				amount: "",
				pay_type: "cash",
				transaction_id: "",
			});
			setAlertConfig({
				visibility: true,
				noReload: true,
				message: `Error submitting payment data`,
				type: "error",
			});
			setDisabled(false);
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

				setShowModalDelete(false);
				setCurrentGroup(null);
				setAlertConfig({
					visibility: true,
					message: "Payment deleted successfully",
					type: "success",
				});
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

		formDatas.append("user_id", formData.user_id);
		formDatas.append("group_id", formData.group_id);
		formDatas.append("ticket", formData.ticket);

		if (fileInput && fileInput.files[0]) {
			formDatas.append("file", fileInput.files[0]);

			try {
				const response = await api.post(`/payment/payment-excel`, formDatas, {
					headers: { "Content-Type": "multipart/form-data" },
				});

				if (response.status === 200) {
					setShowUploadModal(false);
					setAlertConfig({
						visibility: true,
						message: "File uploaded successfully!",
						type: "success",
					});
				}
			} catch (error) {
				console.error("Error uploading file:", error);

				setAlertConfig({
					visibility: true,
					message: "Failed to upload file.",
					type: "success",
				});
			}
		} else {
			setAlertConfig({
				visibility: true,
				message: "Please select a file to upload.",
				type: "success",
			});
		}
	};

	const handleGroupAuctionChange = async (groupId) => {
		if (groupId) {
			try {
				const response = await api.post(
					`/enroll/get-user-tickets-report/${groupId}`
				);
				if (response.data && response.data.length > 0) {
					const validAuctions = response.data.filter(
						(auction) => auction.enrollment && auction.enrollment.group
					);
					setFilteredAuction(validAuctions);
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
						noReload={alertConfig.noReload}
					/>
					<div className="flex-grow p-7">
						<h1 className="text-2xl font-semibold">Payments</h1>
						<div className="mt-6 mb-8">
							<div className="mb-10">
								<label className="font-bold">Search or Select Group</label>
								<div className="flex justify-between items-center w-full">
									<Select
										placeholder="Search or Select Group"
										popupMatchSelectWidth={false}
										showSearch
										className="w-full max-w-md"
										filterOption={(input, option) =>
											option.children
												.toString()
												.toLowerCase()
												.includes(input.toLowerCase())
										}
										value={selectedAuctionGroupId || undefined}
										onChange={handleGroupPayment}
									>
										{actualGroups.map((group) => (
											<Select.Option key={group._id} value={group._id}>
												{group.group_name}
											</Select.Option>
										))}
									</Select>
									<div>
										<button
											onClick={() => setShowModal(true)}
											className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
										>
											+ Add Payment
										</button>
										<button
											onClick={() => setShowUploadModal(true)}
											className="ml-4 bg-yellow-300 text-black px-4 py-2 rounded shadow-md hover:bg-yellow-400 transition duration-200"
										>
											Upload Excel
										</button>
									</div>
								</div>
							</div>
							<UploadModal
								show={showUploadModal}
								onClose={handleModalClose}
								onSubmit={handleFileSubmit}
								groups={groups}
								selectedGroupId={selectedGroupId}
								handleGroup={handleGroup}
								handleChangeUser={handleChangeUser}
								formData={formData}
								filteredAuction={filteredAuction}
							/>
							{TablePayments && TablePayments.length > 0 && !loading ? (
								<DataTable
									data={TablePayments.filter((item) =>
										Object.values(item).some((value) =>
											String(value)
												.toLowerCase()
												.includes(searchText.toLowerCase())
										)
									)}
									columns={columns}
									exportedFileName={`Payments ${
										TablePayments.length > 0
											? TablePayments[0].date +
											  " to " +
											  TablePayments[TablePayments.length - 1].date
											: "empty"
									}.csv`}
								/>
							) : (
								<div className="mt-10 text-center text-gray-500">
									<CircularLoader />
								</div>
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
								Add Payment
							</h3>
							<form className="space-y-6" onSubmit={handleSubmit} noValidate>
								<div className="w-full">
									<label
										className="block mb-2 text-sm font-medium text-gray-900"
										htmlFor="category"
									>
										Customer
									</label>
									<select
										value={selectedGroupId}
										onChange={handleGroup}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
									>
										<option value="" disabled>
											Select Customer
										</option>
										{groups.map((group) => (
											<option key={group._id} value={group._id}>
												{group.full_name}
											</option>
										))}
									</select>
									{errors.customer && (
										<p className="text-red-500 text-xs mt-1">
											{errors.customer}
										</p>
									)}
								</div>
								<div className="w-full">
									<label
										className="block mb-2 text-sm font-medium text-gray-900"
										htmlFor="category"
									>
										Group & Ticket
									</label>
									<select
										name="group_id"
										value={`${formData.group_id}|${formData.ticket}`}
										onChange={handleChangeUser}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
									>
										<option value="">Select Group | Ticket</option>
										{filteredAuction.map((group) => {
											// Skip entries where group is null
											if (!group.enrollment.group) return null;

											return (
												<option
													key={group.enrollment.group._id}
													value={`${group.enrollment.group._id}|${group.enrollment.tickets}`}
												>
													{group.enrollment.group.group_name} |{" "}
													{group.enrollment.tickets}
												</option>
											);
										})}
									</select>
									{errors.group_ticket && (
										<p className="text-red-500 text-xs mt-1">
											{errors.group_ticket}
										</p>
									)}
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

										{errors.pay_date && (
											<p className="text-red-500 text-xs mt-1">
												{errors.pay_date}
											</p>
										)}
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
											type="number"
											name="amount"
											value={formData.amount}
											id="amount"
											onChange={handleChange}
											placeholder="Enter Amount"
											required
											className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
										/>

										{errors.amount && (
											<p className="text-red-500 text-xs mt-1">
												{errors.amount}
											</p>
										)}
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
										{errors.transaction_id && (
											<p className="text-red-500 text-xs mt-1">
												{errors.transaction_id}
											</p>
										)}
									</div>
								)}
								<div className="flex flex-col items-center p-4 max-w-full bg-white rounded-lg shadow-sm space-y-4">
									<div className="flex items-center space-x-1">
										<FaWhatsappSquare color="green" className="w-8 h-8" />
										<h2 className="text-md font-semibold text-gray-800">
											WhatsApp
										</h2>
									</div>

									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={whatsappEnable}
											className="text-green-500 checked:ring-2  checked:ring-green-700 rounded-full w-4 h-4"
										/>
										<span className="text-gray-700 text-sm">
											Send Via Whatsapp
										</span>
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
					<PrintModal
						isVisible={showPrintModal}
						onClose={printModalOnCloseHandler}
					>
						<PaymentPrint printDetails={printDetails} />
					</PrintModal>

					<Modal
						isVisible={showModalUpdate}
						onClose={() => setShowModalUpdate(false)}
					>
						<div className="py-6 px-5 lg:px-8 text-left">
							<h3 className="mb-4 text-xl font-bold text-gray-900">
								View Auction
							</h3>
							<form className="space-y-6" onSubmit={() => {}} noValidate>
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

export default Payment;

function ReceiptButton() {
	return (
		<div>
			{/* Receipt Content */}
			<div
				id="receipt"
				style={{
					width: "210mm",
					height: "297mm",
					padding: "20mm",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				{/* Top Half */}
				<div style={{ borderBottom: "1px solid black", height: "50%" }}>
					<h2>Receipt - Part 1</h2>
					<p>Details for the first part...</p>
					<p>
						<strong>Amount:</strong> $123.45
					</p>
					<p>
						<strong>Date:</strong> 01/22/2025
					</p>
				</div>

				{/* Bottom Half */}
				<div style={{ height: "50%" }}>
					<h2>Receipt - Part 2</h2>
					<p>Details for the second part...</p>
					<p>
						<strong>Amount:</strong> $123.45
					</p>
					<p>
						<strong>Date:</strong> 01/22/2025
					</p>
				</div>
			</div>

			{/* Button to Generate PDF */}
			<button
				onClick={() => handleUpdateModalOpen("example-id")}
				className="border border-blue-400 text-white px-4 py-2 rounded-md shadow hover:border-blue-700 transition duration-200"
			>
				<BiPrinter color="blue" />
			</button>
		</div>
	);
}
