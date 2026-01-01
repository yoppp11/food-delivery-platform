import { Category, MenuVariant } from "@prisma/client";
import { Merchant } from "../merchant/types";

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
  merchant?: Merchant;
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
