import React from "react";
import { Outlet } from "react-router-dom";

const AppSettings = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default AppSettings;
