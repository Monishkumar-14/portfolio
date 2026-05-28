import React, { lazy, Suspense } from "react";
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
const AdminOverview = lazy(() => import("./admin/AdminOverview"));
const ManageProjects = lazy(() => import("./admin/ManageProjects"));
const ManageCertificates = lazy(() => import("./admin/ManageCertificates"));
const ViewMessages = lazy(() => import("./admin/ViewMessages"));
const AdminSettings = lazy(() => import("./admin/AdminSettings"));
const ChangePassword = lazy(() => import("./admin/ChangePassword"));

const AdminSuspense = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" /></div>}>
    {children}
  </Suspense>
);

import Background from "./components/Background";

const PublicLayout = () => (
  <div className="relative min-h-screen"
    style={{ background: "var(--bg-main)", color: "var(--text-primary)", transition: "background 0.4s" }}>
    <a href="#home" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg">Skip to content</a>
    <Background />
    <div className="relative z-10">
      <Navbar />
      <main>
        <section id="home" aria-label="Home">                 <Hero />         </section>
        <section id="about" aria-label="About">               <About />        </section>
        <section id="experience" aria-label="Experience">     <Experience />   </section>
        <section id="projects" aria-label="Projects">         <Projects />     </section>
        <section id="certificates" aria-label="Certificates"> <Certificates /> </section>
        <section id="resume" aria-label="Resume">             <Resume />       </section>
        <section id="chatbot" aria-label="Chatbot">           <Chatbot />      </section>
        <section id="contact" aria-label="Contact">           <Contact />      </section>
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
              <Route index element={<AdminSuspense><AdminOverview /></AdminSuspense>} />
              <Route path="projects" element={<AdminSuspense><ManageProjects /></AdminSuspense>} />
              <Route path="certificates" element={<AdminSuspense><ManageCertificates /></AdminSuspense>} />
              <Route path="messages" element={<AdminSuspense><ViewMessages /></AdminSuspense>} />
              <Route path="settings" element={<AdminSuspense><AdminSettings /></AdminSuspense>} />
              <Route path="password" element={<AdminSuspense><ChangePassword /></AdminSuspense>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;