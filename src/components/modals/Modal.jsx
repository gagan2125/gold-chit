/* eslint-disable react/prop-types */
import { IoMdClose } from "react-icons/io";
const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  return (
    <>
 <div 
  className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-10"
  onClick={handleClose}
>
  <div className="w-[600px] max-h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden">
    <button
      className="text-gray-700 text-2xl absolute top-2 right-2 hover:bg-gray-100 z-20"
      onClick={() => onClose()}
    >
      <IoMdClose />
    </button>
    <div className="bg-white p-2 rounded overflow-y-auto 
      [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      {children}
    </div>
  </div>
</div>
    </>
  );
};

export default Modal;
