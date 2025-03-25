import React, { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import { IoMdClose } from "react-icons/io";
const PrintModal = ({ children, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="w-full h-screen fixed flex bg-white ">
        <Sidebar />
        <div className="p-6">{children}</div>
        <div className="text-gray-700 text-3xl bg-gray-200 rounded-3xl absolute top-2 right-2 hover:bg-gray-300 z-20">
          <IoMdClose onClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default PrintModal;
