import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  Star,
  ChevronRight,
  Utensils,
  Truck,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MerchantCard } from '@/components/features/merchant-card';
import { useCategories } from '@/hooks/use-categories';
import { useFeaturedMerchants } from '@/hooks/use-merchants';
import { useActivePromotions } from '@/hooks/use-promotions';
import { formatCurrency } from '@/lib/utils';
import { getCategoryIcon } from '@/constants/images';
import type { Category, Merchant, Promotion } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
    },
  },
};

export function HomePage() {
  const { t } = useTranslation();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { data: merchants, isLoading: merchantsLoading } = useFeaturedMerchants(6);

  const { data: promotions, isLoading: promotionsLoading } = useActivePromotions();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="secondary" className="px-4 py-1">
                🎉 Free delivery on first order!
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('home.hero.title')}{' '}
                <span className="text-primary">{t('home.hero.subtitle')}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                {t('home.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" asChild>
                  <Link to="/restaurants">
                    {t('home.hero.cta')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t('home.hero.deliveryTime')}
                    </p>
                    <p className="font-semibold">25-35 {t('home.hero.minutes')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-semibold">4.8/5</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[500px] w-full">
                <motion.img
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
                  alt="Delicious food"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 object-cover rounded-full shadow-2xl"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-20 left-0 bg-background rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">On orders over Rp 50k</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-0 right-0 bg-background rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Safe Food</p>
                      <p className="text-sm text-muted-foreground">100% Guaranteed</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {t('home.categories.title')}
              </h2>
              <p className="text-muted-foreground mt-1">
                {t('home.categories.subtitle')}
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/restaurants">
                {t('common.viewAll')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
            >
              {categories?.map((category: Category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link to={`/restaurants?category=${category.id}`}>
                    <Card className="group cursor-pointer hover:border-primary transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="text-4xl mb-2"
                        >
                          {getCategoryIcon(category.name)}
                        </motion.div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {category.name}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Promotions Section */}
      {!promotionsLoading && promotions && promotions.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {t('home.promotions.title')}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {t('home.promotions.subtitle')}
                </p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {promotions?.map((promo: Promotion) => (
                <motion.div key={promo.id} variants={itemVariants}>
                  <Card className="overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge
                            variant="secondary"
                            className="mb-3 bg-white/20 text-white hover:bg-white/30"
                          >
                            {promo.discountType === 'PERCENT'
                              ? `${promo.discountValue}% OFF`
                              : `${formatCurrency(promo.discountValue)} OFF`}
                          </Badge>
                          <h3 className="text-xl font-bold mb-2">
                            {t('home.promotions.useCode')}
                          </h3>
                          <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
                            <code className="font-mono font-bold text-lg">
                              {promo.code}
                            </code>
                          </div>
                          <p className="text-sm mt-3 opacity-90">
                            Max discount: {formatCurrency(promo.maxDiscount)}
                          </p>
                        </div>
                        <div className="text-6xl opacity-50">🎁</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Merchants Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {t('home.featured.title')}
              </h2>
              <p className="text-muted-foreground mt-1">
                {t('home.featured.subtitle')}
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/restaurants">
                {t('common.viewAll')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
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
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {merchants?.map((merchant: Merchant) => (
                <MerchantCard key={merchant.id} merchant={merchant} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why Choose FoodGo?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We deliver more than just food. We deliver happiness, convenience, and
              the best dining experience right to your doorstep.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Clock,
                title: 'Fast Delivery',
                description:
                  'Get your food delivered in 30 minutes or less. Hot and fresh, every time.',
              },
              {
                icon: Utensils,
                title: 'Best Quality',
                description:
                  'We partner with the best restaurants to ensure quality food every order.',
              },
              {
                icon: Shield,
                title: 'Safe & Secure',
                description:
                  'Contactless delivery options and secure payment for your peace of mind.',
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center h-full">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="h-16 w-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
                    >
                      <feature.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Order?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Browse our partner restaurants and discover your next favorite meal.
              Fresh, delicious food delivered right to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="secondary" asChild>
                <Link to="/restaurants">
                  Browse Restaurants
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


