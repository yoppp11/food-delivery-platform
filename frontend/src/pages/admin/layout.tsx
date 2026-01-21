import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/sidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="lg:ml-64">
        <div className="container mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
