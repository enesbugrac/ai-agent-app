"use client";

import { useState } from "react";
import { useModalStore } from "@/store/modalStore";
import { useWhitelistQuery } from "@/hooks/queries/whitelist.query";

const WhitelistForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { closeModal } = useModalStore();
  const { addEmailToWhitelist } = useWhitelistQuery();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addEmailToWhitelist(email);
      if (response.status === "exists") {
        setError("Email is already whitelisted");
        setIsSubmitting(false);
        return;
      }
      setSuccess(true);
      setEmail("");

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to join whitelist. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {success ? (
        <div className="text-center p-4">
          <div className="text-green-400 text-xl mb-2">✓</div>
          <h3 className="text-white text-lg font-medium mb-2">
            You're on the list!
          </h3>
          <p className="text-secondary text-sm">
            Thank you for joining. We'll notify you when access is available.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-white text-lg font-medium mb-2">
            Join the Whitelist
          </h3>
          <p className="text-secondary text-sm mb-6">
            Get early access to AIGEN and be the first to experience our
            AI-powered agents.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-white text-sm"
                disabled={isSubmitting}
              />
              {error && <p className="mt-1 text-red-400 text-xs">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-black font-medium transition-all ${
                isSubmitting
                  ? "bg-primary/70 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Join Whitelist"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default WhitelistForm;
