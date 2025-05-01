"use client";

import Label from "@/components/RequiredField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import { getCredentials, getHeaders, getUrl } from "../../config";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(getUrl("auth.login"), {
        method: "POST",
        headers: getHeaders(),
        credentials: getCredentials(),
        body: JSON.stringify({ user_name: username, password }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 backdrop-blur-sm shadow-xl">
        <h1 className="text-2xl font-semibold text-white text-center mb-8">
          Login to your account
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors">
            <FaGoogle className="text-lg" />
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors">
            <FaFacebook className="text-lg" />
            <span>Facebook</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative bg-gray-900 px-4">
            <span className="text-sm text-gray-400">or</span>
          </div>
        </div>

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
            <div className="flex justify-between items-center mb-2">
              <Label
                label="Password"
                htmlFor="password"
                required
                className="block text-sm font-medium text-gray-300"
              />
              <Link
                href="/forgot-password"
                className="text-sm text-gray-400 hover:text-blue-500"
              >
                Forgot?
              </Link>
            </div>
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

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:text-blue-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
