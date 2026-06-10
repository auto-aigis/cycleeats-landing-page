"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { authApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Scan,
  Calendar,
  Utensils,
  MessageCircle,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { user, loading, logout, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscription, setSubscription] = useState<{
    tier: string;
    can_use_recipes: boolean;
    can_use_ask: boolean;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      authApi.subscription().then(setSubscription).catch(() => setSubscription(null));
    }
  }, [user]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/scanner", label: "Scan Ingredients", icon: Scan },
    { href: "/meal-plan", label: "Meal Plan", icon: Utensils },
    { href: "/symptom-log", label: "Symptom Log", icon: Calendar },
  ];

  if (subscription?.can_use_recipes) {
    navItems.push({ href: "/recipes", label: "PCOS Essentials", icon: BookOpen });
  }

  if (subscription?.can_use_ask) {
    navItems.push({ href: "/ask", label: "Ask CycleEats", icon: MessageCircle });
  }

  navItems.push({ href: "/settings", label: "Settings", icon: Settings });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col">
        <div className="flex h-14 items-center border-b border-gray-200 bg-white px-6">
          <span className="text-lg font-semibold text-gray-900">CycleEats</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto bg-white">
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
<Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-lg font-semibold text-gray-900">CycleEats</span>
          <div className="w-10" />
        </div>
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-10 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg">
              <div className="flex h-14 items-center border-b border-gray-200 px-6">
                <span className="text-lg font-semibold text-gray-900">CycleEats</span>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-gray-200 p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Log out
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="md:pl-64">
        <main className="pt-14 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
