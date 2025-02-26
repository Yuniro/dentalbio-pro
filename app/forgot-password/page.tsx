"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number | null>(null);

  const supabase = createClientComponentClient();

  const COOLDOWN_TIME = 60 * 1000; // 1-minute cooldown

  useEffect(() => {
    const savedCooldown = localStorage.getItem("resetCooldown");

    if (savedCooldown) {
      const timeLeft = Number(savedCooldown) - Date.now();
      if (timeLeft > 0) {
        setCooldown(timeLeft);

        const countdownInterval = setInterval(() => {
          setCooldown((prev) => {
            if (prev === null || prev <= 1000) {
              clearInterval(countdownInterval);
              return null;
            }
            return prev - 1000;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      }
    }
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (cooldown) {
      setErrorMessage("Please wait before requesting another reset link.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);

    if (error) {
      setErrorMessage("Error sending reset email: " + error.message);
      setMessage(""); // Clear success message if error
    } else {
      setMessage("Check your email for the password reset link.");
      setErrorMessage(""); // Clear error message if success
      setCooldown(COOLDOWN_TIME);
      localStorage.setItem("resetCooldown", (Date.now() + COOLDOWN_TIME).toString());

      // Start the countdown
      const countdownInterval = setInterval(() => {
        setCooldown((prev) => {
          if (prev === null || prev <= 1000) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1000;
        });
      }, 1000);

      // Clear countdown after timeout
      setTimeout(() => {
        setCooldown(null);
        localStorage.removeItem("resetCooldown");
        clearInterval(countdownInterval);
      }, COOLDOWN_TIME);
    }
  };

  return (
    <div className="text-center flex flex-col justify-center items-center py-10 gap-5">
      <h2 className="text-lg font-semibold text-dark">Forgot Password?</h2>
      <form onSubmit={handlePasswordReset} className="space-y-5 w-full max-w-xl">
        {/* Email Input Field */}
        <div className="relative z-50 font-semibold left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5">
          <div className="max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent text-2xl text-dark px-4 py-1.5 outline-none placeholder-neutral-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="relative z-50 left-1/2 top-10 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5 mb-5">
          <button
            type="submit"
            disabled={loading || cooldown !== null}
            className={`w-full text-2xl font-semibold bg-gradient-to-r from-[#d47e8b] via-[#d47e8b] to-[#e09f7e] text-white rounded-[40px] border-[0.6px] shadow-sm bg-opacity-90 backdrop-blur-lg border-transparent py-5 px-4 transition-all duration-300 ease-in-out hover:bg-opacity-80 focus:outline-none ${
              loading || cooldown !== null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "Sending..."
              : cooldown
              ? `Try again in ${Math.ceil(cooldown / 1000)}s`
              : "Send Reset Link"}
          </button>
        </div>
      </form>

      {/* Message Handling */}
      {message && (
        <div className="pt-6 text-green-600">
          <p>{message}</p>
        </div>
      )}

      {errorMessage && (
        <div className="pt-6 text-red-600">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
