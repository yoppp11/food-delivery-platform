import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreatePromotion } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';

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

export function NewPromotionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createMutation = useCreatePromotion();

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENT' as 'PERCENT' | 'FLAT',
    discountValue: '',
    maxDiscount: '',
    expiredAt: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscount: Number(formData.maxDiscount),
        expiredAt: new Date(formData.expiredAt).toISOString(),
      },
      {
        onSuccess: () => {
          navigate('/admin/promotions');
        },
      }
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Link
          to="/admin/promotions"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('admin.promotions.backToList')}
        </Link>
        <h1 className="text-2xl font-bold">{t('admin.promotions.createNew')}</h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>{t('admin.promotions.promotionDetails')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('admin.promotions.code')}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="SUMMER2026"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">{t('admin.promotions.type')}</Label>
                <select
                  id="discountType"
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as 'PERCENT' | 'FLAT',
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="PERCENT">{t('admin.promotions.percent')}</option>
                  <option value="FLAT">{t('admin.promotions.flat')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">{t('admin.promotions.value')}</Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: e.target.value })
                  }
                  placeholder={formData.discountType === 'PERCENT' ? '10' : '5000'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDiscount">{t('admin.promotions.maxDiscount')}</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDiscount: e.target.value })
                  }
                  placeholder="50000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiredAt">{t('admin.promotions.expiry')}</Label>
                <Input
                  id="expiredAt"
                  type="datetime-local"
                  value={formData.expiredAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiredAt: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/promotions')}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending
                    ? t('common.loading')
                    : t('admin.promotions.create')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
