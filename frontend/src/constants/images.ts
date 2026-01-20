export const FALLBACK_IMAGES = {
  menu: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
  ],
  merchant: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  ],
  banner: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
  ],
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Fast Food': '🍔',
  Pizza: '🍕',
  Asian: '🍜',
  Desserts: '🍰',
  Beverages: '🥤',
  Healthy: '🥗',
  Indonesian: '🍛',
  Japanese: '🍣',
  Default: '🍽️',
};

export function getMenuImage(menuId: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  const index = parseInt(menuId, 16) % FALLBACK_IMAGES.menu.length;
  return FALLBACK_IMAGES.menu[isNaN(index) ? 0 : index];
}

export function getMerchantImage(merchantId: string, imageUrl?: string | null): string {
  if (imageUrl) return imageUrl;
  const index = parseInt(merchantId, 16) % FALLBACK_IMAGES.merchant.length;
  return FALLBACK_IMAGES.merchant[isNaN(index) ? 0 : index];
}

export function getBannerImage(merchantId: string): string {
  const index = parseInt(merchantId, 16) % FALLBACK_IMAGES.banner.length;
  return FALLBACK_IMAGES.banner[isNaN(index) ? 0 : index];
}

export function getCategoryIcon(categoryName: string): string {
  return CATEGORY_ICONS[categoryName] || CATEGORY_ICONS.Default;
}
