import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, BarChart3, CircleUserRound, LayoutDashboard, ListChecks, LogOut, Medal, Settings, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/issues", label: "Issues", icon: ListChecks },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/leaderboard", label: "Leaderboard", icon: Medal },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
            <div className="size-7 rounded-md bg-primary grid place-items-center text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-base">NIVARAN</div>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((n) => (
                  <SidebarMenuItem key={n.to}>
                    <SidebarMenuButton asChild isActive={location.pathname === n.to}>
                      <NavLink to={n.to}>
                        <n.icon />
                        <span>{n.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2">
            <div className="size-8 rounded-full bg-accent grid place-items-center text-accent-foreground">
              <CircleUserRound className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium leading-4">{user?.name || "User"}</div>
              <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
            </div>
            {user?.role ? <Badge variant="outline" className="ml-auto capitalize">{user.role}</Badge> : null}
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
          <div className="flex h-14 items-center px-3 gap-2">
            <SidebarTrigger />
            <div className="font-semibold">{pageTitle(location.pathname)}</div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications" title="Notifications">
                  <Bell />
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function pageTitle(path: string) {
  switch (path) {
    case "/":
      return "Dashboard";
    case "/issues":
      return "Issues";
    case "/analytics":
      return "Analytics";
    case "/leaderboard":
      return "Leaderboard";
    case "/settings":
      return "Settings";
    default:
      return "NIVARAN";
  }
}
