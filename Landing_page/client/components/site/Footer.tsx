import React from "react";

const groups = [
  {
    title: "About Us",
    links: [
      { label: "About Us", to: "/about-us" },
      { label: "In the News", to: "/about-us" },
      { label: "How it Works", to: "/how-it-works" },
      { label: "Our Business Model", to: "/about-us" },
      { label: "Collaborate with us", to: "/about-us" },
    ],
  },
  {
    title: "Nivcrew",
    links: [
      { label: "What is a Nivcrew?", to: "/snappers" },
      { label: "What to Snap", to: "/snappers" },
      { label: "Where to Snap", to: "/snappers" },
      { label: "Events", to: "/snappers" },
      { label: "Nivcrew Kit", to: "/snappers" },
    ],
  },
  {
    title: "Nivsewaks",
    links: [
      { label: "Who are our Nivsewaks?", to: "/solvers" },
      { label: "Local Government", to: "/solvers" },
      { label: "Utilities", to: "/solvers" },
      { label: "Universities", to: "/solvers" },
      { label: "Nivsewak Kit", to: "/solvers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", to: "/help-centre" },
      { label: "Contact us", to: "/contact" },
      { label: "Release Notes", to: "/support" },
      { label: "Solver Portal", to: "/support" },
      { label: "Refer a friend", to: "/support" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-cream border-t border-gray-200">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {g.title}
            </h3>
            <ul className="space-y-2">
              {g.links.map((l) => (
                <li key={l.label}>
                  <a
                    className="text-sm text-gray-600 hover:text-gray-900"
                    href={l.to}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Responsible Disclosure • Privacy Policy • Terms of Use • AI Usage
            Policy
          </p>
          <p className="text-xs text-gray-500">
            Copyright © {new Date().getFullYear()} Snap Send Solve Pty Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}
