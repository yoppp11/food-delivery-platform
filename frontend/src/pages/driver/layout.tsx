import { Outlet } from 'react-router-dom';
import { DriverSidebar } from '@/components/driver/sidebar';

export function DriverLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DriverSidebar />
      <main className="lg:ml-64">
        <div className="container mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
