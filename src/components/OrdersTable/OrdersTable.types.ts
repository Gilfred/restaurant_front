import type { CommandeResponse } from '../../types/commande';

export interface OrdersTableProps {
  commandes?: CommandeResponse[];
  loading?: boolean;
  onSeeAll?: () => void;
}
