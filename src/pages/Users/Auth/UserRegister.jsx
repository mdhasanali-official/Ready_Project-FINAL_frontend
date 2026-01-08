//src/pages/Users/Auth/UserRegister.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const UserRegister = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_DataHost;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-500";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (phone.length < 10) {
      setError("Enter a valid phone number (min 10 digits)");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration Failed");
        setLoading(false);
        return;
      }

      setSuccess("Registration Successful! Redirecting...");
      setTimeout(() => {
        navigate("/verify-email", { state: { email } });
      }, 800);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 sm:px-6">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-8 text-center"
            >
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">
                Creating your account...
              </p>
              <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        className="relative z-10 w-full max-w-[480px] bg-white/10 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Create Account
        </h2>

        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Join Neterskill and start your journey 🚀
        </p>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full mt-4 mb-2 bg-green-500/15 border border-green-400/40 text-green-300 py-3 px-4 rounded-xl text-sm font-medium"
            >
              ✓ {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full mt-4 mb-2 bg-red-500/15 border border-red-400/40 text-red-300 py-3 px-4 rounded-xl text-sm font-medium"
            >
              ✕ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister} className="mt-6 text-left space-y-4">
          <div>
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-1.5">
              <User size={16} /> Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-1.5">
              <Phone size={16} /> Phone Number
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="+8801XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-1.5">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-1.5">
              <Lock size={16} /> Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/20 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= passwordStrength
                          ? getPasswordStrengthColor()
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength > 0 && (
                  <p className="text-xs text-gray-400">
                    Password strength:{" "}
                    <span
                      className={
                        passwordStrength >= 3
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2 mb-1.5">
              <Lock size={16} /> Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 border border-white/20 text-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-gray-300 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition"
          >
            Login here
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-4 sm:bottom-6 w-full text-center px-4">
        <p className="text-gray-400 text-xs sm:text-sm tracking-wide">
          © 2025 Neterskill. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
