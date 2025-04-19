
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Download,
  Settings,
  Play,
  Folder,
  Wifi,
  Search,
  FileVideo,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define your navigation items
const navigationItems = [
  {
    title: "Dashboard",
    icon: <Play size={20} />,
    path: "/",
  },
  {
    title: "Downloads",
    icon: <Download size={20} />,
    path: "/downloads",
  },
  {
    title: "History",
    icon: <FileVideo size={20} />,
    path: "/history",
  },
  {
    title: "Network",
    icon: <Wifi size={20} />,
    path: "/network",
  },
  {
    title: "Settings",
    icon: <Settings size={20} />,
    path: "/settings",
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarContent>
        <div className="flex flex-col items-center justify-center py-6 mb-4">
          <div className="flex items-center gap-2">
            <Download className="text-primary w-8 h-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VideoVelocity
            </h1>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )
                      }
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto px-4 py-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium text-muted-foreground mb-2">Network Status</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
