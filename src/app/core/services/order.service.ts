import { Injectable, signal } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, ORDER_STATUS_FLOW, OrderStatus } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  orders = signal<Order[]>([]);
  private unsub: (() => void) | null = null;

  constructor() {
    this.listen();
  }

  private listen() {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    this.unsub = onSnapshot(q, (snap) => {
      this.orders.set(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order))
      );
    });
  }

  async createOrder(
    data: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) {
    const now = Date.now();
    await addDoc(collection(db, 'orders'), {
      ...data,
      status: 'new_order' as OrderStatus,
      createdAt: now,
      updatedAt: now,
    });
  }
  async setStatus(order: Order, newStatus: OrderStatus) {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
    const newIndex = ORDER_STATUS_FLOW.indexOf(newStatus);
    if (newIndex < currentIndex || !order.id) return; // block backward moves
    await updateDoc(doc(db, 'orders', order.id), {
      status: newStatus,
      updatedAt: Date.now(),
    });
  }

}
