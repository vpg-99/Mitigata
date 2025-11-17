import React, { useState, useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { Record, Status } from "../types";
import "./Table.css";
import {
  FiUsers,
  FiUserCheck,
  FiUserMinus,
  FiUserX,
  FiSearch,
  FiSlash,
  FiCheck,
  FiInfo,
  FiChevronDown,
} from "react-icons/fi";
import { FcClearFilters } from "react-icons/fc";

interface TableProps {
  data: Record[];
}

type SortField = "name" | "email" | "date" | "invitedBy" | "status";
type SortDirection = "asc" | "desc";

const Table = ({ data }: TableProps) => {
  const [records, setRecords] = useState<Record[]>(data);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");
  const [searchName, setSearchName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [displayCount, setDisplayCount] = useState(5); 
  const recordsPerPage = 10;

  const parseDate = (dateString: string): Date => {
    const months: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const parts = dateString.split(" ");
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);

    return new Date(year, month, day);
  };

  // Filter records by status, name search, and date range
  const filteredData = records.filter((record) => {
    // Status filter
    const statusMatch =
      filterStatus === "ALL" || record.about.status === filterStatus;

    // Name search filter
    const nameMatch = record.about.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    // Date range filter
    let dateMatch = true;
    if (dateFrom || dateTo) {
      const recordDate = parseDate(record.details.date);
      recordDate.setHours(0, 0, 0, 0);

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        dateMatch = dateMatch && recordDate >= fromDate;
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && recordDate <= toDate;
      }
    }

    return statusMatch && nameMatch && dateMatch;
  });

  // Sort records
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "name":
        aValue = a.about.name;
        bValue = b.about.name;
        break;
      case "email":
        aValue = a.about.email;
        bValue = b.about.email;
        break;
      case "date":
        aValue = parseDate(a.details.date).getTime();
        bValue = parseDate(b.details.date).getTime();
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      case "invitedBy":
        aValue = a.details.invitedBy;
        bValue = b.details.invitedBy;
        break;
      case "status":
        aValue = a.about.status;
        bValue = b.about.status;
        break;
      default:
        return 0;
    }

    const comparison =
      typeof aValue === "string" && typeof bValue === "string"
        ? aValue.localeCompare(bValue)
        : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination with progressive loading
  const totalPages = Math.ceil(sortedData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const pageRecords = sortedData.slice(startIndex, endIndex);

  const currentRecords = pageRecords.slice(
    0,
    Math.min(displayCount, pageRecords.length)
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusClass = (status: Status): string => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "⇅";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const handleClearFilters = () => {
    setFilterStatus("ALL");
    setSearchName("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
    setDisplayCount(5);
  };

  // Reset display count when page changes
  useEffect(() => {
    setDisplayCount(5);
  }, [currentPage]);

  // Reset display count and page when filters change
  useEffect(() => {
    setDisplayCount(5);
    setCurrentPage(1);
  }, [searchName, filterStatus, dateFrom, dateTo, sortField, sortDirection]);

  // Handle end reached - load more items
  const handleEndReached = () => {
    if (displayCount < recordsPerPage && displayCount < pageRecords.length) {
      setDisplayCount((prev) => Math.min(prev + 5, recordsPerPage));
    }
  };

  const handleStatusUpdate = (recordId: string, newStatus: Status) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === recordId
          ? { ...record, about: { ...record.about, status: newStatus } }
          : record
      )
    );
  };

  // Calculate statistics
  const totalUsers = records.length;
  const activeCount = records.filter((r) => r.about.status === "ACTIVE").length;
  const inactiveCount = records.filter(
    (r) => r.about.status === "INACTIVE"
  ).length;
  const blockedCount = records.filter(
    (r) => r.about.status === "BLOCKED"
  ).length;
  const inactivePercentage = ((inactiveCount / totalUsers) * 100).toFixed(0);
  const blockedPercentage = ((blockedCount / totalUsers) * 100).toFixed(0);

  return (
    <div className="table-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">User Details</h1>
          <p className="page-description">
            Information about a user, including name, email, start date,
            inviter, status, and available actions.
          </p>
        </div>
        <button className="download-report-btn">Download Report</button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon stat-icon-total">
            <FiUsers size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{totalUsers}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-active">
            <FiUserCheck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{activeCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-inactive">
            <FiUserMinus size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Inactive Users</div>
            <div className="stat-value">{inactivePercentage}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-blocked">
            <FiUserX size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Blocked Users</div>
            <div className="stat-value">{blockedPercentage}%</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <div className="search-icon">
            <FiSearch size={20} color="black" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchName}
            className="search-input"
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-controls-right">
          <div className="select-wrapper">
            <select
              value={filterStatus}
              className="filter-select"
              onChange={(e) => {
                setFilterStatus(e.target.value as Status | "ALL");
                setCurrentPage(1);
              }}
            >
              <option value="ALL">Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>
            <FiChevronDown className="select-icon" size={16} />
          </div>

          <div className="date-filter">
            <input
              type="date"
              value={dateFrom}
              className="date-input"
              placeholder="From Date"
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="date-filter">
            <input
              type="date"
              value={dateTo}
              className="date-input"
              placeholder="To Date"
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
            title="Clear all filters"
          >
            <FcClearFilters size={20} />
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {currentRecords.length > 0 ? (
          <TableVirtuoso
            style={{ height: "450px" }}
            data={currentRecords}
            endReached={handleEndReached}
            overscan={100}
            increaseViewportBy={{ top: 0, bottom: 200 }}
            components={{
              Table: (props) => <table {...props} className="data-table" />,
              TableBody: React.forwardRef((props, ref) => (
                <tbody {...props} ref={ref} />
              )),
            }}
            fixedHeaderContent={() => (
              <tr>
                <th onClick={() => handleSort("name")} className="sortable">
                  Name {getSortIcon("name")}
                </th>
                <th onClick={() => handleSort("email")} className="sortable">
                  Email {getSortIcon("email")}
                </th>
                <th onClick={() => handleSort("date")} className="sortable">
                  Start Date {getSortIcon("date")}
                </th>
                <th
                  onClick={() => handleSort("invitedBy")}
                  className="sortable"
                >
                  Invited by {getSortIcon("invitedBy")}
                </th>
                <th onClick={() => handleSort("status")} className="sortable">
                  Status {getSortIcon("status")}
                </th>
                <th>Action</th>
              </tr>
            )}
            itemContent={(_index, record) => (
              <>
                <td className="name-cell">{record.about.name}</td>
                <td className="email-cell">{record.about.email}</td>
                <td>{record.details.date}</td>
                <td>{record.details.invitedBy}</td>
                <td>
                  <span className={getStatusClass(record.about.status)}>
                    {record.about.status === "ACTIVE"
                      ? "Active"
                      : record.about.status === "INACTIVE"
                      ? "Inactive"
                      : "Blocked"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn-block"
                      title="Block User"
                      onClick={() => handleStatusUpdate(record.id, "BLOCKED")}
                    >
                      <FiSlash size={16} />
                    </button>
                    <button
                      className="action-btn action-btn-approve"
                      title="Activate User"
                      onClick={() => handleStatusUpdate(record.id, "ACTIVE")}
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      className="action-btn action-btn-info"
                      title="View Details"
                      onClick={() => handleStatusUpdate(record.id, "INACTIVE")}
                    >
                      <FiInfo size={16} />
                    </button>
                  </div>
                </td>
              </>
            )}
          />
        ) : (
          <div className="no-results-container">
            <p className="no-results">No records found matching your filters</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="First page"
        >
          ≪
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Previous page"
        >
          ‹
        </button>

        <span className="page-label">Page</span>

        <div className="page-select-wrapper">
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="page-select"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <FiChevronDown className="page-select-icon" size={14} />
        </div>

        <span className="page-label">of {totalPages}</span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Next page"
        >
          ›
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Last page"
        >
          ≫
        </button>
      </div>
    </div>
  );
};

export default Table;
