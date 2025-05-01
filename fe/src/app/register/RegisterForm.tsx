"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Label from "../../components/RequiredField";
import Popup from "../../components/Popup";
import { getCredentials, getHeaders, getUrl } from "../../config";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"success" | "error" | "warning">("success");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(getUrl("auth.register"), {
        method: "POST",
        headers: getHeaders(),
        credentials: getCredentials(),
        body: JSON.stringify({ user_name: username, password }),
      });

      if (response.ok) {
        setPopupStatus("success");
        setPopupTitle("Registration Successful!");
        setPopupMessage("Your account has been created successfully. You can now login with your credentials.");
        setShowPopup(true);
        // Reset form
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setPopupStatus("error");
        setPopupTitle("Registration Failed");
        setPopupMessage(data.message || "Registration failed. Please try again.");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setPopupStatus("error");
      setPopupTitle("Error");
      setPopupMessage("An error occurred during registration. Please try again later.");
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onAction={popupStatus === "success" ? () => router.push("/login") : undefined}
        status={popupStatus}
        title={popupTitle}
        message={popupMessage}
        actionText={popupStatus === "success" ? "Go to Login" : undefined}
      />

      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 backdrop-blur-sm shadow-xl">
        <h1 className="text-2xl font-semibold text-white text-center mb-8">
          Create an account
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              label="User Name"
              htmlFor="username"
              required
              className="block text-sm font-medium text-gray-300 mb-2"
            />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <Label
              label="Password"
              htmlFor="password"
              required
              className="block text-sm font-medium text-gray-300 mb-2"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <Label
              label="Confirm Password"
              htmlFor="confirmPassword"
              required
              className="block text-sm font-medium text-gray-300 mb-2"
            />
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
