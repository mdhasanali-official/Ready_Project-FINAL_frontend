// pages/Admin/Dashboard/AdminDashboard.jsx
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Ban,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import Loading from "../../../components/Shared/Loading";
import api from "../../../utils/api";

const AdminDashboard = () => {
  const {
    data: statsData,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await api.get("/api/admin/dashboard-stats");
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const stats = statsData?.stats;

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) return <Loading message="Loading Dashboard..." />;

  const chartData =
    stats?.growthLast7Days?.map((item) => ({
      date: new Date(item._id).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      users: item.count,
    })) || [];

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12.5%",
    },
    {
      title: "Verified Users",
      value: stats?.verifiedUsers || 0,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8.3%",
    },
    {
      title: "Unverified Users",
      value: stats?.unverifiedUsers || 0,
      icon: UserX,
      color: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "-3.2%",
    },
    {
      title: "Suspended Users",
      value: stats?.suspendedUsers || 0,
      icon: Ban,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      change: "+1.8%",
    },
  ];

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            System overview & user statistics
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={card.title} {...card} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                User Growth
              </h2>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Today's New Users</h2>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-5xl font-bold">{stats?.todayUsers || 0}</p>
            <p className="text-blue-100 text-sm mt-2">
              Registered in last 24 hours
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2">
            <ArrowUpRight className="w-4 h-4" />
            <span>+24% from yesterday</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  textColor,
  bgColor,
  change,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <span
          className={`text-xs font-medium ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
        >
          {change}
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
