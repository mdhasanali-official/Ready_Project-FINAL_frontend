import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="hidden md:block fixed left-0 top-0 h-full z-50">
        <AdminSidebar />
      </div>

      <div
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 md:hidden ${
          open ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <AdminSidebar closeSidebar={() => setOpen(false)} />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow p-4 flex justify-between items-center z-30">
        <h2 className="font-bold text-lg">Neterskill Admin</h2>
        <button className="text-3xl" onClick={() => setOpen(true)}>
          ☰
        </button>
      </div>

      <main className="flex-1 p-2 pt-10 w-full mt-14 md:mt-0 md:ml-64 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
