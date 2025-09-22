import React, { useState } from "react";
import { MenuBar } from "@/components/ui/animated-menu-bar";

const menuItems = [
  "dashboard",
  "notifications",
  "settings",
  "help",
  "security",
] as const;

type MenuItem = (typeof menuItems)[number];

export default function DemoMenuBar() {
  const [active, setActive] = useState<MenuItem>("dashboard");
  return (
    <div className="container mx-auto py-10">
      <MenuBar active={active} onSelect={setActive} />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Active: <span className="font-semibold">{active}</span>
      </p>
    </div>
  );
}
