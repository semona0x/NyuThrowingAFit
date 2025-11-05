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

// ✨ 新增
import { ArticlesIndexPage } from "./pages/ArticlesIndexPage";
import { ArticlePage } from "./pages/ArticlePage";

// ... 你的 ScrollHandler 保持不变

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit-fit" element={<SubmitFitPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

          {/* ✨ 新增两条文章路由 */}
          <Route path="/articles" element={<ArticlesIndexPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />

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
