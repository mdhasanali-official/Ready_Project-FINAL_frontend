import { Outlet } from "react-router-dom";
import Navbar from "../Users/Navbar/Navbar";

const Main = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Page Content */}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
