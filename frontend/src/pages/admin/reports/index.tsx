import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, TrendingUp, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/admin/stats-card';
import { useAdminReports } from '@/hooks/use-admin';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

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

export function AdminReportsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const { data: reports, isLoading, refetch } = useAdminReports({
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });

  const handleFilter = () => {
    refetch();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">{t('admin.reports.title')}</h1>
        <p className="text-muted-foreground">{t('admin.reports.subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.reports.dateRange')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('admin.reports.startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">{t('admin.reports.endDate')}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleFilter}>{t('admin.reports.filter')}</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t('admin.reports.totalRevenue')}
              value={formatCurrency(reports?.totalRevenue || 0)}
              icon={DollarSign}
            />
            <StatsCard
              title={t('admin.reports.totalOrders')}
              value={reports?.totalOrders || 0}
              icon={ShoppingBag}
            />
            <StatsCard
              title={t('admin.reports.averageOrderValue')}
              value={formatCurrency(reports?.averageOrderValue || 0)}
              icon={TrendingUp}
            />
            <StatsCard
              title={t('admin.reports.topMerchants')}
              value={reports?.topMerchants?.length || 0}
              icon={Store}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.reports.topMerchants')}</CardTitle>
              </CardHeader>
              <CardContent>
                {reports?.topMerchants && reports.topMerchants.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 font-medium">#</th>
                          <th className="pb-3 font-medium">{t('admin.reports.merchantName')}</th>
                          <th className="pb-3 font-medium">{t('admin.reports.orders')}</th>
                          <th className="pb-3 font-medium">{t('admin.reports.revenue')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.topMerchants.map((merchant, index) => (
                          <tr key={merchant.id} className="border-b hover:bg-muted/50">
                            <td className="py-4 font-medium">{index + 1}</td>
                            <td className="py-4">{merchant.name}</td>
                            <td className="py-4">{merchant.orders}</td>
                            <td className="py-4 font-medium">
                              {formatCurrency(merchant.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t('admin.reports.noData')}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
