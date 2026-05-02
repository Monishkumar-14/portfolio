import { useState }                       from "react";
import { Outlet, NavLink, useNavigate }   from "react-router-dom";
import { motion, AnimatePresence }        from "framer-motion";
import {
  LayoutDashboard, FolderOpen, Award,
  MessageSquare, Settings, KeyRound,
  LogOut, Menu, X, Bell,
} from "lucide-react";
import { useAuth }    from "../context/AuthContext";
import toast          from "react-hot-toast";

const NAV = [
  { group: "Overview",
    items: [
      { to: "/admin",             icon: <LayoutDashboard size={15}/>, label: "Dashboard",    end: true },
    ]
  },
  { group: "Content",
    items: [
      { to: "/admin/projects",     icon: <FolderOpen size={15}/>,     label: "Projects"      },
      { to: "/admin/certificates", icon: <Award size={15}/>,          label: "Certificates"  },
    ]
  },
  { group: "Inbox",
    items: [
      { to: "/admin/messages",     icon: <MessageSquare size={15}/>,  label: "Messages", badge: 3 },
    ]
  },
  { group: "Settings",
    items: [
      { to: "/admin/settings",     icon: <Settings size={15}/>,       label: "Settings"      },
      { to: "/admin/password",     icon: <KeyRound size={15}/>,       label: "Change Password"},
    ]
  },
];

const Sidebar = ({ mobile, onClose }) => {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/admin/login");
  };

  return (
    <div className={`flex flex-col h-full
      ${mobile ? "w-full" : "w-[220px]"}`}
      style={{
        background: "rgba(10,10,26,0.9)",
        backdropFilter: "blur(30px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5
        border-b border-white/7">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br
            from-violet-600 to-cyan-500 flex items-center justify-center
            text-lg shadow-[0_4px_16px_rgba(124,58,237,0.35)]">
            ⚡
          </div>
          <div>
            <p className="text-[14px] font-extrabold leading-none">Admin</p>
            <p className="text-[9px] text-white/28 mt-0.5">Portfolio Panel</p>
          </div>
        </div>
        {mobile && (
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18}/>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-5">
            <p className="text-[9px] font-semibold uppercase tracking-[2px]
              text-white/22 px-3 mb-2">
              {group}
            </p>
            {items.map(({ to, icon, label, badge, end }) => (
              <NavLink
                key={to} to={to} end={end}
                onClick={mobile ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-[12px]
                  text-[13px] font-medium mb-1 transition-all border
                  ${isActive
                    ? "bg-violet-500/18 border-violet-500/25 text-violet-300"
                    : "border-transparent text-white/42 hover:bg-white/6 hover:text-white/80"
                  }`
                }
              >
                <span className="flex-shrink-0 opacity-80">{icon}</span>
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="min-w-[18px] h-[18px] rounded-full
                    bg-pink-500/30 border border-pink-500/40 text-pink-400
                    text-[9px] font-bold flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Profile + logout */}
      <div className="px-3 py-4 border-t border-white/7">
        <div className="flex items-center gap-3 px-3 py-3 rounded-[12px]
          bg-white/4 border border-white/7 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br
            from-violet-600 to-cyan-500 flex items-center justify-center
            text-[13px] font-extrabold flex-shrink-0">
            M
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">Monishkumar</p>
            <p className="text-[10px] text-white/30">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5
            rounded-[10px] text-xs font-semibold
            bg-red-500/8 border border-red-500/18 text-red-400/70
            hover:bg-red-500/15 hover:text-red-400 transition-all"
        >
          <LogOut size={13}/> Logout
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a1a" }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 -top-20 -left-20 rounded-full
          bg-violet-600/15 blur-[100px]"/>
        <div className="absolute w-72 h-72 bottom-0 right-0 rounded-full
          bg-cyan-500/10 blur-[90px]"/>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 relative z-20">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[260px] lg:hidden"
            >
              <Sidebar mobile onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">

        {/* Topbar */}
        <div className="flex items-center gap-3 px-5 py-3.5
          border-b border-white/7 flex-shrink-0"
          style={{ background: "rgba(10,10,26,0.6)", backdropFilter: "blur(20px)" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-[10px] bg-white/6
              border border-white/10 flex items-center justify-center
              text-white/60"
          >
            <Menu size={16}/>
          </button>

          <div className="flex-1"/>

          <button className="w-9 h-9 rounded-[10px] bg-white/6
            border border-white/10 flex items-center justify-center
            text-white/50 hover:bg-white/10 transition-all relative">
            <Bell size={15}/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
              bg-pink-500 border border-[#0a0a1a]"/>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px]
            bg-white/4 border border-white/8">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br
              from-violet-600 to-cyan-500 flex items-center justify-center
              text-[10px] font-bold">
              M
            </div>
            <span className="text-xs font-medium text-white/70 hidden sm:block">
              Monishkumar
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;