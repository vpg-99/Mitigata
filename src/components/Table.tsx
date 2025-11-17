import { useState } from "react";
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
  const recordsPerPage = 10;

  // Helper function to parse date in "30 Dec 2024" format
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
      //   case "id":
      //     aValue = parseInt(a.id);
      //     bValue = parseInt(b.id);
      //     return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
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

  // Pagination
  const totalPages = Math.ceil(sortedData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = sortedData.slice(startIndex, endIndex);

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
            {/* <div className="calendar-icon"> */}
            {/* <FiCalendar size={16} /> */}
            {/* </div> */}
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
            {/* <div className="calendar-icon" /> */}
            {/* <FiCalendar size={16} /> */}
            {/* </div> */}
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
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
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
              <th onClick={() => handleSort("invitedBy")} className="sortable">
                Invited by {getSortIcon("invitedBy")}
              </th>
              <th onClick={() => handleSort("status")} className="sortable">
                Status {getSortIcon("status")}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <tr key={record.id}>
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
                        onClick={() =>
                          handleStatusUpdate(record.id, "INACTIVE")
                        }
                      >
                        <FiInfo size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="no-results">
                  No records found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
