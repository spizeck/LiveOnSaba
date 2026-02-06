"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Check Your Email
            </h1>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
              We&apos;ve sent password reset instructions to{" "}
              <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                {email}
              </span>
            </p>
            <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              If you don&apos;t see the email, check your spam folder.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex items-center gap-2 text-primary dark:text-primary-dark font-semibold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Reset Password
            </h1>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Enter your email and we&apos;ll send you reset instructions
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Remember your password?{" "}
            <Link
              href="/signin"
              className="text-primary dark:text-primary-dark font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
}
