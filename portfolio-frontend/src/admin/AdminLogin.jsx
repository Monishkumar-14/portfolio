import { useState }    from "react";
import { useNavigate } from "react-router-dom";
import { motion }      from "framer-motion";
import { Eye, EyeOff, Lock, User, Zap } from "lucide-react";
import axios           from "axios";
import toast           from "react-hot-toast";
import { useAuth }     from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,    setForm]    = useState({ username: "", password: "" });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        form
      );
      login(data.token);
      toast.success("Welcome back, Monish!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#0a0a1a" }}>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full -top-20 -left-20
          bg-violet-600/20 blur-[100px]"/>
        <div className="absolute w-80 h-80 rounded-full bottom-10 right-0
          bg-cyan-500/15 blur-[90px]"/>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Card */}
        <div className="glass-card p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br
              from-violet-600 to-cyan-500 flex items-center justify-center
              text-3xl mx-auto mb-5
              shadow-[0_8px_32px_rgba(124,58,237,0.4)]">
              <Zap size={24}/>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">
              Admin Portal
            </h1>
            <p className="text-sm text-white/40">
              Monishkumar Portfolio Management
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/35 mb-2">
                Username
              </label>
              <div className="relative">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2
                  text-white/30"/>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="admin"
                  className="glass-input w-full pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-[10px] font-semibold uppercase
                tracking-[1.5px] text-white/35 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2
                  text-white/30"/>
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="glass-input w-full pl-10 pr-12 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label="Toggle password visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2
                    text-white/30 hover:text-white/70 transition-colors"
                >
                  {show ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3.5 rounded-[14px] text-sm font-bold
                btn-primary-glass flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30
                      border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </motion.button>

          </form>

          <p className="text-center text-[11px] text-white/20 mt-6">
            <Lock size={12} className="inline mr-1"/> Secured with JWT Authentication
          </p>
        </div>

        {/* Back link */}
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs text-white/30
            hover:text-white/60 transition-colors mx-auto mt-5"
        >
          ← Back to Portfolio
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;