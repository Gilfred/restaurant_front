import type {
  OrdersDistributionResponse,
  DistributionType
} from '../../types/dashboard';

export interface DistributionData {
  name: string;
  value: number; // percentage or count
  count?: number;
  revenue?: number;
  color?: string;
}

export interface OrderDistributionProps {
  data?: OrdersDistributionResponse | null;
  distributionType?: DistributionType;
  onTypeChange?: (type: DistributionType) => void;
  loading?: boolean;
}
