import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <aside className="w-64 h-full bg-[#0b1324] text-white shadow-xl flex flex-col">
      <div className="p-5 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Neterskill Admin</h2>
          <p className="text-xs opacity-70">Control Panel</p>
        </div>

        {closeSidebar && (
          <button
            className="text-white text-2xl md:hidden"
            onClick={closeSidebar}
          >
            ✖
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <AdminLink to="/admin/dashboard" label="Dashboard" icon="📊" />
        <AdminLink to="/admin/users" label="Manage Users" icon="👥" />
        <AdminLink to="/admin/settings" label="Settings" icon="⚙️" />
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logoutHandler}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-md shadow"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

const AdminLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-md transition ${
        isActive
          ? "bg-white text-black font-semibold shadow"
          : "hover:bg-white/10"
      }`
    }
  >
    {icon} {label}
  </NavLink>
);

export default AdminSidebar;
