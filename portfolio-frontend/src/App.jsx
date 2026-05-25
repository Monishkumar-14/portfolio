import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Resume from "./components/Resume";
import Chatbot from "./components/Chatbot";
import Contact from "./components/Contact";
import Experience from "./components/Experience";
// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import AdminOverview from "./admin/AdminOverview";
import ManageProjects from "./admin/ManageProjects";
import ManageCertificates from "./admin/ManageCertificates";
import ViewMessages from "./admin/ViewMessages";
import AdminSettings from "./admin/AdminSettings";
import ChangePassword from "./admin/ChangePassword";

import Background from "./components/Background";

const PublicLayout = () => (
  <div className="relative min-h-screen"
    style={{ background: "var(--bg-main)", color: "var(--text-primary)", transition: "background 0.4s" }}>
    <Background />
    <div className="relative z-10">
      <Navbar />
      <main>
        <section id="home">         <Hero />         </section>
        <section id="about">        <About />        </section>
        <section id="experience">   <Experience/>     </section>
        <section id="projects">     <Projects />     </section>
        <section id="certificates"> <Certificates /> </section>
        <section id="resume">       <Resume />       </section>
        <section id="chatbot">      <Chatbot />      </section>
        <section id="contact">      <Contact />      </section>
        
      </main>
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f2937",
                color: "#f9fafb",
                borderRadius: "10px",
              },
            }}
          />
          <Routes>
            {/* Public Portfolio */}
            <Route path="/" element={<PublicLayout />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="certificates" element={<ManageCertificates />} />
              <Route path="messages" element={<ViewMessages />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="password" element={<ChangePassword />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;