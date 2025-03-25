import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar";
import { FaWhatsapp } from "react-icons/fa";
const subMenus = [
  {
    title: "Promotion Login",
    link: "https://app.whatsapppromotion.net/login",
    icon: <FaWhatsapp size={20} />,
  },
  {
    title: "Advertisement",
    link: "/marketing/what-add",
    icon: <FaWhatsapp size={20} />,
  },
  {
    title: "Failed Users",
    link: "/marketing/failed-whatuser",
    red: true,
    icon: <FaWhatsapp size={20} className="text-red-00" />,
  },
];
const Marketing = () => {
  return (
    <div>
      <div className="w-screen flex mt-20">
        <Sidebar />
        <div className="flex-grow">
          <div className="w-[300px] bg-gray-50 min-h-screen max-h-auto p-4">
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

export default Marketing;
