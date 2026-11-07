import { useState, useEffect }              from "react";
import { Outlet, NavLink, useNavigate }     from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, Award, MessageSquare, Settings, KeyRound,
  LogOut, Menu, X, Bell, Terminal,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast       from "react-hot-toast";
import axios       from "axios";
import Background  from "../components/Background";
import "./Admin.css";

const NAV = [
  { group: "Overview", items: [
    { to: "/admin", icon: <LayoutDashboard size={15}/>, label: "Dashboard", end: true },
  ]},
  { group: "Content", items: [
    { to: "/admin/projects",     icon: <FolderOpen size={15}/>, label: "Projects" },
    { to: "/admin/certificates", icon: <Award size={15}/>,      label: "Certificates" },
  ]},
  { group: "Inbox", items: [
    { to: "/admin/messages", icon: <MessageSquare size={15}/>, label: "Messages", badgeKey: "unread" },
  ]},
  { group: "Settings", items: [
    { to: "/admin/settings", icon: <Settings size={15}/>, label: "Settings" },
    { to: "/admin/password", icon: <KeyRound size={15}/>, label: "Change Password" },
  ]},
];

const Sidebar = ({ mobile, onClose, unreadCount }) => {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/admin/login");
  };

  return (
    <aside className="adm-sidebar" aria-label="Admin navigation">
      <div className="adm-brand">
        <div className="adm-brand__id">
          <span className="adm-logo"><Terminal size={18} aria-hidden="true" /></span>
          <div>
            <p className="adm-brand__t">admin<span style={{ color: "var(--accent)" }}>.</span>panel</p>
            <p className="adm-brand__s">monish.dev</p>
          </div>
        </div>
        {mobile && (
          <button type="button" onClick={onClose} aria-label="Close navigation menu" className="adm-iconbtn"><X size={16}/></button>
        )}
      </div>

      <nav className="adm-nav" aria-label="Admin sections">
        {NAV.map(({ group, items }) => (
          <div key={group} className="adm-nav__group">
            <p className="adm-nav__label">{group}</p>
            {items.map(({ to, icon, label, badgeKey, end }) => (
              <NavLink key={to} to={to} end={end} onClick={mobile ? onClose : undefined}
                className={({ isActive }) => `adm-navlink${isActive ? " is-active" : ""}`}>
                <span aria-hidden="true">{icon}</span>
                <span className="adm-navlink__txt">{label}</span>
                {badgeKey === "unread" && unreadCount > 0 && (
                  <span className="adm-count" aria-label={`${unreadCount} unread`}>{unreadCount}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="adm-side-foot">
        <div className="adm-profile">
          <span className="adm-avatar" aria-hidden="true">M</span>
          <div style={{ minWidth: 0 }}>
            <p className="adm-profile__n">Monishkumar</p>
            <p className="adm-profile__r">administrator</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="adm-btn adm-btn--danger adm-btn--block adm-btn--sm">
          <LogOut size={13} aria-hidden="true"/> Logout
        </button>
      </div>
    </aside>
  );
};

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Unread count for the sidebar badge (refreshed every 30s)
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCount(data.stats?.unreadMessages ?? 0);
      } catch {
        // silently fail: the badge just won't show
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Mobile drawer: Escape closes it, page scroll is locked while it is open
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [mobileOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="adm">
        <Background />

        <div className="adm-shell">
          {/* Desktop sidebar (hidden below 1024px by CSS) */}
          <Sidebar unreadCount={unreadCount} />

          <div className="adm-main">
            <header className="adm-top">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu"
                className="adm-iconbtn adm-menu-btn"><Menu size={16}/></button>
              <div className="adm-top__grow"/>
              <button type="button" onClick={() => navigate("/admin/messages")}
                aria-label={unreadCount > 0 ? `Messages, ${unreadCount} unread` : "Messages"}
                className="adm-iconbtn adm-iconbtn--ghost">
                <Bell size={15}/>
                {unreadCount > 0 && <span className="adm-dot" aria-hidden="true"/>}
              </button>
              <div className="adm-profile" style={{ margin: 0, padding: "5px 12px 5px 6px" }}>
                <span className="adm-avatar" style={{ width: 26, height: 26, fontSize: 11 }} aria-hidden="true">M</span>
                <span className="adm-profile__n" style={{ fontSize: 12 }}>Monishkumar</span>
              </div>
            </header>

            <main className="adm-content"><Outlet/></main>
          </div>
        </div>

        {/* Mobile / tablet drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div className="adm-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)} aria-hidden="true"/>
              <motion.div className="adm-drawer" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                transition={{ type: "spring", damping: 32, stiffness: 320 }}>
                <Sidebar mobile onClose={() => setMobileOpen(false)} unreadCount={unreadCount} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

export default Dashboard;