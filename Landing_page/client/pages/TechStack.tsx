import React from "react";

const items = [
  { title: "React 18", desc: "Component-based UI library powering the app." },
  {
    title: "TypeScript",
    desc: "Static typing for safer, more maintainable code.",
  },
  { title: "Vite", desc: "Blazing-fast dev server and build tool." },
  { title: "TailwindCSS", desc: "Utility-first styling with design tokens." },
  { title: "Express", desc: "Simple, robust Node.js server for APIs." },
  { title: "Radix UI", desc: "Accessible primitives used where helpful." },
  { title: "Vitest", desc: "Fast unit testing framework." },
];

export default function TechStack() {
  return (
    <div className="py-16">
      <div className="container">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Tech stack
        </h1>
        <p className="mt-3 text-gray-600 max-w-prose">
          A modern, production-ready setup that scales with your needs.
        </p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {it.title}
              </h3>
              <p className="mt-1 text-gray-600">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
