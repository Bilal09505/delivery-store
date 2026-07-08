export type OrderStatus =
  | 'new_order'
  | 'packing'
  | 'ready_for_delivery'
  | 'posted'
  | 'delivered';

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'new_order',
  'packing',
  'ready_for_delivery',
  'posted',
  'delivered',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new_order: 'New Order',
  packing: 'Packing',
  ready_for_delivery: 'Ready for Delivery',
  posted: 'Posted',
  delivered: 'Delivered',
};

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}
