"use client";
import { use, useState } from "react";
import Header from "@/components/dashboard/Header";
import MainSidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SecondarySidebar from "@/components/dashboard/SecondarySidebar";
import {
  useSecondarySidebarOpen,
  useSetSecondarySidebarOpen,
} from "@/store/sidebarStore";


export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Sidebar open state (for main sidebar only)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Secondary sidebar state from global store
  const secondarySidebarOpen = useSecondarySidebarOpen();
  const setSecondarySidebarOpen = useSetSecondarySidebarOpen();

  // Authentication is now handled by middleware
  // No need for client-side guards

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <MainSidebar />
      <main className="grow">
        <Header
          onToggleFullscreen={() => {
            if (sidebarOpen || secondarySidebarOpen) {
              setSidebarOpen(false);
              setSecondarySidebarOpen(false);
            } else {
              setSidebarOpen(true);
              setSecondarySidebarOpen(true);
            }
          }}
          sidebarOpen={sidebarOpen}
          secondarySidebarOpen={secondarySidebarOpen}
        />

        <div className="px-4 md:px-10 py-10">{children}</div>
      </main>
      {/* SecondarySidebar only on xl screens, toggleable */}
      <div className="hidden xl:block">
        <SidebarProvider
          open={secondarySidebarOpen}
          onOpenChange={setSecondarySidebarOpen}
        >
          <SecondarySidebar />
        </SidebarProvider>
      </div>
    </SidebarProvider>
  );
}
