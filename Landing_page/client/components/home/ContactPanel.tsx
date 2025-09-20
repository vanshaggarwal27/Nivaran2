import React, { FormEvent, useState } from "react";

export function ContactPanel() {
  const [status, setStatus] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log("Contact submission", data);
    setStatus("Thanks! We'll be in touch.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container">
        <div className="rounded-3xl p-8 md:p-12 shadow-lg bg-[hsl(var(--brand-dark))] text-white ring-1 ring-white/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Contact us
              </h3>
              <p className="mt-2 text-white/80">
                Have questions or want a demo? Send a message and we'll reply within one business day.
              </p>
              {status && (
                <p className="mt-4 text-sm text-emerald-300">{status}</p>
              )}
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
              <input
                name="name"
                required
                placeholder="Name"
                className="h-11 px-3 rounded-lg bg-white text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/60"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="h-11 px-3 rounded-lg bg-white text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/60"
              />
              <textarea
                name="message"
                required
                placeholder="Message"
                rows={3}
                className="px-3 py-2 rounded-lg bg-white text-gray-900 border border-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/60"
              />
              <button className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-cta text-gray-900 px-5 py-2.5 text-sm font-semibold hover:brightness-95">
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
