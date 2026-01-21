import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMerchantContext } from '@/providers/merchant-provider';

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

export function MerchantSelectPage() {
  const navigate = useNavigate();
  const { merchants, isLoading, selectMerchant } = useMerchantContext();

  useEffect(() => {
    if (!isLoading && merchants.length === 1) {
      selectMerchant(merchants[0].id);
      navigate('/merchant', { replace: true });
    }
  }, [merchants, isLoading, selectMerchant, navigate]);

  const handleSelectMerchant = (merchantId: string) => {
    selectMerchant(merchantId);
    navigate('/merchant', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (merchants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Store className="h-16 w-16 mx-auto text-slate-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No Merchants Found</h1>
          <p className="text-slate-400 mb-6">
            You don&apos;t have any registered merchants yet.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto py-12"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-white">Merchant Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Select Your Merchant</h1>
          <p className="text-slate-400">
            Choose which merchant you want to manage
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {merchants.map((merchant) => (
            <motion.div key={merchant.id} variants={itemVariants}>
              <Card
                className="border-2 border-slate-700 bg-slate-800/50 backdrop-blur hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => handleSelectMerchant(merchant.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                      {merchant.imageUrl ? (
                        <img
                          src={merchant.imageUrl}
                          alt={merchant.name}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        <Store className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {merchant.name}
                        </h3>
                        <Badge
                          variant={merchant.isOpen ? 'default' : 'secondary'}
                          className={
                            merchant.isOpen
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-slate-600 text-slate-400'
                          }
                        >
                          {merchant.isOpen ? 'Open' : 'Closed'}
                        </Badge>
                      </div>

                      {merchant.description && (
                        <p className="text-sm text-slate-400 line-clamp-1 mb-2">
                          {merchant.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        {merchant.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{Number(merchant.rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default MerchantSelectPage;
