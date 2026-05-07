import { useEffect, useState } from "react";
import { getMyContent } from "../../services/content.service";
import { useAuth } from "../../context/AuthContext";

export default function MyContent() {
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Pagination
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 5;

  // ✅ Fetch Teacher Content
  const fetchContent = async () => {
    try {
      console.log("USER:", user);

      const teacherId = Number(user?.id);

      console.log("Teacher ID:", teacherId);

      const res = await getMyContent(
        teacherId
      );

      console.log("API DATA:", res.data);

      setData(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Wait until user exists
  useEffect(() => {
    if (user?.id) {
      fetchContent();
    }
  }, [user]);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(
    data.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Loading
  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <h1 className="text-2xl font-bold">
          My Content
        </h1>

        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
          Total: {data.length}
        </div>

      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500">
            No content found
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">

            <table className="w-full border-collapse">
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

                    {/* Image */}
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

                      <div className="my-1">
                        →
                      </div>

                      <div>
                        {item.endTime}
                      </div>
                    </td>

                    {/* Reason */}
                    <td className="p-3 border">
                      {item.rejectionReason ||
                        "-"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-between items-center mt-5">

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
      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};