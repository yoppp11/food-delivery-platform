import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { DriverEarnings } from '@/types';

interface EarningsSummaryProps {
  earnings: DriverEarnings;
}

export function EarningsSummary({ earnings }: EarningsSummaryProps) {
  const stats = [
    {
      title: "Today's Earnings",
      value: formatCurrency(earnings.today),
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'This Week',
      value: formatCurrency(earnings.thisWeek),
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'This Month',
      value: formatCurrency(earnings.thisMonth),
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Total Deliveries',
      value: earnings.totalDeliveries.toString(),
      icon: Package,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
