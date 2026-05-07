import { useEffect, useMemo, useState } from "react";
import {
  getAllContent,
  updateContentStatus,
} from "../../services/content.service";

export default function PrincipalDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fetch Data
  const fetchData = async () => {
    try {
      const res = await getAllContent();
      const content = res.data;

      setData(content);

      setStats({
        total: content.length,
        pending: content.filter(
          (i) => i.status === "pending"
        ).length,
        approved: content.filter(
          (i) => i.status === "approved"
        ).length,
        rejected: content.filter(
          (i) => i.status === "rejected"
        ).length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(
    data.length / itemsPerPage
  );

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return data.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [data, currentPage]);

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      setProcessingId(id);

      await updateContentStatus(id, {
        status: "approved",
        rejectionReason: "",
      });

      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    const reason = prompt(
      "Enter rejection reason"
    );

    if (!reason) return;

    try {
      setProcessingId(id);

      await updateContentStatus(id, {
        status: "rejected",
        rejectionReason: reason,
      });

      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <p className="p-6">Loading...</p>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* ✅ Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total" value={stats.total} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Approved" value={stats.approved} />
        <Card title="Rejected" value={stats.rejected} />
      </div>

      {/* ✅ Table */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">

        <h2 className="text-xl font-bold mb-4">
          All Content
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">
                Title
              </th>

              <th className="border p-3">
                Subject
              </th>

              <th className="border p-3">
                Status
              </th>

              <th className="border p-3">
                Reason
              </th>

              <th className="border p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="text-center hover:bg-gray-50"
              >
                <td className="border p-3">
                  {item.title}
                </td>

                <td className="border p-3">
                  {item.subject}
                </td>

                <td className="border p-3">
                  <StatusBadge
                    status={item.status}
                  />
                </td>

                <td className="border p-3">
                  {item.rejectionReason || "-"}
                </td>

                <td className="border p-3 space-x-2">

                  <button
                    disabled={
                      item.status !==
                        "pending" ||
                      processingId === item.id
                    }
                    onClick={() =>
                      handleApprove(item.id)
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
                  >
                    Approve
                  </button>

                  <button
                    disabled={
                      item.status !==
                        "pending" ||
                      processingId === item.id
                    }
                    onClick={() =>
                      handleReject(item.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:bg-gray-300"
                  >
                    Reject
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination */}
        <div className="flex justify-between items-center mt-6">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <p className="font-medium">
            Page {currentPage} of {totalPages}
          </p>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
}

/* ✅ Card */
const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <h3 className="text-gray-500">
      {title}
    </h3>

    <p className="text-2xl font-bold">
      {value}
    </p>
  </div>
);

/* ✅ Status Badge */
const StatusBadge = ({ status }) => {
  const styles = {
    pending:
      "bg-yellow-200 text-yellow-800",

    approved:
      "bg-green-200 text-green-800",

    rejected:
      "bg-red-200 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
};