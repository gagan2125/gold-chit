import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CircularLoader from "../loaders/CircularLoader";
import { Select } from "antd";
const DataTable = ({
  updateHandler = () => {},
  catcher = "_id",
  isExportEnabled = true,
  data = [],
  columns = [],
  exportedFileName = "export.csv",
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pageSize, setPageSize] = useState(100);
  useEffect(() => {
    const tempData = {};
    data.forEach((ele, index) => {
      tempData[ele._id] = false;
    });
    setActive(tempData);
  }, [data]);
  const onSelectRow = (_id) => {
   
      const tempActive = active
      if(Object.keys(active)){
      Object.keys(active).forEach((key) => {
        tempActive[key] = false;
      });
      setActive({ ...tempActive, [_id]: true });
    }
    
  };
  const searchData = (data) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filterData = (data) => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase() === value.toLowerCase();
      });
    });
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const processedData = useMemo(() => {
    let processed = [...safeData];
    processed = searchData(processed);
    processed = filterData(processed);
    processed = sortData(processed);
    return processed;
  }, [safeData, searchQuery, filters, sortConfig]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportToExcel = () => {
    const headers = safeColumns.map((col) => col.header).join(",");
    const rows = processedData
      .map((item) => safeColumns.map((col) => item[col.key]).join(","))
      .join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportedFileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const changeColor = (index) => {
    return index % 2 === 0;
  };
  const printToPDF = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
          <style>
            @media print {
              body * {
                visibility: hidden;
              }
              #print-section, #print-section * {
                visibility: visible;
              }
              #print-section {
                position: absolute;
                left: 0;
                top: 0;
              }
              @page {
                size: auto;
                margin: 20mm;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              thead {
                background-color: #f3f4f6;
              }
            }
          </style>
          <div id="print-section">
            <table>
              <thead>
                <tr>
                  ${safeColumns
                    .map(
                      (column) => `
                    <th>${column.header}</th>
                  `
                    )
                    .join("")}
                </tr>
              </thead>
              <tbody>
                ${processedData
                  .map(
                    (row) => `
                  <tr>
                    ${safeColumns
                      .map(
                        (column) => `
                      <td>${row[column.key] || "-"}</td>
                    `
                      )
                      .join("")}
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `;

    document.body.appendChild(printContent);
    window.print();
    document.body.removeChild(printContent);
  };

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!safeData.length || !safeColumns.length) {
    return <CircularLoader />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-500 absolute right-3" />
        </div>

        {isExportEnabled && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 rounded-md 
    bg-[#217346] hover:bg-[#1a5c38] text-white 
    transition-colors duration-200 
    shadow-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button
              onClick={printToPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-700 hover:bg-green-900 text-white 
    transition-colors duration-200 
    shadow-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print PDF
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {safeColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortConfig.key === column.key && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="bg-gray-50">
              {safeColumns.map((column) => (
                <td key={`filter-${column.key}`} className="px-6 py-2">
                  {column.key.toLowerCase() !== "action" && (
                    <Select
                    className="w-full max-w-xs "
                    popupMatchSelectWidth={false}
                      showSearch
                      value={filters[column.key] || ""}
                      onChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          [column.key]: value,
                        }))
                        
                      }
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                     
                    >
                      <Select.Option value="">All</Select.Option>
                      {[
                        ...new Set(safeData.map((item) => item[column.key])),
                      ].map((value) => {
                        return (
                          <Select.Option
                            key={String(value)}
                            value={String(value)}
                          >
                            {value}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </td>
              ))}
            </tr>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onSelectRow(row._id)}
                className={`${
                  active[row._id]
                    ? "bg-blue-200"
                    : changeColor(index)
                    ? "hover:bg-gray-200 bg-gray-100"
                    : " hover:bg-gray-200 bg-white" //
                } cursor-pointer `}
              >
                {safeColumns.map((column) => (
                  <td
                    key={`${index}-${column.key}`}
                    className="px-6 py-4"
                    onDoubleClick={() => {
                      console.log("row", row);
                      updateHandler(row[catcher]);
                    }}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-7 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
