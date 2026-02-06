"use client";

import { useState } from "react";
import { Loader2, Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";

interface InquiryFormProps {
  listingId: string;
  listingTitle: string;
  onSuccess: () => void;
}

export default function InquiryForm({
  listingId,
  listingTitle,
  onSuccess,
}: InquiryFormProps) {
  const { user, userData } = useAuth();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState(userData?.displayName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/listings/${listingId}/inquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSuccess(true);
      showToast("success", "Inquiry sent successfully! The landlord will contact you soon.");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
          <Mail className="h-6 w-6" />
          <div>
            <h3 className="font-semibold">Inquiry Sent!</h3>
            <p className="text-sm mt-1">
              The landlord will contact you soon about "{listingTitle}".
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary dark:text-primary-dark" />
        Contact Landlord
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Phone (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent outline-none resize-none"
            placeholder={`Hi, I'm interested in your property "${listingTitle}". When would be a good time to view it?`}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 bg-primary dark:bg-primary-dark text-white font-semibold rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Send Inquiry
            </>
          )}
        </button>

        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
          By sending this inquiry, you agree to be contacted by the landlord.
        </p>
      </form>
    </div>
  );
}
