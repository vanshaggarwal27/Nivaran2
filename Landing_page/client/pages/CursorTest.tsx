import React from "react";
import { Cursor } from "@/components/ui/cursor";
import { motion } from "framer-motion";

export default function CursorTest() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Cursor Test</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Test 1: Basic cursor */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test 1: Basic Cursor</h2>
            <div className="relative w-64 h-32 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
              <span className="text-blue-800 font-medium">Hover over this area</span>
              <Cursor
                attachToParent
                springConfig={{ stiffness: 300, damping: 28 }}
                variants={{
                  initial: { opacity: 0, scale: 0.6 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.6 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
              >
                <motion.div className="pointer-events-none w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs shadow-lg">
                  <span className="text-xs font-bold">T</span>
                </motion.div>
              </Cursor>
            </div>
          </div>

          {/* Test 2: Multiple cursors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test 2: Multiple Cursors</h2>
            <div className="grid grid-cols-2 gap-4">
              {['React', 'TypeScript', 'Tailwind', 'Node.js'].map((tech) => (
                <div
                  key={tech}
                  className="relative w-full h-24 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center"
                >
                  <span className="text-green-800 font-medium">{tech}</span>
                  <Cursor
                    attachToParent
                    springConfig={{ stiffness: 300, damping: 28 }}
                    variants={{
                      initial: { opacity: 0, scale: 0.6 },
                      animate: { opacity: 1, scale: 1 },
                      exit: { opacity: 0, scale: 0.6 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  >
                    <motion.div className="pointer-events-none w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs shadow-lg">
                      <span className="text-xs font-bold">{tech.charAt(0)}</span>
                    </motion.div>
                  </Cursor>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
