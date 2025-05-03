import Sidebar from "../components/layouts/Sidebar";
import { GrGroup } from "react-icons/gr";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { MdGroups, MdOutlinePayments } from "react-icons/md";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { FaUserLock } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import Navbar from "../components/layouts/Navbar";

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsValue, setPaymentsValue] = useState("...");
  const [paymentsPerMonth, setPaymentsPerMonth] = useState([]);
  const [paymentsPerMonthValue, setPaymentsPerMonthValue] = useState("...");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get-agent");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get-user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payment/get-payment");
        const paymentData = response.data;
        const totalAmount = paymentData.reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0
        );
        setPaymentsValue(totalAmount);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(
          2,
          "0"
        )}-01`;
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const lastDayFormatted = lastDay.toISOString().split("T")[0];

        const response = await api.get("/payment/get-report-receipt", {
          params: {
            from_date: firstDay,
            to_date: lastDayFormatted,
          },
        });

        setPaymentsPerMonth(response.data);

        const totalAmount = response.data.reduce((sum, payment) => {
          return sum + Number(payment.amount || 0);
        }, 0);
        setPaymentsPerMonthValue(totalAmount);
      } catch (err) {
        console.error("Error fetching monthly payment data:", err.message);
      }
    };
    fetchMonthlyPayments();
  }, []);

  const cardData = [
    {
      icon: <LiaLayerGroupSolid size={20} />,
      text: "Groups",
      count: groups.length,
      redirect: "/group",
    },
    {
      icon: <MdGroups size={18} />,
      text: "Customers",
      count: users.length,
      redirect: "/user",
    },
    {
      icon: <FaUserLock size={18} />,
      text: "Agents",
      count: agents.length,
      redirect: "/agent",
    },
    {
      icon: <MdOutlinePayments size={18} />,
      text: "Payments",
      count: `₹${paymentsValue}`,
      redirect: "/payment",
    },
    {
      icon: <SlCalender size={18} />,
      text: "Current Month Payments",
      count: `₹${paymentsPerMonthValue}`,
      redirect: "/payment",
    },
  ].filter((ele) =>
    ele.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  return (
    <div className="flex mt-20">
      <Sidebar />
      <Navbar
        onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        visibility={true}
      />
      <div className="flex-grow p-6 bg-white min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((card, index) => (
            <a
              href={card.redirect}
              key={index}
              className={`group flex items-center bg-white border border-[#e8d28f] 
                          p-5 rounded-2xl shadow-md transition-all duration-300 
                          hover:scale-105 hover:shadow-lg hover:border-[#e0b84c]`}
            >
              <div
                className="flex items-center justify-center w-14 h-14 
                           bg-gradient-to-br from-[#f3eac2] to-[#e0c25c] 
                           text-black rounded-full shadow-md group-hover:rotate-2 
                           transition-transform duration-300"
              >
                {card.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#444] group-hover:text-black">
                  {card.text}
                </p>
                <span className="text-lg font-bold text-black">
                  {card.count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
