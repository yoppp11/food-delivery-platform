import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  Store,
  ArrowRight,
  Tag,
  X,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/providers/cart-provider';
import { formatCurrency } from '@/lib/utils';

export function CartPage() {
  const { t } = useTranslation();
  const { cart, isLoading, updateItem, removeItem, clearCart, getSubtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = cart ? 15000 : 0;
  const discount = appliedPromo?.discount || 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME50') {
      const discountAmount = Math.min(subtotal * 0.5, 50000);
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: discountAmount });
      setPromoCode('');
    } else if (promoCode.toUpperCase() === 'FLAT20K') {
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: 20000 });
      setPromoCode('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('cart.emptyDescription')}
          </p>
          <Button asChild size="lg">
            <Link to="/restaurants">
              <Store className="mr-2 h-5 w-5" />
              {t('cart.browseRestaurants')}
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">{t('cart.title')}</h1>
          <Button variant="ghost" onClick={clearCart} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            {t('cart.clearCart')}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Restaurant Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('cart.from')}</p>
                    <Link
                      to={`/restaurants/${cart.merchant.id}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {cart.merchant.name}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardContent className="p-4">
                <AnimatePresence mode="popLayout">
                  {cart.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-4 py-4">
                        <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.menu.imageUrl || item.menu.image?.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100'}
                            alt={item.menu.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.menu.name}</h3>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="text-primary font-semibold mt-1">
                            {formatCurrency(item.variant?.price || item.menu.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {index < cart.items.length - 1 && <Separator />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="font-medium">{t('cart.promoCode')}</span>
                </div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{appliedPromo.code}</Badge>
                      <span className="text-sm text-green-600">
                        -{formatCurrency(appliedPromo.discount)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAppliedPromo(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={handleApplyPromo}>{t('cart.applyPromo')}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  {t('checkout.orderSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('cart.deliveryFee')}
                    </span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('cart.discount')}</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    {t('cart.checkout')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
