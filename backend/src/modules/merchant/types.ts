import { Decimal } from "@prisma/client/runtime/client";

export interface Merchant {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  latitude: Decimal | null;
  longitude: Decimal | null;
  isOpen: boolean;
  rating: Decimal | null;
  createdAt: Date;
}
