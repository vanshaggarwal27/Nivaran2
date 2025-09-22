import React from "react";

const items = [
  { title: "React", desc: "Component-based UI library powering the app." },
  {
    title: "TypeScript",
    desc: "Static typing for safer, more maintainable code.",
  },
  { title: "TailwindCSS", desc: "Utility-first styling with design tokens." },
  { title: "Firebase", desc: "Realtime database and auth for modern apps." },
  { title: "Express", desc: "Simple, robust Node.js server for APIs." },
  { title: "Node.js", desc: "JavaScript runtime for server-side logic." },
  { title: "Vitest", desc: "Fast unit testing framework." },
];

export default function TechStack() {
  return (
    <div className="py-16">
      <div className="container">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Tech stack
        </h1>
        <p className="mt-3 text-gray-600 max-w-prose">Powered by Gemini</p>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {items.map((it) => (
            <div
              key={it.title}
              className={`relative cursor-pointer z-0 overflow-hidden rounded-2xl border border-zinc-300 bg-zinc-100 p-6 font-semibold text-zinc-800 transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-brand-cta before:transition-transform before:duration-1000 before:content-["\""] hover:scale-105 hover:text-gray-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95`}
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
