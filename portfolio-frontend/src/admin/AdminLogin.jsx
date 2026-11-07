import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { Lock, User, Terminal, ArrowLeft } from "lucide-react";
import axios           from "axios";
import toast           from "react-hot-toast";
import { useAuth }     from "../context/AuthContext";
import Background      from "../components/Background";
import { Field, PasswordInput, Spinner } from "./AdminUI";
import "./Admin.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,    setForm]    = useState({ username: "", password: "" });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  /* Pre-warm: ping the backend health-check the moment this page mounts.
     Free-tier hosts (Render, Railway…) spin down after inactivity;
     this wakes the server + MongoDB connection while the user types. */
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${API_URL}/`, { signal: controller.signal, timeout: 15000 }).catch(() => {});
    return () => controller.abort();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!form.username || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/admin/login`,
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
    <MotionConfig reducedMotion="user">
      <div className="adm">
        <Background />
        <div className="adm-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="adm-login">
            <section className="adm-win" aria-labelledby="login-title">
              <div className="adm-win__bar">
                <span className="adm-dots" aria-hidden="true"><i/><i/><i/></span>
                <span className="adm-win__file">admin_login.sh</span>
              </div>

              <div className="adm-login__body">
                <div className="adm-login__head">
                  <span className="adm-logo"><Terminal size={24} aria-hidden="true" /></span>
                  <h1 id="login-title" className="adm-h1" style={{ fontSize: 24 }}>Admin Portal</h1>
                  <p className="adm-sub">Monishkumar Portfolio Management</p>
                </div>

                <form onSubmit={handleSubmit} className="adm-stack" noValidate>
                  <Field id="username" label="Username">
                    <div className="adm-inwrap">
                      <User size={14} aria-hidden="true" />
                      <input id="username" type="text" value={form.username} autoComplete="username"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        placeholder="admin" className="adm-input adm-input--icon" />
                    </div>
                  </Field>

                  <Field id="password" label="Password">
                    <PasswordInput id="password" value={form.password} autoComplete="current-password"
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      show={show} onToggle={() => setShow((s) => !s)} />
                  </Field>

                  <button type="submit" disabled={loading} className="adm-btn adm-btn--primary adm-btn--block" style={{ marginTop: 6 }}>
                    {loading ? (<><Spinner size={15}/> SIGNING IN...</>) : "SIGN IN →"}
                  </button>
                </form>

                <p className="adm-login__fine"><Lock size={11} aria-hidden="true" style={{ display: "inline", marginRight: 6, verticalAlign: "-1px" }}/>Secured with JWT authentication</p>
              </div>
            </section>

            <div style={{ textAlign: "center" }}>
              <button type="button" onClick={() => navigate("/")} className="adm-backlink">
                <ArrowLeft size={13} aria-hidden="true"/> Back to Portfolio
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default AdminLogin;
