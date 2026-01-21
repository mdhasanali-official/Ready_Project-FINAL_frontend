// pages/Admin/ManageUsers/UserDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Loading from "../../../components/Shared/Loading";
import api from "../../../utils/api";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
  });

  const user = userData?.user;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    isEmailVerified: user?.isEmailVerified || false,
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData) => {
      const response = await api.put(`/api/admin/users/${id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
      queryClient.invalidateQueries(["users"]);
      toast.success("User updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update user!");
    },
  });

  const suspendMutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/api/admin/users/${id}/suspend`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
      queryClient.invalidateQueries(["users"]);
      toast.success("User status updated!");
    },
    onError: () => {
      toast.error("Failed to update status!");
    },
  });

  const updateUser = () => {
    updateMutation.mutate({
      name: form.name,
      isEmailVerified: form.isEmailVerified,
    });
  };

  const toggleSuspend = () => {
    suspendMutation.mutate();
  };

  if (isLoading) return <Loading message="Loading User Details..." />;

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2 border rounded hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-7 border max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            User Management Panel
          </h1>
          <p className="text-gray-500 text-sm">
            Manage user profile, email verification & suspension
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 border rounded hover:bg-gray-100 whitespace-nowrap"
        >
          Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-7 text-sm">
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-1">
            Profile Information
          </h2>

          <div>
            <label className="font-semibold">Full Name</label>
            <input
              className="border rounded px-3 py-2 w-full outline-none mt-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              disabled
              className="border rounded px-3 py-2 w-full bg-gray-100 mt-1 cursor-not-allowed"
              value={form.email}
            />
          </div>

          <div>
            <label className="font-semibold">Email Verified</label>

            <div className="flex items-center gap-3 mt-1">
              <div
                onClick={() =>
                  setForm({
                    ...form,
                    isEmailVerified: !form.isEmailVerified,
                  })
                }
                className={`w-12 h-6 rounded-full cursor-pointer transition ${
                  form.isEmailVerified ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`h-6 w-6 bg-white rounded-full shadow transition ${
                    form.isEmailVerified ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>

              <span className="text-gray-700">
                {form.isEmailVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700 border-b pb-1">
            Account Information
          </h2>

          <p>
            <b>Status:</b>{" "}
            <span
              className={`px-3 py-1 rounded text-sm ${
                user.isSuspended
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.isSuspended ? "Suspended" : "Active"}
            </span>
          </p>

          <p>
            <b>Role:</b> {user.role}
          </p>

          <p>
            <b>Joined:</b> {new Date(user.createdAt).toLocaleString()}
          </p>

          <div className="mt-3">
            <label className="font-semibold">Suspend Account</label>

            <div className="flex items-center gap-4 mt-2">
              <div
                onClick={toggleSuspend}
                className={`w-16 h-8 rounded-full cursor-pointer transition ${
                  user.isSuspended ? "bg-red-500" : "bg-green-500"
                }`}
              >
                <div
                  className={`h-8 w-8 bg-white rounded-full shadow transition ${
                    user.isSuspended ? "translate-x-8" : "translate-x-0"
                  }`}
                ></div>
              </div>

              <span className="text-gray-600 text-sm">
                {suspendMutation.isPending ? "Updating..." : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={updateUser}
          disabled={updateMutation.isPending}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
