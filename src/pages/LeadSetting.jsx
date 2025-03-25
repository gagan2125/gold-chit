import React from "react";
import SettingSidebar from "../components/layouts/SettingSidebar";
import { Outlet } from "react-router-dom";

const LeadSetting = () => {
  return (
    <>
      <div>
        <div className="flex mt-20">
          <SettingSidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LeadSetting;
