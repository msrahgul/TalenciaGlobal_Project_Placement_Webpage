import { Link, useRouterState } from "@tanstack/react-router";
import { Building2, GraduationCap, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Company Intelligence", url: "/company/intelligence", icon: Building2 },
  { title: "Skill Intelligence", url: "/company/skills", icon: GraduationCap },
];

export function AppSidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <Sidebar collapsible="icon" className="floating-sidebar border-0">
      <SidebarHeader className="border-0 pb-2 pt-3">
        <div className="flex items-center gap-2.5 px-2">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold text-white font-heading"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow: "0 4px 14px -4px rgba(37,99,235,0.55)",
            }}
          >
            K
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-heading font-bold text-foreground">KITS</span>
            <span className="text-[10px] text-muted-foreground">Placement Hub</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Navigate
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                        style={
                          active
                            ? {
                                background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 100%)",
                                color: "#60a5fa",
                                boxShadow: "0 2px 8px -2px rgba(59,130,246,0.25)",
                              }
                            : {}
                        }
                      >
                        <item.icon
                          className="h-4 w-4 shrink-0"
                          style={{ color: active ? "#60a5fa" : undefined }}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/40 px-2 pb-3 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/"
                className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>All Companies</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
