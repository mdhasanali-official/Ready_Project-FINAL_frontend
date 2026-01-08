import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loading from "../../../components/Shared/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_DataHost;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${baseURL}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data.stats);
      } catch (err) {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Loading message="Loading Dashboard..." />;

  const chartData = [
    { name: "Mon", users: 5 },
    { name: "Tue", users: 9 },
    { name: "Wed", users: 4 },
    { name: "Thu", users: 11 },
    { name: "Fri", users: 7 },
    { name: "Sat", users: 13 },
    { name: "Sun", users: 9 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      <div className="w-full">
        <div className="mb-5 md:mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Neterskill Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              System overview & user statistics
            </p>
          </div>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition text-sm md:text-base">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 w-full">
          <DashCard
            value={stats.totalUsers}
            label="Total Users"
            color="bg-blue-500"
          />
          <DashCard
            value={stats.verifiedUsers}
            label="Verified Users"
            color="bg-green-500"
          />
          <DashCard
            value={stats.unverifiedUsers}
            label="Unverified Users"
            color="bg-yellow-500"
          />
          <DashCard
            value={stats.suspendedUsers}
            label="Suspended Users"
            color="bg-red-500"
          />
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          <div className="col-span-1 lg:col-span-2 bg-white p-4 md:p-6 rounded-xl shadow-lg border w-full">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Weekly User Growth
            </h2>

            <div className="w-full h-[220px] sm:h-[260px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="40%"
                        stopColor="#4f46e5"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor="#4f46e5"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#4f46e5"
                    fill="url(#color)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-xl shadow-lg border flex flex-col justify-center text-center">
            <h2 className="text-base md:text-lg font-semibold text-gray-800">
              Today New Users
            </h2>

            <p className="text-5xl md:text-6xl font-bold text-indigo-600 mt-3 md:mt-4">
              {stats.todayUsers}
            </p>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Users registered in last 24 hours
            </p>
          </div>
        </div>

        <p className="text-gray-500 mt-10 text-xs md:text-sm text-center">
          © Neterskill Admin Panel
        </p>
      </div>
    </div>
  );
};

const DashCard = ({ value, label, color }) => {
  return (
    <div
      className={`${color} text-white p-5 md:p-6 rounded-xl shadow-xl hover:scale-[1.02] transition`}
    >
      <h1 className="text-3xl md:text-4xl font-bold">{value}</h1>
      <p className="text-base md:text-lg mt-2">{label}</p>

      <div className="mt-3 md:mt-4 text-xs md:text-sm opacity-90 underline cursor-pointer">
        More info →
      </div>
    </div>
  );
};

export default AdminDashboard;
