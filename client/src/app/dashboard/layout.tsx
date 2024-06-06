import DashboardNavigation from "@/components/template/dashboard-nav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <>
      <DashboardNavigation username={user.username} />
      <TooltipProvider
        disableHoverableContent
        delayDuration={500}
        skipDelayDuration={0}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
          <Toaster />
        </div>
      </TooltipProvider>
    </>
  );
}
