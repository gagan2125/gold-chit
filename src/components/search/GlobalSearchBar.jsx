import React from 'react'
import { FaSearch } from "react-icons/fa";
const GlobalSearchBar = ({onGlobalSearchChangeHandler,visibility}) => {
  console.log("visibility",visibility)
  if(!visibility) return null;
  return (
    <div className="relative w-full max-w-md">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        placeholder="Enter to search..."
        onChange={(e) => onGlobalSearchChangeHandler(e)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
  )
}

export default GlobalSearchBar