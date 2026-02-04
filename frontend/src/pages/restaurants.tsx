import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MerchantCard } from '@/components/features/merchant-card';
import { useMerchants } from '@/hooks/use-merchants';
import { useCategories } from '@/hooks/use-categories';
import type { Merchant, Category } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function RestaurantsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name'>('rating');

  const { data: merchantsResponse, isLoading: merchantsLoading } = useMerchants({ search: searchQuery });
  const merchants = merchantsResponse?.data;

  const { data: categories } = useCategories();

  // Filter and sort merchants
  const filteredMerchants = merchants
    ?.filter((merchant: Merchant) => {
      if (showOpenOnly && !merchant.isOpen) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          merchant.name.toLowerCase().includes(query) ||
          merchant.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a: Merchant, b: Merchant) => {
      switch (sortBy) {
        case 'rating':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setShowOpenOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || showOpenOnly || searchQuery;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Sort & Filter */}
            <div className="flex gap-2 w-full md:w-auto">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'name')}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="distance">Sort by Distance</option>
              </select>

              {/* Mobile Filter Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge className="ml-2" variant="secondary">
                        {selectedCategories.length + (showOpenOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>
                  <FilterContent
                    categories={categories}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    showOpenOnly={showOpenOnly}
                    setShowOpenOnly={setShowOpenOnly}
                    clearFilters={clearFilters}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {showOpenOnly && (
                <Badge variant="secondary" className="gap-1">
                  Open Now
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setShowOpenOnly(false)}
                  />
                </Badge>
              )}
              {selectedCategories.map((catId) => {
                const cat = categories?.find((c: Category) => c.id === catId);
                return (
                  <Badge key={catId} variant="secondary" className="gap-1">
                    {cat?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleCategory(catId)}
                    />
                  </Badge>
                );
              })}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-36">
              <Card>
                <CardContent className="p-4">
                  <FilterContent
                    categories={categories}
                    selectedCategories={selectedCategories}
                    toggleCategory={toggleCategory}
                    showOpenOnly={showOpenOnly}
                    setShowOpenOnly={setShowOpenOnly}
                    clearFilters={clearFilters}
                  />
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{t('nav.restaurants')}</h1>
              <p className="text-muted-foreground">
                {filteredMerchants?.length || 0} restaurants found
              </p>
            </div>

            {merchantsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 rounded-t-xl" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMerchants?.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold mb-2">
                  {t('common.noResults')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredMerchants?.map((merchant: Merchant) => (
                  <MerchantCard
                    key={merchant.id}
                    merchant={merchant}
                  />
                ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Filter Content Component
function FilterContent({
  categories,
  selectedCategories,
  toggleCategory,
  showOpenOnly,
  setShowOpenOnly,
  clearFilters,
}: {
  categories?: Category[];
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
  showOpenOnly: boolean;
  setShowOpenOnly: (value: boolean) => void;
  clearFilters: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Open Now */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Status
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="open-now"
            checked={showOpenOnly}
            onCheckedChange={(checked) => setShowOpenOnly(checked as boolean)}
          />
          <Label htmlFor="open-now" className="cursor-pointer">
            Open Now
          </Label>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {categories?.map((category: Category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={category.id} className="cursor-pointer flex-1">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
}

