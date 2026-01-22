import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedEmail = location?.state?.email || "";

  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const verifyMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/api/auth/verify-email", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Email Verified Successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Verification Failed";
      toast.error(errorMessage);
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/api/auth/resend-code", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("A new verification code has been sent!");
      setTimeLeft(600);
      setResendCooldown(30);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to resend code";
      toast.error(errorMessage);

      // Extract cooldown seconds from error message
      const sec = parseInt(errorMessage?.match(/\d+/)?.[0]);
      if (!isNaN(sec)) setResendCooldown(sec);
    },
  });

  const handleVerify = (e) => {
    e.preventDefault();

    if (!passedEmail) {
      toast.error("Something went wrong! Please register again.");
      return;
    }

    verifyMutation.mutate({ email: passedEmail, code });
  };

  const handleResend = () => {
    if (!passedEmail) {
      toast.error("Something went wrong! Please register again.");
      return;
    }

    resendMutation.mutate({ email: passedEmail });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 sm:px-6">
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
        className="relative z-10 w-full max-w-[430px] bg-white/10 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Verify Your Email
        </h2>

        <p className="text-gray-300 mt-2 text-sm sm:text-base">
          Enter the verification code we sent to your email 📩
        </p>

        <div className="text-gray-300 text-sm mt-4">
          OTP Expires In:{" "}
          <span className="text-blue-400 font-semibold">
            {timeLeft > 0 ? formatTime() : "Expired"}
          </span>
        </div>

        <form onSubmit={handleVerify} className="mt-6 text-left">
          <label className="text-gray-300 text-sm">Verification Code</label>
          <input
            type="text"
            required
            maxLength={6}
            className="w-full mt-1 mb-6 px-4 py-3 text-center tracking-[4px] text-lg rounded-xl bg-black/40 border border-white/20 text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={verifyMutation.isPending}
          />

          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:scale-[1.03] active:scale-[0.99] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-gray-300 text-sm">
          Didn't receive code?
          <button
            type="button"
            disabled={resendMutation.isPending || resendCooldown > 0}
            onClick={handleResend}
            className={`ml-2 ${
              resendCooldown > 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-blue-400 hover:underline"
            }`}
          >
            {resendMutation.isPending
              ? "Resending..."
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
          </button>
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

export default VerifyEmail;
