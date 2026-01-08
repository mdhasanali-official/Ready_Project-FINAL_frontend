//src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Shield } from "lucide-react";

const UserProfile = () => {
  const baseURL = import.meta.env.VITE_DataHost;
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    address: "",
    country: "",
    city: "",
    zip: "",
    profileImage: "",
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${baseURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return setMsg(data.message);

      setUser(data.user);

      setForm({
        name: data.user?.name || "",
        phone: data.user?.phone || "",
        bio: data.user?.bio || "",
        address: data.user?.address || "",
        country: data.user?.country || "",
        city: data.user?.city || "",
        zip: data.user?.zip || "",
        profileImage: data.user?.profileImage || "",
      });
    } catch {
      setMsg("Failed to load profile");
    }
    setLoading(false);
  };

  const updateProfile = async () => {
    setMsg("");

    try {
      const res = await fetch(`${baseURL}/api/auth/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return setMsg(data.message);

      setMsg("Profile Updated Successfully");
      setEditMode(false);
      fetchProfile();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("Update Failed");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </div>
    );

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
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

      <div className="relative z-10 flex justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-6xl pt-32">
          <AnimatePresence>
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <div className="bg-green-600/90 border border-green-500 text-white p-3 rounded-xl text-center text-sm">
                  {msg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={
                    user?.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-500/60 object-cover shadow-xl"
                  alt="Profile"
                />
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {user?.name}
                  </h2>
                  <p className="text-gray-300 mt-1 text-xs sm:text-sm">
                    {user?.email}
                  </p>
                  <div className="mt-2 inline-block px-2.5 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs">
                    {user?.role?.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-white/10 bg-black/20">
              <div className="flex overflow-x-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-3 transition font-medium whitespace-nowrap text-sm ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-b-2 border-blue-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold text-white">
                        Profile Information
                      </h1>
                      <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">
                        Manage your personal information
                      </p>
                    </div>

                    {editMode ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          className="flex-1 sm:flex-none px-4 py-2 text-sm bg-black/40 border border-white/20 hover:bg-black/60 text-white rounded-xl transition font-medium"
                          onClick={() => {
                            setEditMode(false);
                            fetchProfile();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="flex-1 sm:flex-none px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:scale-[1.03] transition font-medium"
                          onClick={updateProfile}
                        >
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full sm:w-auto px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:scale-[1.03] transition font-medium"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Name", key: "name" },
                        { label: "Phone Number", key: "phone" },
                        { label: "Country", key: "country" },
                        { label: "City", key: "city" },
                        { label: "Address", key: "address" },
                        { label: "ZIP Code", key: "zip" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-semibold mb-1.5 text-gray-300">
                            {field.label}
                          </label>
                          {editMode ? (
                            <input
                              className="w-full bg-black/40 border border-white/20 p-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                              value={form[field.key]}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  [field.key]: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <p className="bg-black/30 border border-white/10 p-2.5 rounded-xl text-gray-200 text-sm">
                              {user?.[field.key] || "N/A"}
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold mb-1.5 text-gray-300">
                          Bio
                        </label>
                        {editMode ? (
                          <textarea
                            className="w-full bg-black/40 border border-white/20 p-2.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-sm"
                            value={form.bio}
                            onChange={(e) =>
                              setForm({ ...form, bio: e.target.value })
                            }
                          />
                        ) : (
                          <p className="bg-black/30 border border-white/10 p-2.5 rounded-xl text-gray-200 min-h-[80px] text-sm">
                            {user?.bio || "No bio added"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-lg sm:text-xl text-white font-bold">
                      Settings
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Manage account settings
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h3 className="text-base text-white font-bold flex items-center gap-2">
                      <Shield className="text-blue-400" size={18} /> Account
                      Information
                    </h3>

                    <div className="mt-3 space-y-3">
                      <div className="bg-black/30 p-3 rounded-xl flex flex-col sm:flex-row justify-between gap-2">
                        <span className="text-white text-sm">Email</span>
                        <span className="text-blue-400 break-all text-sm">
                          {user?.email}
                        </span>
                      </div>

                      <div className="bg-black/30 p-3 rounded-xl flex flex-col sm:flex-row justify-between gap-2">
                        <span className="text-white text-sm">Phone</span>
                        <span className="text-blue-400 text-sm">
                          {user?.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                    <h3 className="text-base text-red-400 font-bold">
                      Danger Zone
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Delete account permanently
                    </p>
                    <button className="mt-3 px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
