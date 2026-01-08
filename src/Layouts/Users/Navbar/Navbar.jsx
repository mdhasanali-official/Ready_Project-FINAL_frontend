//src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#111] to-[#0a0a0a]"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <nav className="relative flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/10 bg-black/70 backdrop-blur-2xl shadow-lg">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Neterskill
        </Link>

        {!isMobile && (
          <ul className="flex items-center gap-8 text-gray-300 text-sm sm:text-base">
            <Link className="hover:text-white duration-200" to="/profile">
              Profile
            </Link>

            <button
              onClick={logoutUser}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 active:scale-95 transition"
            >
              Logout
            </button>
          </ul>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        )}
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/80 border border-white/10 backdrop-blur-xl mx-4 mt-2 p-4 rounded-xl text-gray-300"
        >
          <Link to="/profile" className="block py-2 hover:text-white">
            Profile
          </Link>

          <button
            onClick={logoutUser}
            className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
          >
            Logout
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
