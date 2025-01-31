// /dashboard/layout.tsx
import MainLayout from '@/components/Layout/MainLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout fixedTopbar={true} topBarText="Dashboard" topBarIcon="dashborad">
      {children}
    </MainLayout>
  );
}
