import { Outlet } from 'react-router-dom';
import { MerchantSidebar } from '@/components/merchant/sidebar';

export function MerchantLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <MerchantSidebar />
      <main className="lg:ml-64">
        <div className="container mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
