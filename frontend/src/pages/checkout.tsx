import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  CreditCard,
  Wallet,
  Building,
  Check,
  ChevronRight,
  Plus,
  ShoppingBag,
  Loader2,
  PartyPopper,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCart } from '@/providers/cart-provider';
import { useAddresses } from '@/hooks/use-addresses';
import { useCreateOrder } from '@/hooks/use-orders';
import { formatCurrency } from '@/lib/utils';
import type { UserAddress } from '@/types';

type PaymentMethod = 'card' | 'ewallet' | 'bank' | 'cod';

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, getSubtotal, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('ewallet');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { data: addresses } = useAddresses();
  const createOrder = useCreateOrder();

  // Set default address
  if (!selectedAddress && addresses?.length) {
    const defaultAddr = addresses.find((a: UserAddress) => a.isDefault);
    setSelectedAddress(defaultAddr?.id || addresses[0].id);
  }

  const subtotal = getSubtotal();
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const paymentMethods = [
    { id: 'ewallet', name: 'E-Wallet', icon: Wallet, description: 'GoPay, OVO, Dana' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, description: 'BCA, Mandiri, BNI' },
    { id: 'cod', name: 'Cash on Delivery', icon: Truck, description: 'Pay when delivered' },
  ];

  const handlePlaceOrder = async () => {
    if (!cart) return;
    
    setIsProcessing(true);
    const orderItems = cart.items.map((item) => ({
      variantId: item.variant?.id || item.menu.id,
      quantity: item.quantity,
      price: item.variant?.price || item.menu.price,
    }));
    
    createOrder.mutate(
      {
        merchantId: cart.merchantId,
        items: orderItems,
        totalPrice: total,
        deliveryFee,
      },
      {
        onSuccess: (order) => {
          setOrderId(order.id);
          setIsProcessing(false);
          setIsSuccess(true);
        },
        onError: () => {
          setIsProcessing(false);
        },
      }
    );
  };

  const handleContinue = () => {
    clearCart();
    navigate('/orders');
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <Button asChild>
            <Link to="/restaurants">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentAddress = addresses?.find((a: UserAddress) => a.id === selectedAddress);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('checkout.deliveryAddress')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentAddress ? (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{currentAddress.label}</span>
                        {currentAddress.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{currentAddress.address}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddressDialogOpen(true)}
                    >
                      {t('checkout.changeAddress')}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsAddressDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('checkout.addAddress')}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {t('checkout.paymentMethod')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-muted-foreground/30'
                      }`}
                      onClick={() => setSelectedPayment(method.id as PaymentMethod)}
                    >
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          selectedPayment === method.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      {selectedPayment === method.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Order Items
                  </span>
                  <Link
                    to="/cart"
                    className="text-sm font-normal text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                          {item.quantity}x
                        </span>
                        <div>
                          <p className="font-medium">{item.menu.name}</p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(
                          (item.menu.price + (item.variant?.price || 0)) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary')}</CardTitle>
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
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !currentAddress}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('checkout.processing')}
                    </>
                  ) : (
                    t('checkout.placeOrder')
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Selection Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {addresses?.map((address: UserAddress) => (
              <div
                key={address.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAddress === address.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-muted-foreground/30'
                }`}
                onClick={() => {
                  setSelectedAddress(address.id);
                  setIsAddressDialogOpen(false);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{address.label}</span>
                  {address.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{address.address}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="py-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-7xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">{t('checkout.orderPlaced')}</h2>
            <p className="text-muted-foreground mb-2">
              {t('checkout.orderConfirmation')}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: <span className="font-mono font-medium">{orderId}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleContinue} size="lg">
                <Truck className="mr-2 h-5 w-5" />
                {t('checkout.trackOrder')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  navigate('/');
                }}
              >
                {t('checkout.backToHome')}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
