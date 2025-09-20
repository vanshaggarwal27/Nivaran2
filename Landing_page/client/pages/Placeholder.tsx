import React from "react";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="py-20">
      <div className="container">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-4 text-gray-600 max-w-prose">
          This page is coming next. Tell me what content and layout you want
          here and I'll build it.
        </p>
      </div>
    </div>
  );
}
