import { IoIosLogOut } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import { NavbarMenu } from "../../data/menu";
import ResponsiveMenu from "./ResponsiveMenu";
import Modal from "../modals/Modal";
import { AiTwotoneGold } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import GlobalSearchBar from "../search/GlobalSearchBar";

const Navbar = ({ onGlobalSearchChangeHandler = () => {}, visibility = false }) => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="bg-white w-full fixed top-0 left-0 z-10 shadow-md border-b border-gray-200">
        <div className="container flex justify-between items-center py-4 px-6">
          {/* Brand Name */}
          <div className="text-2xl flex items-center gap-1 font-bold uppercase text-gold-700">
            <AiTwotoneGold className="text-yellow-600" />
            <p className="text-black">MyChits</p>
            <p className="text-yellow-600">Gold</p>
          </div>

          {/* Search Bar */}
          <div>
            <GlobalSearchBar
              onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
              visibility={visibility}
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { to: "/reports/group-report", label: "Group Report" },
              { to: "/reports/daybook", label: "Day Book" },
              { to: "/reports/receipt", label: "Receipt Report" },
              { to: "/reports/user-report", label: "Customer Report" },
              { to: "/marketing/what-add", label: "Whatsapp" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-700 font-semibold border-b-2 border-yellow-500"
                    : "text-gray-700 font-medium hover:text-yellow-700 hover:border-b-2 hover:border-yellow-500 transition duration-200"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Navbar Icons */}
          <div className="flex items-center gap-4">
            <button className="text-xl text-gray-800 hover:text-yellow-600 transition duration-200">
              <IoIosNotifications />
            </button>

            <a
              href="/"
              onClick={() => localStorage.clear()}
              className="text-white bg-yellow-600 hover:bg-yellow-500 font-semibold rounded-md px-4 py-2 flex items-center gap-1 transition duration-200"
            >
              <IoIosLogOut size={20} />
            </a>
          </div>

         
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-3xl text-gray-800" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <ResponsiveMenu open={open} menu={NavbarMenu} />

      {/* Modal */}
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="py-6 px-5 lg:px-8 bg-white rounded-lg shadow-xl text-gray-800">
          <h3 className="mb-4 text-xl font-bold text-yellow-700">Business</h3>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm">1. Grocery Shop</p>
            <button className="text-sm text-white bg-green-600 rounded px-3 py-1">Active</button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm">2. Shoe Shop</p>
            <button className="text-sm text-white bg-yellow-500 rounded px-3 py-1">Switch</button>
          </div>

          <hr className="my-4" />

          <h5 className="text-lg font-semibold text-yellow-700 mb-2">Add Business</h5>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter the Business Name"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              className="w-full text-white bg-yellow-600 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Add
            </button>
            <p className="text-sm text-gray-500">
              Confused?{" "}
              <a href="#" className="text-yellow-700 hover:underline">
                Check here!
              </a>
            </p>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
