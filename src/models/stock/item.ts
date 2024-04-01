import { DateTime } from "next-auth/providers/kakao";

export interface CreateItemModel {
  id: string | null;
  name: string | null;
  amount: number | null;
  price: number | null;
  created_by: string | null;
  created_at: DateTime | null;
}

export interface ItemModel {
  id: string | null;
  name: string | null;
  amount: number | null;
  price: number | null;
  created_by: string | null;
  created_at: DateTime | null;
  updated_by: string | null;
  updated_at: DateTime | null;
}
