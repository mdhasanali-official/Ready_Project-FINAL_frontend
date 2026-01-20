// components/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  X,
  Calendar,
  UserCircle,
  ClipboardList,
  FileText,
  Table,
  MessageSquare,
  Inbox,
  Bell,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AdminSidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const logoutHandler = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const menuSections = [
    {
      title: "MENU",
      items: [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/profile", label: "Profile", icon: UserCircle },
        {
          label: "Task",
          icon: ClipboardList,
          hasDropdown: true,
          subItems: [
            { to: "/admin/tasks/all", label: "All Tasks" },
            { to: "/admin/tasks/pending", label: "Pending" },
          ],
        },
        {
          label: "Forms",
          icon: FileText,
          hasDropdown: true,
          subItems: [
            { to: "/admin/forms/create", label: "Create Form" },
            { to: "/admin/forms/list", label: "Form List" },
          ],
        },
        {
          label: "Tables",
          icon: Table,
          hasDropdown: true,
          subItems: [
            { to: "/admin/tables/data", label: "Data Tables" },
            { to: "/admin/tables/reports", label: "Reports" },
          ],
        },
        { to: "/admin/pages", label: "Pages", icon: FileText },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        {
          to: "/admin/messages",
          label: "Messages",
          icon: MessageSquare,
          badge: 5,
        },
        { to: "/admin/inbox", label: "Inbox", icon: Inbox },
        { to: "/admin/notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      title: "OTHERS",
      items: [{ to: "/admin/settings", label: "Settings", icon: Settings }],
    },
  ];

  return (
    <aside className="w-56 h-screen bg-[#1a1d2e] text-white shadow-2xl flex flex-col fixed top-0 left-0">
      <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
            N
          </div>
          <div>
            <h2 className="text-sm font-bold">Neterskill</h2>
          </div>
        </div>

        {closeSidebar && (
          <button
            className="p-1.5 hover:bg-white/10 rounded-lg transition lg:hidden"
            onClick={closeSidebar}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <h3 className="text-[10px] font-semibold text-gray-500 mb-2 px-2">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item, index) =>
                item.hasDropdown ? (
                  <DropdownMenu
                    key={item.label}
                    item={item}
                    isOpen={openMenus[item.label]}
                    toggle={() => toggleMenu(item.label)}
                    delay={sectionIndex * 0.1 + index * 0.05}
                  />
                ) : (
                  <AdminLink
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    delay={sectionIndex * 0.1 + index * 0.05}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-600 py-2 rounded-lg shadow text-xs font-medium transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

const AdminLink = ({ to, label, icon: Icon, badge, delay }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center justify-between px-3 py-2 rounded-lg transition text-xs ${
        isActive
          ? "bg-blue-600 text-white font-medium"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`
    }
  >
    {({ isActive }) => (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
            {badge}
          </span>
        )}
      </motion.div>
    )}
  </NavLink>
);

const DropdownMenu = ({ item, isOpen, toggle, delay }) => {
  const Icon = item.icon;
  return (
    <div>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-xs text-gray-300 hover:bg-white/5 hover:text-white"
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay }}
          className="flex items-center gap-2.5"
        >
          <Icon className="w-4 h-4" />
          <span>{item.label}</span>
        </motion.div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-6 mt-1 space-y-0.5"
          >
            {item.subItems.map((subItem) => (
              <NavLink
                key={subItem.to}
                to={subItem.to}
                className={({ isActive }) =>
                  `block px-3 py-1.5 rounded-lg text-xs transition ${
                    isActive
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {subItem.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSidebar;
