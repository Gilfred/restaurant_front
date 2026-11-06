import type { TopProductsResponse, TopProductItem } from '../../types/dashboard';

export interface TopSellingProductsProps {
  data?: TopProductsResponse | null;
  loading?: boolean;
}

export type { TopProductItem };
