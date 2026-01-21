// pages/Admin/ManageUsers/ManageUsers.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import Loading from "../../../components/Shared/Loading";
import api from "../../../utils/api";

const ManageUsers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const response = await api.get(
        `/api/admin/users?page=${page}&limit=10&search=${search}`,
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;
  const totalUsers = data?.totalUsers || 0;

  const prefetchUser = (userId) => {
    queryClient.prefetchQuery({
      queryKey: ["user", userId],
      queryFn: async () => {
        const response = await api.get(`/api/admin/users/${userId}`);
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (isLoading) return <Loading message="Loading Users..." />;

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border rounded px-3 py-2 outline-none text-sm w-full md:w-64"
            placeholder="Search by name or email"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      <div className="hidden md:block bg-white shadow-lg rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
                    onMouseEnter={() => prefetchUser(u._id)}
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 text-sm bg-gray-50">
          <p className="text-gray-600">
            Page {currentPage} of {totalPages} ({totalUsers} total users)
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Prev
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {users.length < 1 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No users found
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              onClick={() => navigate(`/admin/users/${u._id}`)}
              className="bg-white rounded-lg shadow-md border p-4 space-y-3 cursor-pointer hover:shadow-lg transition active:scale-[0.98]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{u.name}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    u.isSuspended
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.isSuspended ? "Suspended" : "Active"}
                </span>

                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    u.isEmailVerified
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {u.isEmailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="text-xs text-gray-500">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}

        <div className="flex flex-col items-center gap-3 pt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalUsers} total users)
          </p>

          <div className="flex gap-2 w-full">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="flex-1 px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Prev
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="flex-1 px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
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
