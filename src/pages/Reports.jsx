import React from "react";
import Sidebar from "../components/layouts/Sidebar";
import {NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
const subMenus = [
  { title: "Daybook", link: "/reports/daybook" },
  { title: "Group Report", link: "/reports/group-report" },
  // { title: "All Group Report", link: "/reports/all-group-report" },
  { title: "Customer Report", link: "/reports/user-report" },
  { title: "Receipt Report", link: "/reports/receipt" },
  { title: "Auction Report", link: "/reports/auction-report" },
  { title: "Lead Report", link: "/reports/lead-report" },
];
const Reports = () => {
  return (
    <div>
      <div className="w-screen flex mt-20">
       
        <Sidebar />
        <div className="flex-grow">
          <div className="w-[300px] bg-gray-50 h-full  p-4">
            {subMenus.map(({ title, link, icon, red }) => (
              <NavLink
                className={({ isActive }) =>
                  `my-2 flex items-center gap-2 font-medium rounded-md hover:bg-gray-300  p-3 ${
                    red ? "text-red-800" : "text-blue-950"
                  } ${isActive ? "bg-gray-200 border-l-8 border-blue-300" : ""}`
                }
                to={link}
              >
                {icon}
                {title}
              </NavLink>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Reports;
