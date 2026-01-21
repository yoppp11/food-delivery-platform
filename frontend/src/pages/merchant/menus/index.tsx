import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuCard } from '@/components/merchant/menu-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, UtensilsCrossed, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useMerchantMenus, useDeleteMenu } from '@/hooks/use-merchant-menus';
import { useDebounce } from '@/hooks/use-debounce';
import type { Menu } from '@/types/merchant';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function MerchantMenusPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { data: menusResponse, isLoading } = useMerchantMenus(debouncedSearch, page);
  const deleteMenuMutation = useDeleteMenu();

  const handleDeleteConfirm = () => {
    if (deleteMenuId) {
      deleteMenuMutation.mutate(deleteMenuId, {
        onSuccess: () => setDeleteMenuId(null),
      });
    }
  };

  const menus = menusResponse?.data || [];
  const totalPages = Math.ceil((menusResponse?.total || 0) / (menusResponse?.limit || 10));

  if (isLoading) {
    return <MenusSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Create and manage your menu items</p>
        </div>
        <Link to="/merchant/menus/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {isLoading ? (
        <MenusSkeleton />
      ) : menus.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-12"
        >
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No menus found</p>
          {debouncedSearch && (
            <Button variant="link" onClick={() => setSearch('')}>
              Clear search
            </Button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div variants={containerVariants} className="space-y-4">
            {menus.map((menu: Menu) => (
              <motion.div key={menu.id} variants={itemVariants}>
                <MenuCard
                  menu={menu}
                  onDelete={() => setDeleteMenuId(menu.id)}
                  isDeleting={deleteMenuMutation.isPending && deleteMenuId === menu.id}
                />
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!deleteMenuId} onOpenChange={() => setDeleteMenuId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteMenuId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMenuMutation.isPending}
            >
              {deleteMenuMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function MenusSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}
