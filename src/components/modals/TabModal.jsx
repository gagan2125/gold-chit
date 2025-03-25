import React from "react";
import { IoMdClose } from "react-icons/io";
const TabModal = ({ children, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="w-full h-full fixed flex bg-white top-1 mt-32">
        <div className="p-6 w-full h-full">{children}</div>
        <div className="text-gray-700 text-3xl bg-gray-200 rounded-3xl absolute top-2 right-2 hover:bg-gray-300 z-20">
          <IoMdClose onClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default TabModal;
