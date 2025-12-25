import { Category, MenuVariant } from "@prisma/client";

export interface Menu {
  id: string;
  merchantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageId: string | null;
  createdAt: Date;
  category?: Category;
  menuVariants?: MenuVariant[];
}

export interface MenuApiResponse {
  data: Menu[];
  total: number;
  page: number;
  limit: number;
}
