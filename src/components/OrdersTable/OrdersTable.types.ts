export type Status = 'En attente' | 'En préparation' | 'Servie' | 'Terminée' | 'Annulée';

export interface Order {
  id: string;
  client: string;
  amount: string;
  status: Status;
  date: string;
}
