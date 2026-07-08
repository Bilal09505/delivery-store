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

  async advanceStatus(order: Order) {
    const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);
    const next = ORDER_STATUS_FLOW[currentIndex + 1];
    if (!next || !order.id) return;
    await updateDoc(doc(db, 'orders', order.id), {
      status: next,
      updatedAt: Date.now(),
    });
  }
}
