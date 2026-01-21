import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderOpen,
  Star,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Store,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSignOut } from '@/hooks/use-auth';
import { useMerchantContext } from '@/providers/merchant-provider';
import { useState } from 'react';

const navItems = [
  { to: '/merchant', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/merchant/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/merchant/menus', icon: UtensilsCrossed, label: 'Menus' },
  { to: '/merchant/categories', icon: FolderOpen, label: 'Categories' },
  { to: '/merchant/reviews', icon: Star, label: 'Reviews' },
  { to: '/merchant/settings', icon: Settings, label: 'Settings' },
  { to: '/merchant/notifications', icon: Bell, label: 'Notifications' },
];

export function MerchantSidebar() {
  const navigate = useNavigate();
  const { mutate: signOut } = useSignOut();
  const { currentMerchant, merchants, selectMerchant } = useMerchantContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        navigate('/merchant/login', { replace: true });
      },
    });
  };

  const handleSelectMerchant = (merchantId: string) => {
    selectMerchant(merchantId);
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
            <span className="text-2xl">🍕</span>
            <span className="ml-2 text-lg font-bold">Merchant Portal</span>
          </div>

          {merchants.length > 1 && (
            <div className="border-b p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Store className="h-4 w-4 shrink-0" />
                      <span className="truncate">{currentMerchant?.name || 'Select Merchant'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {merchants.map((merchant) => (
                    <DropdownMenuItem
                      key={merchant.id}
                      onClick={() => handleSelectMerchant(merchant.id)}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{merchant.name}</span>
                      {currentMerchant?.id === merchant.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/merchant/select')}>
                    View all merchants
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
