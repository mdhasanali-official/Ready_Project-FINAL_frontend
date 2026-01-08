import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Shared/Loading";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const baseURL = import.meta.env.VITE_DataHost;
  const navigate = useNavigate();

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${baseURL}/api/admin/users?page=${page}&limit=10&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setUsers(data.users || []);
      setMeta(data.meta || {});
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => fetchUsers(1);

  if (loading) return <Loading message="Loading Users..." />;

  return (
    <div className="w-full px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Manage Users
          </h1>
          <p className="text-gray-500 text-sm">
            View, manage and control all registered users
          </p>
        </div>

        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 outline-none text-sm w-52 md:w-64"
            placeholder="Search by name or email"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Email Verified</th>
                <th className="py-3 px-4 text-left">Created</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {users.length < 1 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-indigo-50/40 cursor-pointer transition"
                    onClick={() => navigate(`/admin/users/${u._id}`)}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{u.email}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          u.isSuspended
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {u.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          u.isEmailVerified
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {u.isEmailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 text-sm">
          <p className="text-gray-600">
            Page {meta.page || 1} of {meta.totalPages || 1}
          </p>

          <div className="flex gap-2">
            <button
              disabled={!meta.prevPage}
              onClick={() => fetchUsers(meta.prevPage)}
              className="px-3 py-2 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              Prev
            </button>

            <button
              disabled={!meta.nextPage}
              onClick={() => fetchUsers(meta.nextPage)}
              className="px-3 py-2 border rounded disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
