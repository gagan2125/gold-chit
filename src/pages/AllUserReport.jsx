/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import { Select } from "antd";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";

const AllUserReport = () => {
  const [searchText, setSearchText] = useState("");

  const [screenLoading, setScreenLoading] = useState(true);
  const [auctionTableData, setAuctionTableData] = useState([]);
  const [usersData, SetUsersData] = useState([]);
  // unlimited reloading of page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await api.get("/user/all-customers-report");
        const usersList = [];
        let count =0;
        console.info(reportResponse.data)
        reportResponse.data.forEach((usrData) => {
          
          if (usrData?.data) {
            usrData.data.forEach((data, index) => {
              if (data?.enrollment?.group) {
                const groupInstall = parseInt(
                  data.enrollment.group.group_install
                );
                const groupType = data.enrollment.group.group_type;
                const totalPaidAmount = data.payments.totalPaidAmount;
                const auctionCount = parseInt(data?.auction?.auctionCount);
                const totalPayable = data.payable.totalPayable;
                const totalProfit = data.profit.totalProfit;
                const firstDividentHead = data.firstAuction.firstDividentHead;
                count++
                const tempUsr = {
                  sl_no:count,
                  _id: usrData._id,
                  userName: usrData.userName,
                  userPhone:usrData.phone_number,
                  customerId: usrData.customer_id,
                  amountPaid: totalPaidAmount,
                  paymentsTicket: data.payments.ticket,
                  groupValue:data?.enrollment?.group?.group_value,
                  groupName: data.enrollment.group.group_name,
                  profit: totalProfit,
                  agent:data?.enrollment?.agent,
                  reffered_customer:data?.enrollment?.reffered_customer,
                  reffered_lead:data?.enrollment?.reffered_lead,
                  payment_type:data?.enrollment?.payment_type,
                  referred_type:data?.enrollment?.referred_type,
                  totalToBePaid:
                    groupType === "double"
                      ? groupInstall * auctionCount + groupInstall
                      : totalPayable + groupInstall + totalProfit,
                  toBePaidAmount:
                    groupType === "double"
                      ? groupInstall * auctionCount + groupInstall
                      : totalPayable + groupInstall + firstDividentHead,
                  balance:
                    groupType === "double"
                      ? groupInstall * auctionCount +
                        groupInstall -
                        totalPaidAmount
                      : totalPayable +
                        groupInstall +
                        firstDividentHead -
                        totalPaidAmount,
                };
console.info(tempUsr,)
                usersList.push(tempUsr);
              }
            });
          }
        });

        SetUsersData(usersList);
        setScreenLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setScreenLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotals = (processedData) => ({
    totalToBePaid: processedData.reduce(
      (sum, item) => sum + (item.totalBePaid || 0),
      0
    ),
    totalProfit: processedData.reduce(
      (sum, item) => sum + (item.profit || 0),
      0
    ),
    netTotalProfit: processedData.reduce(
      (sum, item) => sum + (item.toBePaidAmount || 0),
      0
    ),
    totalPaid: processedData.reduce(
      (sum, item) => sum + (item.paidAmount || 0),
      0
    ),
  });

  const Auctioncolumns = [
    { key: "sl_no", header: "SL. NO" },
    { key: "userName", header: "Customer Name" },
    { key: "userPhone", header: "Phone Number" },
    { key: "customerId", header: "Customer Id" },
    { key: "groupName", header: "Group Name" },
    { key: "groupValue", header: "Group Value" },
    { key: "referred_type", header: "Referred Type" },
    { key: "agent", header: "Referred Agent" },
    { key: "reffered_customer", header: "Referred  Customer" },
    { key: "reffered_lead", header: "Referred Lead" },
    { key: "payment_type", header: "Payment Type" },
    { key: "paymentsTicket", header: "Ticket" },
    { key: "totalToBePaid", header: "Amount to be Paid" },
    { key: "profit", header: "Profit" },
    { key: "toBePaidAmount", header: "Net To be Paid" },
    { key: "amountPaid", header: "Amount Paid" },
    { key: "balance", header: "Balance" },
  ];

  return (
    <div className="w-screen">
      <div className="flex mt-20">
        <Navbar
          onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
          visibility={true}
        />
        {screenLoading ? (
          <div className="w-full">
            <CircularLoader color="text-green-600" />
          </div>
        ) : (
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-semibold text-center">
              All Customer Report
            </h1>

            <div className="mt-6 mb-8">
              <div className="mt-6 mb-8">
                <div className="flex justify-start border-b border-gray-300 mb-4"></div>
                <div className="mt-10">
                  <DataTable
                    data={filterOption(usersData, searchText)}
                    columns={Auctioncolumns}
                    exportedFileName={`CustomerReport-${auctionTableData.userId}.csv`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUserReport;

