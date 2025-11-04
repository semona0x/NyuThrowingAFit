


import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SubmitFitPage } from "./pages/SubmitFitPage";
import { AuthCallback } from "./pages/AuthCallback";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { AuthProvider } from "@hey-boss/users-service/react";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { AuthProtect } from "./components/AuthProtect";
import { useEffect } from "react";

// Scroll handler for smooth navigation
const ScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation for smooth scrolling
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (location.state?.scrollTo !== undefined) {
      // Handle custom scroll position
      setTimeout(() => {
        window.scrollTo({ top: location.state.scrollTo, behavior: 'smooth' });
      }, 100);
    } else {
      // Default: scroll to top for new page navigation
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  return null;
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollHandler />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit-fit" element={<SubmitFitPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route 
            path="/admin" 
            element={
              <AuthProtect>
                <AdminPage />
              </AuthProtect>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};



