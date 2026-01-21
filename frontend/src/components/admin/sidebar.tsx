import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Store,
  Truck,
  ShoppingBag,
  Tag,
  FolderOpen,
  BarChart3,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'admin.nav.dashboard', end: true },
  { separator: true, labelKey: 'admin.nav.management' },
  { to: '/admin/users', icon: Users, labelKey: 'admin.nav.users' },
  { to: '/admin/merchants', icon: Store, labelKey: 'admin.nav.merchants' },
  { to: '/admin/drivers', icon: Truck, labelKey: 'admin.nav.drivers' },
  { to: '/admin/orders', icon: ShoppingBag, labelKey: 'admin.nav.orders' },
  { separator: true, labelKey: 'admin.nav.platform' },
  { to: '/admin/promotions', icon: Tag, labelKey: 'admin.nav.promotions' },
  { to: '/admin/categories', icon: FolderOpen, labelKey: 'admin.nav.categories' },
  { separator: true, labelKey: 'admin.nav.analytics' },
  { to: '/admin/reports', icon: BarChart3, labelKey: 'admin.nav.reports' },
];

export function AdminSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: signOut } = useSignOut();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-bold">{t('admin.title')}</span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item, index) => {
              if (item.separator) {
                return (
                  <div key={index} className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
                      {t(item.labelKey)}
                    </p>
                  </div>
                );
              }

              const Icon = item.icon!;
              return (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  end={item.end}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {t(item.labelKey)}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
