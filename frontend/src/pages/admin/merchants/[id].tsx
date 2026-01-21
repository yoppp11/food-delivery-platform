import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/admin';
import { useAdminMerchant, useVerifyMerchant } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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

export function AdminMerchantDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: merchant, isLoading } = useAdminMerchant(id || '');
  const verifyMutation = useVerifyMerchant();

  const [verifyDialog, setVerifyDialog] = useState(false);

  const handleVerify = () => {
    if (id) {
      verifyMutation.mutate(id, {
        onSuccess: () => setVerifyDialog(false),
      });
    }
  };

  if (isLoading) {
    return <MerchantDetailSkeleton />;
  }

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">{t('admin.merchants.notFound')}</p>
        <Link to="/admin/merchants">
          <Button variant="link">{t('admin.merchants.backToList')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Link
          to="/admin/merchants"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('admin.merchants.backToList')}
        </Link>
        <h1 className="text-2xl font-bold">{merchant.name}</h1>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.merchants.merchantInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center">
                  {merchant.imageUrl ? (
                    <img
                      src={merchant.imageUrl}
                      alt={merchant.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🍕</span>
                  )}
                </div>
                <div>
                  <p className="text-xl font-bold">{merchant.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className={
                        merchant.isOpen
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{merchant.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {merchant.description && (
                <p className="text-muted-foreground">{merchant.description}</p>
              )}

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`https://www.google.com/maps?q=${merchant.latitude},${merchant.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {merchant.latitude.toFixed(6)}, {merchant.longitude.toFixed(6)}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.merchants.actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!merchant.isOpen && (
                <Button
                  onClick={() => setVerifyDialog(true)}
                  className="w-full"
                >
                  {t('admin.merchants.verifyMerchant')}
                </Button>
              )}
              <Button variant="outline" asChild className="w-full">
                <a
                  href={`https://www.google.com/maps?q=${merchant.latitude},${merchant.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('admin.merchants.viewOnMap')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ConfirmDialog
        open={verifyDialog}
        onOpenChange={setVerifyDialog}
        title={t('admin.merchants.confirmVerify')}
        description={t('admin.merchants.confirmVerifyDesc', { name: merchant.name })}
        onConfirm={handleVerify}
        isLoading={verifyMutation.isPending}
      />
    </motion.div>
  );
}

function MerchantDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
