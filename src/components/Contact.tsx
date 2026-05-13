"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service_type: "",
    problem: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const supabase = createClient();

      const { error } = await supabase.from("requests").insert({
        name: form.name,
        email: form.email || null,
        service_type: form.service_type,
        problem: form.problem,
        status: "pending",
      });

      if (error) throw error;

      setStatus("success");
      setForm({ name: "", email: "", service_type: "", problem: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Get In Touch</h2>
          <p className="mt-4 text-white/50 text-lg max-w-lg mx-auto">
            Tell us about your setup and we&apos;ll get back to you within 24h.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {status === "success" ? (
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-white mb-2">Request Sent!</h3>
              <p className="text-white/60">
                We&apos;ll review your details and contact you soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm text-accent hover:underline"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                    Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service_type" className="block text-sm font-medium text-white/70 mb-2">
                  Service Type <span className="text-accent">*</span>
                </label>
                <select
                  id="service_type"
                  name="service_type"
                  required
                  value={form.service_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200"
                >
                  <option value="" disabled className="bg-darkbg">
                    Select a service
                  </option>
                  <option value="Windows" className="bg-darkbg">Windows</option>
                  <option value="Linux" className="bg-darkbg">Linux</option>
                  <option value="Arch" className="bg-darkbg">Arch Linux</option>
                </select>
              </div>

              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-white/70 mb-2">
                  Problem Description <span className="text-accent">*</span>
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  required
                  rows={5}
                  value={form.problem}
                  onChange={handleChange}
                  placeholder="Describe what you need help with..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all duration-200 resize-none"
                />
              </div>

              {status === "error" && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-accent px-8 py-3 text-base font-medium text-white hover:bg-accent/80 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-accent/20"
                >
                  {status === "loading" ? "Sending..." : "Send Request"}
                </button>
                <a
                  href="https://wa.me/541171415426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg border border-white/10 px-8 py-3 text-base font-medium text-white/70 hover:border-accent/50 hover:text-accent transition-all duration-200 text-center"
                >
                  Contact via WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
