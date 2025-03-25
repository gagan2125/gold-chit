// import React, { useEffect, useState } from "react";
// import Datatable from "../components/layouts/Datatable";
// import api from "../instance/TokenInstance";

// const Test = () => {
//   const [groups, setGroups] = useState([]);
//   const data = [
//     {
//       id: 1,
//       name: "John Doe",
//       type: 30,
//       value: "New York",
//       installment: 2000,
//       members: 50,
//       action: "",
//     },
//   ];

//   const columns = [
//     { key: "id", header: "SL. NO" },
//     { key: "name", header: "Group Name" },
//     { key: "type", header: "Group Type" },
//     { key: "value", header: "Group Value" },
//     { key: "installment", header: "Group Installment" },
//     { key: "members", header: "Group Members" },
//     { key: "action", header: "Action" },
//   ];

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await api.get("/group/get-group-admin");
//         const formattedData = response.data.map((group, index) => ({
//           id: index + 1,
//           name: group.group_name,
//           type: group.group_type,
//           value: group.group_value,
//           installment: group.group_install,
//           members: group.group_members,
//           action: "",
//         }));
//         setGroups(formattedData);
//       } catch (error) {
//         console.error("Error fetching group data:", error);
//       }
//     };
//     fetchGroups();
//   }, []);

//   const testData = [
//     "one",
//     "two",
//     "three",
//     "four",
//     "five",
//     "six",
//     "seven",
//     "eight",
//     "nine",
//     "ten",
//     "eleven",
//     "twelve",
//   ];
//   const [searchQuery,setSearchQuery] = useState(" ")
//   const filteredData = testData.filter((ele)=>ele.toLowerCase().includes(searchQuery.toLowerCase()))
//   return (
//     <>
//       <div className="mt-20 m-10">
//         <input
//           type="search"
//           placeholder="Enter to search"
//           onChange={(e)=>setSearchQuery(e.target.value)}
//         />
//         {filteredData.map((dt) => (
//           <div>{dt}</div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Test;
import React, { useState, useEffect, useRef } from 'react';

const CustomSearchableSelect = ({ 
  options, 
  onChange, 
  value, 
  placeholder = "Select an option" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  
  // Get the selected option label
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setFilteredOptions(options);
    }
  };

  return (
    <div 
      className="custom-select-container relative w-full max-w-md" 
      ref={containerRef}
    >
      <div 
        className="select-header flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white cursor-pointer shadow-sm"
        onClick={toggleDropdown}
      >
        <div className="select-value overflow-hidden text-ellipsis whitespace-nowrap">
          {value ? selectedLabel : placeholder}
        </div>
        <div className="select-arrow">
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path d="M2 4L6 8L10 4" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="select-dropdown absolute z-10 w-full mt-1 border border-gray-300 rounded bg-white shadow-lg max-h-60 overflow-y-auto">
          <div className="search-container p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
              autoFocus
            />
          </div>
          
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`option-item px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    option.value === value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="no-results px-3 py-2 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSearchableSelect;


 //className="flex w-auto p-4 gap-2 justify-center items-center select-none font-semibold bg-gray-100 mb-2 rounded-md" htmlFor={"SS"}