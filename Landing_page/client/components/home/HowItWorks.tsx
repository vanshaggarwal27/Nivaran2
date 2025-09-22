import React from "react";
const steps = [
  {
    img: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2F5b23fe827caf4b33b9f65e580e2d5954?format=webp&width=800",
    title: "See",
    desc: "Spot an issue around you — roads, lighting, sanitation and more.",
  },
  {
    img: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2F51ac7ee802094f1aa63277a70a3fe43c?format=webp&width=800",
    title: "Say",
    desc: "Report it instantly in the app. No clunky forms or hold times.",
  },
  {
    img: "https://cdn.builder.io/api/v1/image/assets%2Fbe8b85e214da4701834e57936a69c599%2Fa8b0c3f1f3df462fa12830c313efaea3?format=webp&width=800",
    title: "Sort",
    desc: "We route it to the right department so it gets resolved.",
  },
];

export function HowItWorks() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            How Nivaran Works
          </h2>
          <p className="mt-4 text-gray-600">
            A simple three-step process to get things sorted fast.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.title}
              className="group relative mt-4 overflow-hidden rounded-2xl shadow-sm h-56"
              aria-label={s.title}
            >
              <div
                className="w-full h-full scale-105 group-hover:scale-100 transition-all duration-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${s.img})` }}
                aria-hidden
              />

              <article className="absolute inset-0 p-6 flex flex-col justify-end rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
                <div className="translate-y-6 group-hover:translate-y-0 transition-all duration-300 space-y-2">
                  <h1 className="md:text-2xl font-semibold text-white">
                    {s.title}
                  </h1>
                  <p className="sm:text-base text-sm text-white/90">{s.desc}</p>
                </div>
              </article>

              <article className="p-2 w-full h-[20%] flex flex-col justify-end overflow-hidden absolute bottom-0 rounded-b-md opacity-100 group-hover:opacity-0 group-hover:-bottom-4 transition-all duration-300 bg-gradient-to-t from-black/40">
                <h1 className="md:text-2xl font-semibold text-white">
                  {s.title}
                </h1>
                <p className="sm:text-base text-sm text-white/90" />
              </article>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/start-snapping"
            className="inline-flex items-center rounded-full bg-brand-cta text-gray-900 px-6 py-3 text-sm font-semibold hover:brightness-95"
          >
            Start Sorting
          </a>
        </div>
      </div>
    </section>
  );
}
