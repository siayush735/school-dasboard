import { useEffect, useState } from "react";
import {
  getAllContent,
  updateContentStatus,
} from "../../services/content.service";
import toast from "react-hot-toast";

export default function Approvals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Reject Modal State
  const [rejectId, setRejectId] = useState(null);
  const [reason, setReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPending();
  }, []);

  // ✅ Fetch Pending Data
  const fetchPending = async () => {
    try {
      const res = await getAllContent();

      const pending = res.data.filter(
        (item) => item.status === "pending"
      );

      setData(pending);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      setProcessingId(id);

      await updateContentStatus(id, {
        status: "approved",
        rejectionReason: "",
      });

      toast.success("Content Approved ✅");

      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Approval failed ❌");
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ Reject
  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Rejection reason required");
      return;
    }

    try {
      setProcessingId(rejectId);

      await updateContentStatus(rejectId, {
        status: "rejected",
        rejectionReason: reason,
      });

      toast.success("Content Rejected ❌");

      setRejectId(null);
      setReason("");

      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ Pagination Logic
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = data.slice(startIndex, endIndex);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Pending Approvals
        </h1>

        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
          Total Pending: {data.length}
        </div>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-10 text-center">
          <p className="text-gray-500 text-lg">
            No pending approvals
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Preview</th>
                  <th className="p-3 border">Title</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Actions</th>
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
                        className="w-20 h-20 object-cover rounded mx-auto"
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

                    {/* Time */}
                    <td className="p-3 border text-sm">
                      <div>
                        <span className="font-semibold">
                          Start:
                        </span>
                        <br />
                        {item.startTime}
                      </div>

                      <div className="mt-2">
                        <span className="font-semibold">
                          End:
                        </span>
                        <br />
                        {item.endTime}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 border">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleApprove(item.id)
                          }
                          disabled={
                            processingId === item.id
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                        >
                          {processingId === item.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          onClick={() =>
                            setRejectId(item.id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* ✅ Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-100
          ">
            <h2 className="text-xl font-bold mb-4">
              Reject Content
            </h2>

            <textarea
              placeholder="Enter rejection reason..."
              className="w-full border rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-red-400"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setRejectId(null);
                  setReason("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={processingId === rejectId}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                {processingId === rejectId
                  ? "Processing..."
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}