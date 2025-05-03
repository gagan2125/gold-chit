import React, { useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { BsCash } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { IoIosSettings } from "react-icons/io";
import { IoIosHelpCircle } from "react-icons/io";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleArrows, FaLayerGroup, FaUserLock } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { IoPeopleOutline } from "react-icons/io5";
import { TiSpanner } from "react-icons/ti";
import { Link } from "react-router-dom";
import { Fragment } from "react";
const MenuSidebar = [
  { title: "Dashboard", icon: <RiDashboardFill />, link: "/dashboard" },
  {
    title: "Analytics",
    icon: <SiGoogleanalytics />,
    link: "/analytics",
  },
  {
    title: "App Settings ",
    spacing: true,
    icon: <TiSpanner />,
    submenu: true,
    submenuItems: [{ title: "Groups", link: "app-settings/groups" }],
    // link: "/group",
  },
  {
    title: "Leads",
    spacing: true,
    icon: <IoPeopleOutline />,
    link: "/lead",
  },
  { title: "Payments ", icon: <BsCash />, link: "/payment" },

  {
    id: "$2",
    title: "Group breakdown ",
    spacing: true,
    icon: <TbCategoryPlus />,
    link: "/group-breakdown",
  },

  {
    title: "Profile",
    spacing: true,
    icon: <CgProfile />,
    link: "/profile",
  },
  { title: "Help & Support", icon: <IoIosHelpCircle />, link: "/help" },
];

const SettingSidebar = () => {
  const [open, setOpen] = useState(true);
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);
  const toggleSubMenu = (index) => {
    if (submenuOpenIndex === index) {
      setSubmenuOpenIndex(null);
    } else {
      setSubmenuOpenIndex(index);
    }
  };
  return (
    <>
      <div
        className={`bg-secondary h-auto p-5 pt-8 ${
          open ? "w-64" : "w-20"
        } duration-300 relative`}
      >
        <BsArrowLeftShort
          className={`bg-white text-secondary text-3xl rounded-full absolute -right-3 top-9 border border-secondary cursor-pointer ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex">
          <GiGoldBar
            className={`bg-amber-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h3
            className={`text-white origin-left font-medium text-2xl ${
              !open && "scale-0"
            } duration-300 `}
          >
            Settings
          </h3>
        </div>

        <ul className="pt-2">
          {MenuSidebar.map((menu, index) => (
            <>
              <a href={menu.link}>
                <li
                  key={index}
                  className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${
                    menu.spacing ? "mt-9" : "mt-2"
                  }`}
                >
                  <span className="text-2xl block float-left">{menu.icon}</span>
                  <span
                    className={`text-base font-medium flex-1 ${
                      !open && "hidden"
                    } `}
                    onClick={() => toggleSubMenu(index)}
                  >
                    {menu.title}
                  </span>
                  {menu.submenu && open && (
                    <BsChevronDown
                      className={`${submenuOpenIndex && "rotate-180"}`}
                      onClick={() => toggleSubMenu(index)}
                    />
                  )}
                </li>
              </a>
              {menu.submenu && submenuOpenIndex === index && open && (
                <ul>
                  {menu.submenuItems.map((submenuItem, index) => (
                    <>
                      <Link to={submenuItem.link}>
                        <li
                          key={index}
                          className={`text-gray-100 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white rounded-md ${
                            menu.spacing ? "mt-2" : "mt-2"
                          }`}
                        >
                          {submenuItem.title}
                        </li>
                      </Link>
                    </>
                  ))}
                </ul>
              )}
            </>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SettingSidebar;
