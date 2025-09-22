import React from "react";

type DefaultKeys = "dashboard" | "notifications" | "settings" | "help" | "security";

interface MenuItem {
  key: string;
  label: string;
  to?: string;
  icon?: React.ReactNode;
}

interface MenuBarProps {
  active?: string;
  onSelect?: (key: string) => void;
  items?: MenuItem[]; // optional custom items (for header)
}

const icons: Record<DefaultKeys, React.ReactNode> = {
  dashboard: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 9.5L12 4l9 5.5v7.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  notifications: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
      <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  settings: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  help: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  security: (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

interface IconButtonProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, active, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const expandedWidth = Math.max(44 + label.length * 9 + 32, 120);
  const isExpanded = hovered || !!active;

  const handleMobileTooltip = (e: React.MouseEvent) => {
    if (window.innerWidth < 640) {
      e.preventDefault();
      setShowTooltip(true);
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1200);
    }
    if (onClick) onClick();
  };

  React.useEffect(() => {
    return () => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    };
  }, []);

  const baseClasses = `transition-colors duration-200 inline-flex items-center justify-start rounded-lg px-4 py-2 text-sm font-medium border focus:outline-none relative overflow-hidden`;
  const activeClasses = `border-brand-cta bg-brand-cta text-gray-900 font-semibold`;
  const inactiveClasses = `border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-zinc-300 dark:hover:text-white`;

  return (
    <button
      type="button"
      aria-label={label}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
      style={{
        minWidth: 44,
        transition: "background 0.2s, border 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleMobileTooltip}
    >
      {/* mobile tooltip */}
      <span
        className={`sm:hidden absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs rounded px-2 py-1 shadow transition-opacity duration-200 pointer-events-none z-20 ${
          showTooltip ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>

      {/* Icon */}
      {icon ? (
        <span className="flex items-center justify-center size-5 text-lg text-current">{icon}</span>
      ) : null}

      {/* Label: hidden unless hovered or active */}
      <span
        className={`ml-3 text-sm transition-all duration-200 whitespace-nowrap inline-block ${
          isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
        }`}
        style={{
          transition: "opacity 0.2s, width 0.25s",
        }}
      >
        {label}
      </span>
    </button>
  );
};

export const MenuBar: React.FC<MenuBarProps> = ({ active = "dashboard", onSelect, items }) => {
  // If custom items are provided, render them instead of defaults
  if (items && items.length > 0) {
    return (
      <nav className="flex items-center gap-3">
        {items.map((it) => (
          <IconButton
            key={it.key}
            label={it.label}
            active={active === it.key}
            onClick={() => {
              onSelect?.(it.key);
              if (it.to) {
                // navigate to provided path/anchor
                window.location.href = it.to;
              }
            }}
            icon={it.icon}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 bg-white dark:bg-zinc-950 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-fit mx-auto transition-all duration-300">
      <IconButton
        icon={icons.dashboard}
        label="Dashboard"
        active={active === "dashboard"}
        onClick={() => onSelect?.("dashboard")}
      />
      <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />
      <IconButton
        icon={icons.notifications}
        label="Notifications"
        active={active === "notifications"}
        onClick={() => onSelect?.("notifications")}
      />
      <IconButton
        icon={icons.settings}
        label="Settings"
        active={active === "settings"}
        onClick={() => onSelect?.("settings")}
      />
      <IconButton
        icon={icons.help}
        label="Help"
        active={active === "help"}
        onClick={() => onSelect?.("help")}
      />
      <IconButton
        icon={icons.security}
        label="Security"
        active={active === "security"}
        onClick={() => onSelect?.("security")}
      />
    </nav>
  );
};

export default MenuBar;
