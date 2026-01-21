import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { merchantService } from '@/services/merchant.service';
import { queryKeys } from '@/lib/query-keys';
import type { Merchant } from '@/types';

interface MerchantContextValue {
  currentMerchant: Merchant | null;
  merchants: Merchant[];
  isLoading: boolean;
  error: Error | null;
  selectMerchant: (merchantId: string) => void;
  refreshMerchants: () => void;
}

const MerchantContext = createContext<MerchantContextValue | undefined>(undefined);

const STORAGE_KEY = 'selected-merchant-id';

interface MerchantProviderProps {
  children: ReactNode;
}

export function MerchantProvider({ children }: MerchantProviderProps) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  const {
    data: merchants = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.merchantDashboard.myMerchants(),
    queryFn: () => merchantService.getMyMerchants(),
  });

  const currentMerchant = merchants.find((m) => m.id === selectedId) ?? merchants[0] ?? null;

  useEffect(() => {
    if (!selectedId && merchants.length > 0) {
      setSelectedId(merchants[0].id);
      localStorage.setItem(STORAGE_KEY, merchants[0].id);
    }
  }, [merchants, selectedId]);

  useEffect(() => {
    if (currentMerchant) {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantOrders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantMenus.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.merchantCategories.all });
    }
  }, [currentMerchant?.id, queryClient]);

  const selectMerchant = (merchantId: string) => {
    setSelectedId(merchantId);
    localStorage.setItem(STORAGE_KEY, merchantId);
  };

  const refreshMerchants = () => {
    refetch();
  };

  const value: MerchantContextValue = {
    currentMerchant,
    merchants,
    isLoading,
    error: error as Error | null,
    selectMerchant,
    refreshMerchants,
  };

  return (
    <MerchantContext.Provider value={value}>
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchantContext() {
  const context = useContext(MerchantContext);

  if (context === undefined) {
    throw new Error('useMerchantContext must be used within MerchantProvider');
  }

  return context;
}

export default MerchantProvider;
