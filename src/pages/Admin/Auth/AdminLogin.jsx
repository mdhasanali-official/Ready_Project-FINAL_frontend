//src/pages/Admin/AdminLogin/AdminLogin.jsx

import { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_DataHost;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login Failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      alert("Admin Login Successful 🎉");

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Neterskill Admin Panel
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please login to continue
        </p>

        {error && (
          <div className="mb-3 text-red-600 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Admin Email
          </label>
          <input
            type="email"
            required
            placeholder="admin@admin.com"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="********"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-500 text-sm">
          © Neterskill Admin Panel
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
