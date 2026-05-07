import { useEffect, useState } from "react";
import { getAllContent } from "../../services/content.service";

export default function AllContent() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, data]);

  // ✅ Fetch all content
 const fetchData = async () => {
  try {
    const res = await getAllContent();

    console.log("Principal Data:", res.data);

    const content = Array.isArray(res.data)
      ? res.data
      : [];

    setData(content);
    setFiltered(content);

  } catch (err) {
    console.error(err);
    setData([]);
    setFiltered([]);
  } finally {
    setLoading(false);
  }
};

  // ✅ Filter + Search
  const applyFilters = () => {
    let result = [...data];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (item) => item.status === statusFilter
      );
    }

    // Search filter
    if (search.trim()) {
      result = result.filter(
        (item) =>
          item.title
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          item.subject
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFiltered(result);

    // Reset page
    setCurrentPage(1);
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(
    filtered.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentData = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          All Content
        </h1>

        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
          Total: {filtered.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or subject..."
          className="border p-3 rounded-lg w-full md:w-1/2 outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Status Filter */}
        <select
          className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">All Status</option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      {/* Table */}
      {currentData.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500">
            No content found
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">

            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">
                    Preview
                  </th>

                  <th className="p-3 border">
                    Title
                  </th>

                  <th className="p-3 border">
                    Subject
                  </th>

                  <th className="p-3 border">
                    Status
                  </th>

                  <th className="p-3 border">
                    Time
                  </th>

                  <th className="p-3 border">
                    Reason
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="text-center hover:bg-gray-50"
                  >

                    {/* Preview */}
                    <td className="p-3 border">
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded mx-auto"
                      />
                    </td>

                    {/* Title */}
                    <td className="p-3 border font-medium">
                      {item.title}
                    </td>

                    {/* Subject */}
                    <td className="p-3 border">
                      {item.subject}
                    </td>

                    {/* Status */}
                    <td className="p-3 border">
                      <StatusBadge
                        status={item.status}
                      />
                    </td>

                    {/* Time */}
                    <td className="p-3 border text-sm">
                      <div>
                        {item.startTime}
                      </div>

                      <div className="mt-1">
                        →
                      </div>

                      <div>
                        {item.endTime}
                      </div>
                    </td>

                    {/* Rejection Reason */}
                    <td className="p-3 border">
                      {item.rejectionReason ||
                        "-"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            <p className="font-medium">
              Page {currentPage} of{" "}
              {totalPages || 1}
            </p>

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
}

/* ✅ Status Badge */
const StatusBadge = ({ status }) => {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-700",

    approved:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};