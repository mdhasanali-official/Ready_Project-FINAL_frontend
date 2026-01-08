import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const baseURL = import.meta.env.VITE_DataHost;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/api/auth/login`, {
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

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      setSuccess("Login Successful! Redirecting...");
      setTimeout(() => (window.location.href = "/profile"), 1200);
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 sm:px-6">
      {success && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-5 z-50 bg-green-600/90 text-white px-6 py-3 rounded-xl shadow-lg text-sm sm:text-base font-semibold"
        >
          {success}
        </motion.div>
      )}

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        className={`absolute ${
          isMobile ? "w-52 h-52" : "w-[420px] h-[420px]"
        } bg-blue-600/30 rounded-full blur-3xl left-[-120px] top-[10%]`}
        animate={{ y: [0, 35, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className={`absolute ${
          isMobile ? "w-52 h-52" : "w-[420px] h-[420px]"
        } bg-purple-600/30 rounded-full blur-3xl right-[-120px] bottom-[10%]`}
        animate={{ y: [0, -35, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          backgroundImage: `linear-gradient(
            115deg,
            rgba(59,130,246,0.18) 0%,
            rgba(168,85,247,0.15) 50%,
            transparent 100%
          )`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? "35px 35px" : "50px 50px",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[420px] bg-white/10 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          User Login
        </h2>

        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Welcome back to Neterskill 🚀
        </p>

        {error && <p className="text-red-400 text-sm mt-3 px-2">{error}</p>}

        <form onSubmit={handleLogin} className="mt-6 text-left">
          <label className="text-gray-300 text-sm">Email</label>
          <input
            type="email"
            required
            className="w-full mt-1 mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-gray-300 text-sm">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              className="w-full mt-1 mb-5 px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/20 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3.5 text-gray-300 cursor-pointer select-none"
            >
              {showPass ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.03] active:scale-[0.99] transition-all shadow-lg text-sm sm:text-base"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 text-gray-300 text-sm">
          Don’t have an account?
          <Link
            to="/register"
            className="text-blue-400 font-semibold hover:underline ml-1"
          >
            Create one
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-4 sm:bottom-6 w-full text-center px-4">
        <p className="text-gray-400 text-xs sm:text-sm tracking-wide">
          © Neterskill User Portal
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
