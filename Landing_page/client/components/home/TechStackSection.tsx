import React from "react";
import { Link } from "react-router-dom";

const stack = [
  {
    name: "React 18",
    color: "bg-brand-blue",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <g fill="none" stroke="currentColor">
          <ellipse cx="12" cy="12" rx="11" ry="4" />
          <ellipse
            cx="12"
            cy="12"
            rx="11"
            ry="4"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="11"
            ry="4"
            transform="rotate(-60 12 12)"
          />
        </g>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    color: "bg-brand-purple",
    icon: () => <span className="text-[10px] font-bold">TS</span>,
  },
  {
    name: "Vite",
    color: "bg-brand-orange",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path d="M12 2L3 6l9 16 9-16-9-4z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "TailwindCSS",
    color: "bg-brand-lime",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M3 12c2-4 5-6 9-6s7 2 9 6c-2 4-5 6-9 6s-7-2-9-6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Radix UI",
    color: "bg-gray-800",
    icon: () => <span className="text-[10px] font-bold">R</span>,
  },
  {
    name: "Express",
    color: "bg-gray-700",
    icon: () => <span className="text-[10px] font-bold">Ex</span>,
  },
  {
    name: "Node.js",
    color: "bg-green-700",
    icon: () => <span className="text-[10px] font-bold">N</span>,
  },
  {
    name: "Vitest",
    color: "bg-yellow-500",
    icon: () => <span className="text-[10px] font-bold">Vt</span>,
  },
];

export function TechStackSection() {
  return (
    <section id="techstack" className="py-16 bg-white">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Tech stack
            </h3>
            <p className="mt-2 text-gray-600">
              Built with a modern toolchain for speed and reliability.
            </p>
          </div>
          <Link
            to="/techstack"
            className="hidden md:inline-flex items-center rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800"
          >
            View details
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {stack.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm flex items-center gap-3"
            >
              <div
                className={`h-7 w-7 rounded-md text-white grid place-items-center ${s.color}`}
              >
                {s.icon && s.icon()}
              </div>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 md:hidden">
          <Link
            to="/techstack"
            className="inline-flex items-center rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800"
          >
            View details
          </Link>
        </div>
      </div>
    </section>
  );
}
