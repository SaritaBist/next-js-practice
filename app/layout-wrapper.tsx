'use client';

import { usePathname } from 'next/navigation';
import Header from './dashboard/components/Header';
import Sidebar from './dashboard/components/Sidebar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define routes where you don't want sidebar/header
  const authRoutes = ['/sign-in', '/signup'];
  const isAuthPage = authRoutes.includes(pathname);

  // If it's an auth page, render children without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, render with sidebar and header
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen">
        <Header />
        <main className="pt-20 px-8">{children}</main>
      </div>
    </div>
  );
}