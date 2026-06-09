"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/context/DemoContext";
import DemoGuideOverlay from "@/components/demo/DemoGuideOverlay";
import KeyboardShortcutLegend from "@/components/demo/KeyboardShortcutLegend";

// Left rail navigation items
interface NavItem {
  name: string;
  route: string;
  icon: string;
  badgeKey?: string;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [isRailOpen, setIsRailOpen] = useState(false);
  const unreadCount = 3; // Mock unread count for bell notification

  const navItems: NavItem[] = [
    { name: "Dashboard", route: "/", icon: "fa-chart-line" },
    { name: "Usecase Readiness", route: "/usecase-readiness", icon: "fa-list-check" },
    { name: "All Assessments", route: "/usecase-readiness/all-assessments", icon: "fa-folder-open" },
    { name: "BV Command Center", route: "/bv-command", icon: "fa-building-columns" },
    { name: "Regulatory Intelligence", route: "/regulatory", icon: "fa-scale-balanced" },
    { name: "POC Generator", route: "/poc-generator", icon: "fa-cubes" },
    { name: "Learning Center", route: "/learning", icon: "fa-graduation-cap" },
    { name: "Integrations", route: "/integrations", icon: "fa-puzzle-piece" },
    { name: "Demo Mode", route: "/demo", icon: "fa-play" },
    { name: "Notifications", route: "/notifications", icon: "fa-bell" },
    { name: "Settings", route: "/settings", icon: "fa-gear" },
  ];

  const { demoState } = useDemo();
  const isDemo = demoState.isActive;

  // Helper to get dynamic page title based on current pathname
  const getPageTitle = (): string => {
    let cleanPath = pathname;
    if (pathname.startsWith("/demo")) {
      cleanPath = pathname.substring(5); // Remove "/demo"
      if (cleanPath === "/dashboard") cleanPath = "/";
      if (cleanPath === "/bv") cleanPath = "/bv-command";
      if (cleanPath === "/poc") cleanPath = "/poc-generator";
      if (cleanPath === "") cleanPath = "/demo";
    }

    if (cleanPath === "/") return "Dashboard";
    if (cleanPath.startsWith("/accounts/")) return "Account Detail";
    if (cleanPath.startsWith("/assessments/")) return "Assessment Flow";
    if (cleanPath.startsWith("/reports/")) return "Report View";
    if (cleanPath.startsWith("/strategic-plan/")) return "Strategic Plan";
    if (cleanPath.startsWith("/timeline/")) return "Timeline & Gantt";
    if (cleanPath === "/usecase-readiness") return "Usecase Readiness";
    if (cleanPath === "/usecase-readiness/all-assessments") return "All Assessments";
    
    const matched = navItems.find(item => item.route === cleanPath);
    return matched ? matched.name : "HCLS AI Navigator";
  };

  const toggleRail = () => {
    setIsRailOpen(!isRailOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans relative">
      {isDemo && (
        <>
          <DemoGuideOverlay />
          <KeyboardShortcutLegend />
        </>
      )}
      {/* TOPBAR (Fixed 64px) */}
      <header className="fixed top-0 left-0 right-0 h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
        {/* Left section: Hamburger & Dynamic Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleRail}
            className="text-gray-500 hover:text-gray-900 p-1.5 rounded hover:bg-gray-50 btn-transition focus:outline-none"
            title="Toggle Navigation Menu"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          
          <h1 className="text-base font-bold text-gray-900 select-none">
            {getPageTitle()}
          </h1>
        </div>

        {/* Center section: Global Search Box */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2 w-[420px] focus-within:border-blue focus-within:bg-white btn-transition">
          <i className="fa-solid fa-search text-gray-400 mr-2.5 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search accounts, regulations, metrics..." 
            className="bg-transparent text-sm text-gray-900 focus:outline-none w-full placeholder:text-gray-500"
          />
        </div>

        {/* Right section: Actions, Notification bell, Avatar */}
        <div className="flex items-center gap-4">

          {/* Notification Bell */}
          <Link 
            href="/notifications"
            className="relative text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-50 btn-transition"
            title="Notifications"
          >
            <i className="fa-solid fa-bell text-lg"></i>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full ring-2 ring-white"></span>
            )}
          </Link>

          {/* Vertical Divider */}
          <div className="h-5 w-[1px] bg-gray-200"></div>

          {/* User Profile / Avatar */}
          <Link href="/settings" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue font-bold text-sm group-hover:border-blue btn-transition">
              NA
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900 leading-tight">Nitin Aggarwal</span>
              <span className="text-[11px] text-gray-500 leading-none">CE - HCLS</span>
            </div>
          </Link>
        </div>
      </header>

      {/* MAIN SHELL CONTAINER */}
      <div className="flex flex-1 pt-[64px]">
        
        {/* LEFT RAIL NAVIGATION */}
        <aside 
          className={`fixed top-[64px] left-0 bottom-0 bg-navy text-white border-r border-navy-lt z-30 transition-all duration-300 flex flex-col justify-between ${
            isRailOpen ? "w-[240px]" : "w-16"
          }`}
        >
          {/* Top half: logo + navigation items */}
          <div className="flex flex-col">
            {/* Nav Menu list */}
            <nav className="flex flex-col gap-1.5 py-4 px-2 select-none">
              {navItems.map((item) => {
                const getSidebarRoute = (navItem: typeof item): string => {
                  if (!isDemo) return navItem.route;
                  if (navItem.route === "/") return "/demo/dashboard";
                  if (navItem.route === "/bv-command") return "/demo/bv";
                  if (navItem.route === "/poc-generator") return "/demo/poc";
                  if (navItem.route === "/demo") return "/demo";
                  
                  const demoRoutes = ["/regulatory", "/learning", "/integrations", "/usecase-readiness", "/usecase-readiness/all-assessments"];
                  if (demoRoutes.includes(navItem.route)) {
                    return `/demo${navItem.route}`;
                  }
                  return navItem.route;
                };

                const resolvedRoute = getSidebarRoute(item);
                const isActive = pathname === resolvedRoute || 
                  (resolvedRoute !== "/" && resolvedRoute !== "/demo" && pathname.startsWith(resolvedRoute));
                  
                return (
                  <Link
                    key={item.name}
                    href={resolvedRoute}
                    className={`flex items-center rounded-md btn-transition ${
                      isRailOpen ? "px-3.5 py-3 gap-3.5" : "justify-center py-3 h-11 w-11 mx-auto"
                    } ${
                      isActive 
                        ? "bg-blue-50 text-blue font-semibold" 
                        : "text-gray-500 hover:bg-navy-lt hover:text-white"
                    }`}
                    title={isRailOpen ? undefined : item.name}
                  >
                    <i className={`fa-solid ${item.icon} text-base ${isActive ? "text-blue" : "text-gray-500"}`}></i>
                    {isRailOpen && (
                      <span className="text-sm truncate select-none">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom half: Google Cloud branding */}
          <div className={`p-3 border-t border-navy-lt flex items-center ${isRailOpen ? "gap-3" : "justify-center"}`}>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-extrabold text-sm select-none">
              G
            </div>
            {isRailOpen && (
              <div className="flex flex-col leading-tight select-none">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Partner</span>
                <span className="text-[12px] text-white/80">Google Cloud CE</span>
              </div>
            )}
          </div>
        </aside>

        {/* SCROLLABLE CONTENT WRAPPER */}
        <main 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isRailOpen ? "pl-[240px]" : "pl-16"
          }`}
        >
          <div className="flex-1 p-5 md:p-6 overflow-y-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
