import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ActiveSectionProvider } from "./context/ActiveSectionContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages — eagerly loaded (above the fold)
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import SplashScreen from "./components/SplashScreen";
import BackToTop from "./components/BackToTop";
import ScrollProgress from "./components/ScrollProgress";
import MobileTabBar from "./components/MobileTabBar";

// Lazy-loaded below-the-fold sections
const Projects = lazy(() => import("./components/Projects"));
const Certificates = lazy(() => import("./components/Certificates"));
const Contact = lazy(() => import("./components/Contact"));
const FloatingChatbot = lazy(() => import("./components/FloatingChatbot"));
const NotFound = lazy(() => import("./components/NotFound"));
const AppDownload = lazy(() => import("./components/AppDownload"));

// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
const AdminOverview = lazy(() => import("./admin/AdminOverview"));
const ManageProjects = lazy(() => import("./admin/ManageProjects"));
const ManageCertificates = lazy(() => import("./admin/ManageCertificates"));
const ViewMessages = lazy(() => import("./admin/ViewMessages"));
const AdminSettings = lazy(() => import("./admin/AdminSettings"));
const ChangePassword = lazy(() => import("./admin/ChangePassword"));

const SectionFallback = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-5 h-5 border-2 rounded-full animate-spin"
      style={{ borderColor: "var(--badge-border)", borderTopColor: "var(--primary-accent)" }} />
  </div>
);

const AdminSuspense = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" /></div>}>
    {children}
  </Suspense>
);

import Background from "./components/Background";
import CustomCursor from "./components/CustomCursor";

const PublicLayout = () => (
  <ActiveSectionProvider>
    <div className="relative min-h-screen"
      style={{ background: "var(--bg-main)", color: "var(--text-primary)", transition: "background 0.4s" }}>
      <a href="#home" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg"
        style={{ background: "var(--primary-accent)", color: "#fff" }}>Skip to content</a>
      <ScrollProgress />
      <Background />
      <CustomCursor />
      <BackToTop />
      <MobileTabBar />
      <div className="relative z-10">
        <Navbar />
        <main>
          <section id="home" aria-label="Home">                 <Hero />         </section>
          <section id="about" aria-label="About">               <About />        </section>
          <section id="skills" aria-label="Skills">             <Skills />       </section>
          <section id="experience" aria-label="Experience">     <Experience />   </section>
          <Suspense fallback={<SectionFallback />}>
            <section id="projects" aria-label="Projects">         <Projects />     </section>
            <section id="certificates" aria-label="Certificates"> <Certificates /> </section>
            <section id="contact" aria-label="Contact">           <Contact />      </section>
          </Suspense>
        </main>
        {/* Bottom padding for mobile tab bar */}
        <div className="md:hidden h-20" />
      </div>
      {/* Floating AI Chatbot */}
      <Suspense fallback={null}>
        <FloatingChatbot />
      </Suspense>
    </div>
  </ActiveSectionProvider>
);

const App = () => {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}

        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1E1E1E",
                color: "#F0F2F4",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<PublicLayout />} />
            <Route path="/app" element={<Suspense fallback={<SectionFallback />}><AppDownload /></Suspense>} />
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
            <Route path="*" element={<Suspense fallback={<SectionFallback />}><NotFound /></Suspense>} />
          </Routes>
          <Analytics />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
