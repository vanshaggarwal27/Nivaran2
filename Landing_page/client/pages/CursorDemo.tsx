import React from "react";
import { CursorWithComponent } from "@/components/ui/cursor-demo";

export default function CursorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Cursor Component Demo</h1>
        <div className="max-w-2xl mx-auto">
          <CursorWithComponent />
        </div>
      </div>
    </div>
  );
}
