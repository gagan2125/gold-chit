import React, { useEffect, useState } from "react";
import DataTable from "../components/layouts/Datatable";
import api from "../instance/TokenInstance";
import Sidebar from "../components/layouts/Sidebar";

const AllGroupReport = () => {
  const [TableEnrollsData, setTableEnrollsData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [groupPaid, setGroupPaid] = useState("");
  const [groupToBePaid, setGroupToBePaid] = useState("");
  const Datecolumns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Customer Name" },
    { key: "group_name", header: "Group Name" },
    { key: "phone_number", header: "Customer Phone Number" },
    { key: "start_date", header: "Start Date" },
    { key: "ticket", header: "Ticket" },
    { key: "amount_to_be_paid", header: "Amount to be Paid" },
    { key: "amount_paid", header: "Amount Paid" },
    { key: "amount_balance", header: "Amount Balance" },
  ];
  useEffect(() => {
    const controller = new AbortController();
    async function getAllGroupReport() {
      try {
        const response = await api.get(`/group-report/get-all-group-enroll`,{
          signal:controller.signal
        });
        console.log(response.data);
        if (response.data && response.data.length > 0) {
          setFilteredUsers(response.data);

          const Paid = response.data;
          setGroupPaid(Paid[0].groupPaidAmount);

          const toBePaid = response.data;
          setGroupToBePaid(toBePaid[0].totalToBePaidAmount);

          const formattedData = response.data.map((group, index) => {
            return {
              id: index + 1,
              name: group?.user?.full_name,
              phone_number: group?.user?.phone_number,
              start_date: group?.group?.start_date.split("T")[0],
              ticket: group.ticket,
              group_name: group?.group?.group_name,
              amount_to_be_paid:
                group?.group?.group_type === "double"
                  ? parseInt(group?.group?.group_install) *
                      parseInt(group.auctionCount) +
                    parseInt(group?.group?.group_install)
                  : parseInt(group?.group?.group_install) +
                    group.totalToBePaidAmount +
                    parseInt(group.dividentHead),

              amount_paid: group.totalPaidAmount,

              amount_balance:
                group?.group?.group_type === "double"
                  ? parseInt(group?.group?.group_install) *
                      parseInt(group.auctionCount) +
                    parseInt(group?.group?.group_install) -
                    group.totalPaidAmount
                  : parseInt(group?.group?.group_install) +
                    group.totalToBePaidAmount +
                    parseInt(group.dividentHead) -
                    group.totalPaidAmount,
            };
          });
          console.log("formatted all group", formattedData);
          setTableEnrollsData(formattedData);
          // setBasicLoading(false);
        } else {
          setFilteredUsers([]);
        }
      } catch (err) {
        console.log("error total group");
        console.log(err.message);
      }
    }
    getAllGroupReport();
   
    return () => {
      controller.abort(); 
    };
  }, []);
  return (
    <div className="w-screen">
      <div className=" flex mt-20">
        {/* <Sidebar /> */}
        <div className="flex-grow p-7">
          <h1 className="text-2xl font-semibold">All Group Reports</h1>
          <div className="mt-6 mb-8">
            <DataTable
              data={TableEnrollsData}
              columns={Datecolumns}
              exportedFileName={`Employees-${
                TableEnrollsData.length > 0
                  ? TableEnrollsData[0].start_date +
                    " to " +
                    TableEnrollsData[TableEnrollsData.length - 1].start_date
                  : "empty"
              }.csv`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllGroupReport;
