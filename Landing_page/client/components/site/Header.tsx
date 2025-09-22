import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/#about", label: "About Us" },
  { to: "/#partners", label: "Authorities" },
  { to: "/#techstack", label: "Tech stack" },
  { to: "/#testimonials", label: "Feedback" },
  { to: "/#contact", label: "Help Centre" },
  { to: "/admin", label: "Admin Panel" },
];

// Lazy-load MenuBar from UI components to keep header lightweight
const LazyMenuBar = React.lazy(() =>
  import("@/components/ui/animated-menu-bar").then((m) => ({
    default: m.MenuBar || m.default,
  })),
);

function MenuBarWrapper() {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const getIcon = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes("about")) {
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      );
    }
    if (
      key.includes("authorit") ||
      key.includes("authorities") ||
      key.includes("partners")
    ) {
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <rect x="3" y="7" width="18" height="11" rx="2" />
          <path d="M7 7v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        </svg>
      );
    }
    if (key.includes("tech") || key.includes("stack")) {
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M3 12h18" />
          <path d="M12 3v18" />
        </svg>
      );
    }
    if (key.includes("feedback") || key.includes("feedback")) {
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    }
    if (key.includes("help")) {
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
          <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" />
        </svg>
      );
    }
    if (key.includes("admin")) {
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M12 1l3 5 5 1-4 3 1 5-5-3-5 3 1-5-4-3 5-1 3-5z" />
        </svg>
      );
    }
    return null;
  };

  const items = nav.map((n) => ({
    key: normalize(n.label),
    label: n.label,
    to: n.to,
    icon: getIcon(n.label),
  }));
  const [active, setActive] = useState<string>(items[0]?.key ?? "");

  const handleSelect = (key: string) => {
    setActive(key);
    const item = items.find((i) => i.key === key);
    if (item?.to) {
      // Special handling for admin panel - redirect to external admin panel
      if (item.to === "/admin") {
        window.open("http://localhost:3001", "_blank", "noopener,noreferrer");
        return;
      }
      // navigate to anchor/path
      window.location.href = item.to;
    }
  };

  return (
    <React.Suspense fallback={<div className="w-24 h-10" />}>
      <LazyMenuBar items={items} active={active} onSelect={handleSelect} />
    </React.Suspense>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-brand-lime" />
          <span className="sr-only">Home</span>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-gray-900">
              Nivaran
            </div>
            <div className="text-xs text-gray-500 -mt-0.5">
              Aapki shikayat, hamara nivaran
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {/* MenuBar component (icon + label expanded on hover) */}
          <div className="hidden md:block">
            {/* import locally to avoid changing top imports ordering */}
            {/* @ts-ignore */}
            {false}
          </div>

          <div className="hidden md:flex items-center">
            {/* MenuBar will be dynamically imported to avoid SSR issues */}
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <MenuBarWrapper />
          </div>

          <Link
            to="/start-snapping"
            className="ml-4 inline-flex items-center rounded-lg bg-brand-cta text-gray-900 px-4 py-2 text-sm font-semibold shadow-sm hover:brightness-95 transition"
          >
            Report now
          </Link>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container py-4 flex flex-col gap-3">
            {nav.map((n) => (
              n.to === "/admin" ? (
                <a
                  key={n.to}
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-700"
                >
                  {n.label}
                </a>
              ) : (
                <a
                  key={n.to}
                  href={n.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-700"
                >
                  {n.label}
                </a>
              )
            ))}
            <Link
              to="/start-snapping"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-lg bg-brand-cta text-gray-900 px-4 py-2 text-sm font-semibold shadow-sm w-max"
            >
              Report now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
