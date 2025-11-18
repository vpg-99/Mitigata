// import { useState } from 'react'
import { useState, useEffect, useMemo, useRef } from "react";
import StatCard from "./components/StatCard";
import { FiUsers, FiUserCheck, FiUserMinus, FiUserX } from "react-icons/fi";
import { getData } from "./server/api";
import type { Record, Status } from "./types";
import SearchBar from "./components/UI/searchBar";
import DropDown from "./components/UI/dropDown";
import DateRangeFilter from "./components/UI/dateRangeFilter";
import TableHeader from "./components/TableHeader";
import TableRow from "./components/TableRow";
import { parseRecordDate } from "./utils/dateUtils";
import Pagination from "./components/UI/pagination";

const StatusOptions = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

export default function App() {
  const [data, setData] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [visibleRows, setVisibleRows] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  const incrementSize = 5;
  const itemsPerPage = 10;

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data as Record[]);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((record) => {
      const matchesSearch =
        !search ||
        record.about.name.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus = status === "ALL" || record.about.status === status;

      // Date range filter
      let matchesDateRange = true;
      if (startDate && endDate) {
        const recordDate = parseRecordDate(record.details.date);
        matchesDateRange = recordDate >= startDate && recordDate <= endDate;
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Then, sort the filtered data
    if (!sortColumn) return filtered;

    return [...filtered].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortColumn) {
        case "name":
          aValue = a.about.name;
          bValue = b.about.name;
          break;
        case "email":
          aValue = a.about.email;
          bValue = b.about.email;
          break;
        case "date":
          aValue = parseRecordDate(a.details.date);
          bValue = parseRecordDate(b.details.date);
          break;
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

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, search, status, startDate, endDate, sortColumn, sortDirection]);

  useEffect(() => {
    setPage(1);
    setVisibleRows(5); // Reset to show 5 rows when filters change
  }, [search, status, startDate, endDate, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + visibleRows; // Use visibleRows instead of itemsPerPage
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, page, itemsPerPage, visibleRows]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setVisibleRows(5); // Reset to 5 rows when manually changing pages
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    setVisibleRows(5); // Reset to show 5 rows
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
      setPage(1);
      setVisibleRows(5); // Reset to show 5 rows
    }
  };

  const handleBlock = (id: string) => {
    // Update the user's status to BLOCKED
    const user = data.find((record) => record.id === id);
    if (!user) return;
    setData((prevData) =>
      prevData.map((record) =>
        record.id === id
          ? { ...record, about: { ...record.about, status: "BLOCKED" } }
          : record
      )
    );
  };

  const handleActivate = (id: string) => {
    // Update the user's status to ACTIVE
    setData((prevData) =>
      prevData.map((record) =>
        record.id === id
          ? { ...record, about: { ...record.about, status: "ACTIVE" } }
          : record
      )
    );
  };

  const handleInactive = (id: string) => {
    // Update the user's status to inactive
    const user = data.find((record) => record.id === id);
    if (!user) return;
    setData((prevData) =>
      prevData.map((record) =>
        record.id === id
          ? { ...record, about: { ...record.about, status: "INACTIVE" } }
          : record
      )
    );
  };

  const loadMoreRows = () => {
    // Prevent multiple simultaneous loads
    if (isLoadingMore) return;

    setIsLoadingMore(true);

    const currentPageStart = (page - 1) * itemsPerPage;
    const currentPageData = filteredAndSortedData.slice(
      currentPageStart,
      currentPageStart + itemsPerPage
    );
    const maxRowsInCurrentPage = currentPageData.length;

    // Only load more if there are more rows to show in current page
    if (visibleRows < maxRowsInCurrentPage) {
      setVisibleRows((prev) =>
        Math.min(prev + incrementSize, maxRowsInCurrentPage)
      );
    }
    setTimeout(() => setIsLoadingMore(false), 300);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreRows();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 1.0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [visibleRows, page, filteredAndSortedData, isLoadingMore]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-col">
            <h1 className="text-3xl font-bold text-black">User Details</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Information about a user, including name, email, start date,
              inviter, status, and available actions.
            </p>
          </div>
          <button className="bg-gray-950 text-white px-4 py-2 rounded-md">
            Download Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={data.length.toString()}
            icon={<FiUsers size={24} />}
          />
          <StatCard
            title="Active Users"
            value={data
              .filter((record) => record.about.status === "ACTIVE")
              .length.toString()}
            icon={<FiUserCheck size={24} />}
          />
          <StatCard
            title="Inactive Users"
            value={`${data
              .filter((record) => record.about.status === "INACTIVE")
              .length.toString()}%`}
            icon={<FiUserMinus size={24} />}
          />
          <StatCard
            title="Blocked Users"
            value={`${data
              .filter((record) => record.about.status === "BLOCKED")
              .length.toString()}%`}
            icon={<FiUserX size={24} />}
          />
        </div>
        <div className="flex justify-between items-center mb-6 gap-4">
          <SearchBar
            placeholder="Search by name"
            value={search}
            onChange={setSearch}
            setPage={setPage}
          />
          <div className="flex items-center gap-2">
            {(startDate || endDate || search || status !== "ALL") && (
              <div className="">
                <p
                  className="text-sm text-blue-500 cursor-pointer"
                  onClick={() => {
                    clearFilters();
                  }}
                >
                  Clear All Filters
                </p>
              </div>
            )}
            <DropDown
              options={StatusOptions}
              onChange={(value) => setStatus(value as Status)}
              value={status}
              setPage={setPage}
            />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              setPage={setPage}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <TableHeader
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No records found
            </div>
          ) : (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "400px" }}
              ref={scrollContainerRef}
            >
              <div>
                {paginatedData.map((record) => (
                  <TableRow
                    key={record.id}
                    record={record}
                    onBlock={handleBlock}
                    onActivate={handleActivate}
                    onInactive={handleInactive}
                  />
                ))}

                {(() => {
                  const currentPageStart = (page - 1) * itemsPerPage;
                  const currentPageData = filteredAndSortedData.slice(
                    currentPageStart,
                    currentPageStart + itemsPerPage
                  );
                  const hasMoreRows = visibleRows < currentPageData.length;

                  return hasMoreRows ? (
                    <div ref={sentinelRef} className="h-1" />
                  ) : null;
                })()}
              </div>
            </div>
          )}
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalItems={filteredAndSortedData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
