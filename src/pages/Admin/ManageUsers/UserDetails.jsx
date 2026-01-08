import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../../components/Shared/Loading";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_DataHost;

  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    isEmailVerified: false,
  });

  const getUser = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${baseURL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUser(data.user);

      setForm({
        name: data.user.name,
        email: data.user.email,
        isEmailVerified: data.user.isEmailVerified,
      });
    } catch {}
  };

  const updateUser = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("adminToken");

      await fetch(`${baseURL}/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          isEmailVerified: form.isEmailVerified,
        }),
      });

      setSaving(false);
      getUser();
    } catch {
      setSaving(false);
    }
  };

  const toggleSuspend = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem("adminToken");

      await fetch(`${baseURL}/api/admin/users/${id}/suspend`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setProcessing(false);
      getUser();
    } catch {
      setProcessing(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) return <Loading message="Loading User Details..." />;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-7 border max-w-5xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            User Management Panel
          </h1>
          <p className="text-gray-500 text-sm">
            Manage user profile, email verification & suspension
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      {/* TWO SECTION GRID */}
      <div className="grid md:grid-cols-2 gap-7 text-sm">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
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
                {processing ? "Updating..." : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-8">
        <button
          onClick={updateUser}
          disabled={saving}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
