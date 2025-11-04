

/**
 * @description This file defines the LoginPage component for NYUThrowingAFit admin authentication.
 *             It implements Google OAuth and email OTP login using @hey-boss/users-service.
 *             After successful login, users are redirected to their intended destination or admin dashboard.
 *             The component uses Nike-inspired styling with high contrast and clean typography.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@hey-boss/users-service/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail, LogIn } from "lucide-react";

export const LoginPage = () => {
  const { user, popupLogin, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const returnUrl = searchParams.get("returnUrl") || "/admin";

  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await popupLogin();
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendOTP(email);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await verifyOTP(email, otp);
    } catch (err) {
      setError("Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            NYUThrowingAFit
          </h1>
          <p className="mt-2 text-gray-400 text-sm">Admin Dashboard Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-none p-8 border border-white/10">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-none">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!otpMode ? (
            <div className="space-y-6">
              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white text-black py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#111111] text-gray-400">or</span>
                </div>
              </div>

              {/* Switch to OTP */}
              <button
                onClick={() => setOtpMode(true)}
                className="w-full border border-white/20 text-white py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
              >
                <Mail className="h-5 w-5" />
                Login with Email OTP
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-white font-bold text-sm mb-2 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-white text-black py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                  Send OTP Code
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-white font-bold text-sm mb-2 uppercase tracking-wide">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40"
                      placeholder="Enter OTP code"
                    />
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full bg-white text-black py-4 px-6 font-bold text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <LogIn className="h-5 w-5" />
                    )}
                    Verify & Login
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setOtpMode(false);
                  setOtpSent(false);
                  setEmail("");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-gray-400 text-sm hover:text-white transition-colors"
              >
                ← Back to login options
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            Made with <a href="https://nyuthrowingafit.com" className="text-blue-400 underline">nyuthrowingafit.2025</a>
          </p>
        </div>
      </div>
    </div>
  );
};

