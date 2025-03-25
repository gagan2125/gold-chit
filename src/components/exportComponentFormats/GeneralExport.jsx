import React from "react";
import { FaDownload } from "react-icons/fa";
import { IoMdPrint } from "react-icons/io";
import { BiLogoGmail } from "react-icons/bi";
import { FaWhatsappSquare } from "react-icons/fa";
const GeneralExport = ({onDownloadPdf,onPrintReceipt,onSendGmail}) => {
  return (
    <div className=" m-11 bg-white shadow-lg z-10 flex flex-col rounded-lg p-4">
      <div >
        <div className="flex flex-col items-center p-4 max-w-full bg-green-50 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <FaWhatsappSquare color="green" className="w-10 h-10" />
            <h2 className="text-lg font-semibold text-gray-800">WhatsApp</h2>
          </div>

          <div className="flex items-center space-x-2 h-1/2">
            <input
              type="checkbox"
              checked={true}
              className="text-green-500 ring-2 ring-green-700 rounded-full w-4 h-4"
            />
            <span className="text-green-800 font-semibold select-none">
              Whatsapp Message Sent Successfully
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-around items-center space-x-8 py-6">

  <div className="flex flex-col items-center text-center" onClick={onDownloadPdf}>
    <div className="p-3 bg-blue-50 rounded-full shadow-lg hover:bg-blue-100 transition duration-300">
      <FaDownload className="text-blue-800 text-2xl" />
    </div>
    <span className="mt-2 text-lg font-semibold text-blue-800 select-none">Download PDF</span>
  </div>


  <div className="flex flex-col items-center text-center" onClick={onPrintReceipt}>
    <div className="p-3 bg-blue-50 rounded-full shadow-lg hover:bg-blue-100 transition duration-300">
      <IoMdPrint className="text-gray-800 text-2xl" />
    </div>
    <span className="mt-2 text-lg font-semibold text-gray-800 select-none">
      
      Resolving soon...</span> 
  </div>


  <div className="flex flex-col items-center text-center" onClick={onSendGmail}>
    <div className="p-3 bg-blue-50 rounded-full shadow-lg hover:bg-blue-100 transition duration-300">
      <BiLogoGmail className="text-gray-800 text-2xl" />
    </div>
    <span className="mt-2 text-lg font-semibold text-gray-800 select-none">Resolving soon...</span> 
    
  </div>
</div>

    </div>
  );
};

export default GeneralExport;
