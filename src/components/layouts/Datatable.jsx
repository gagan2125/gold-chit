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
    data.forEach((ele) => {
      tempData[ele._id] = false;
    });
    setActive(tempData);
  }, [data]);

  const onSelectRow = (_id) => {
    const tempActive = { ...active };
    Object.keys(active).forEach((key) => {
      tempActive[key] = false;
    });
    setActive({ ...tempActive, [_id]: true });
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
                background-color: #000;
                color: white;
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
                    <th style="color: #FFD700;">${column.header}</th>
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
    <div className="w-full space-y-6">
      {/* Search and Action Buttons */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-400 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Search className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {isExportEnabled && (
          <div className="flex items-center gap-4">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-5 py-3 rounded-md bg-yellow-600 text-black hover:bg-yellow-500 transition duration-200 shadow-md"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <button
              onClick={printToPDF}
              className="flex items-center gap-2 px-5 py-3 rounded-md bg-yellow-600 text-black hover:bg-yellow-500 transition duration-200 shadow-md"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="border rounded-lg overflow-x-auto shadow-xl bg-black text-white">
        <table className="min-w-full table-auto">
          <thead className="bg-black text-sm text-white">
            <tr>
              {safeColumns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left font-semibold cursor-pointer hover:bg-gray-800"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {sortConfig.key === column.key && (
                      <span className="text-xs text-white">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white text-sm text-black divide-y">
            <tr className="bg-gray-200">
              {safeColumns.map((column) => (
                <td key={`filter-${column.key}`} className="px-6 py-2">
                  {column.key.toLowerCase() !== "action" && (
                    <Select
                      className="w-full max-w-xs bg-gray-100 text-black"
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
                      {[...new Set(safeData.map((item) => item[column.key]))].map(
                        (value) => (
                          <Select.Option key={String(value)} value={String(value)}>
                            {value}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  )}
                </td>
              ))}
            </tr>
            {paginatedData.map((row) => (
              <tr
                key={row._id}
                onClick={() => onSelectRow(row._id)}
                className={`${
                  active[row._id]
                    ? "bg-yellow-500 border-l-4 border-yellow-600"
                    : "hover:bg-gray-100"
                } cursor-pointer`}
              >
                {safeColumns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {row[column.key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Page Size */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            className="p-3 rounded-md bg-yellow-600 text-black hover:bg-yellow-500 transition duration-200"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-3 rounded-md bg-yellow-600 text-black hover:bg-yellow-500 transition duration-200"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Show:</span>
          <Select
            value={pageSize}
            onChange={(value) => setPageSize(value)}
            className="w-32"
          >
            {[100, 200, 300, 500].map((size) => (
              <Select.Option key={size} value={size}>
                {size} items
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
