import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { merchantApi, menuApi, reviewApi } from '@/services/api';
import { useCart } from '@/providers/cart-provider';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import type { Menu, MenuVariant, MerchantReview } from '@/types';

const menuImages = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
];

const bannerImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
];

export function RestaurantDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { addItem, cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: merchant, isLoading: merchantLoading } = useQuery({
    queryKey: ['merchant', id],
    queryFn: () => merchantApi.getById(id!),
    enabled: !!id,
  });

  const { data: menus, isLoading: menusLoading } = useQuery({
    queryKey: ['menus', id],
    queryFn: () => menuApi.getByMerchant(id!),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewApi.getByMerchant(id!),
    enabled: !!id,
  });

  const filteredMenus = menus?.filter((menu: Menu) =>
    menu.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group menus by category (simulated)
  const menuCategories = [
    { name: 'Popular', menus: filteredMenus?.slice(0, 3) || [] },
    { name: 'Main Course', menus: filteredMenus?.slice(0, 4) || [] },
    { name: 'Beverages', menus: filteredMenus?.slice(-2) || [] },
  ];

  const handleAddToCart = () => {
    if (selectedMenu && merchant) {
      addItem(merchant, selectedMenu, selectedVariant || undefined, quantity);
      setIsDialogOpen(false);
      setSelectedMenu(null);
      setSelectedVariant(null);
      setQuantity(1);
    }
  };

  const openMenuDialog = (menu: Menu) => {
    setSelectedMenu(menu);
    setSelectedVariant(menu.variants?.[0] || null);
    setQuantity(1);
    setIsDialogOpen(true);
  };

  const calculatePrice = () => {
    if (!selectedMenu) return 0;
    const basePrice = selectedMenu.price;
    const variantPrice = selectedVariant?.price || 0;
    return (basePrice + variantPrice) * quantity;
  };

  if (merchantLoading) {
    return <RestaurantDetailSkeleton />;
  }

  if (!merchant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
        <Button asChild>
          <a href="/restaurants">Back to Restaurants</a>
        </Button>
      </div>
    );
  }

  const bannerImage = bannerImages[parseInt(merchant.id) % bannerImages.length];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 lg:h-96">
        <img
          src={bannerImage}
          alt={merchant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={merchant.isOpen ? 'success' : 'secondary'}>
                  {merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
                </Badge>
                {merchant.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{merchant.rating.toString()}</span>
                    <span className="text-white/70">
                      ({reviews?.length || 0} {t('merchant.reviews')})
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{merchant.name}</h1>
              <p className="text-white/80 max-w-2xl">{merchant.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>25-35 min delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>1.2 km away</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>+62 812 3456 7890</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="menu">{t('merchant.menu')}</TabsTrigger>
            <TabsTrigger value="info">{t('merchant.info')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('merchant.reviewsTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('merchant.searchMenu')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {menusLoading ? (
              <MenuSkeleton />
            ) : filteredMenus?.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">{t('merchant.noMenus')}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {menuCategories.map((category, idx) => (
                  <div key={idx}>
                    <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {category.menus.map((menu: Menu, menuIdx: number) => (
                        <MenuCard
                          key={menu.id}
                          menu={menu}
                          image={menuImages[menuIdx % menuImages.length]}
                          onAdd={() => openMenuDialog(menu)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{merchant.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">{t('merchant.operationalHours')}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                      (day) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-muted-foreground">{day}</span>
                          <span>09:00 - 22:00</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground mb-4">
                    Jl. Sudirman No. 123, Jakarta Selatan
                  </p>
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Map placeholder</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Review Summary */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{merchant.rating?.toString()}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(Number(merchant.rating) || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reviews?.length || 0} reviews
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-20" />
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-4">{rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{
                                width: `${(rating / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews?.map((review: MerchantReview) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${review.userId}`} />
                          <AvatarFallback>
                            {getInitials(`User ${review.userId}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">User {review.userId}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cart Summary (if items from this merchant) */}
      <AnimatePresence>
        {cart && cart.merchantId === merchant.id && cart.items.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(
                      cart.items.reduce(
                        (sum, item) =>
                          sum +
                          (item.menu.price + (item.variant?.price || 0)) * item.quantity,
                        0
                      )
                    )}
                  </p>
                </div>
              </div>
              <Button asChild>
                <a href="/cart">{t('cart.checkout')}</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to Cart Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedMenu?.name}</DialogTitle>
          </DialogHeader>

          {selectedMenu && (
            <div className="space-y-4">
              <img
                src={menuImages[0]}
                alt={selectedMenu.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              <p className="text-muted-foreground">{selectedMenu.description}</p>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">
                  {formatCurrency(selectedMenu.price)}
                </span>
                <Badge variant={selectedMenu.isAvailable ? 'success' : 'secondary'}>
                  {selectedMenu.isAvailable
                    ? t('menu.available')
                    : t('menu.unavailable')}
                </Badge>
              </div>

              {/* Variants */}
              {selectedMenu.variants && selectedMenu.variants.length > 0 && (
                <div>
                  <Label className="mb-2 block">{t('menu.variant')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedMenu.variants.map((variant) => (
                      <Button
                        key={variant.id}
                        variant={
                          selectedVariant?.id === variant.id ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedVariant(variant)}
                        className="w-full"
                      >
                        {variant.name}
                        {variant.price > 0 && (
                          <span className="ml-1 text-xs">
                            +{formatCurrency(variant.price)}
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <Label className="mb-2 block">{t('menu.quantity')}</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <Label className="mb-2 block">{t('menu.specialInstructions')}</Label>
                <Textarea placeholder={t('menu.instructionsPlaceholder')} />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex items-center justify-between flex-1">
              <span className="text-lg font-semibold">
                {t('menu.total')}: {formatCurrency(calculatePrice())}
              </span>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedMenu?.isAvailable}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('menu.addToCart')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Menu Card Component
function MenuCard({
  menu,
  image,
  onAdd,
}: {
  menu: Menu;
  image: string;
  onAdd: () => void;
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden cursor-pointer" onClick={onAdd}>
        <CardContent className="p-0">
          <div className="flex">
            <div className="flex-1 p-4">
              <h3 className="font-semibold">{menu.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {menu.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold text-primary">
                  {formatCurrency(menu.price)}
                </span>
                {!menu.isAvailable && (
                  <Badge variant="secondary">{t('menu.unavailable')}</Badge>
                )}
              </div>
            </div>
            <div className="relative w-32 h-32">
              <img
                src={image}
                alt={menu.name}
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-lg"
                disabled={!menu.isAvailable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Skeleton Components
function RestaurantDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-64 md:h-80 lg:h-96 w-full" />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <MenuSkeleton />
      </div>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-0">
            <div className="flex">
              <div className="flex-1 p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="w-32 h-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
