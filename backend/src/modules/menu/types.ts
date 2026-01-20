import { MenuVariant, MerchantMenuCategory } from "@prisma/client";
import { MerchantResponse } from "../merchant/types";

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
  category?: MerchantMenuCategory;
  menuVariants?: MenuVariant[];
  merchant?: MerchantResponse;
}

export interface MenuApiResponse {
  data: Menu[];
  total: number;
  page: number;
  limit: number;
}

export interface DeleteMenuResponse {
  data: Menu;
  message: string;
}
