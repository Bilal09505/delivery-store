import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_FLOW,
  Order,
  OrderStatus,
} from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div
        class="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center z-10"
      >
        <h1 class="text-lg sm:text-2xl font-bold">Orders</h1>
        <div class="flex items-center gap-2">
          <a
            routerLink="/orders/new"
            class="bg-blue-600 text-white text-sm sm:text-base px-3 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
          >
            + New
          </a>
          <button
            (click)="auth.logout()"
            class="text-gray-500 text-sm px-2 py-2 hover:text-gray-700"
          >
            Log out
          </button>
        </div>
      </div>

      <div class="p-3 sm:p-6 max-w-4xl mx-auto space-y-3">
        @for (order of orderService.orders(); track order.id) {
          <div class="bg-white border rounded-lg p-4 flex flex-col gap-3">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div class="min-w-0">
                <p class="font-semibold truncate">{{ order.customerName }}</p>
                <p class="text-sm text-gray-500 truncate">{{ order.address }}</p>
                <p class="text-sm text-gray-500">{{ order.customerPhone }}</p>
              </div>

              <select
  class="border rounded-lg px-3 py-2 text-sm bg-white"
  (change)="onStatusChange(order, $event)"
>
  @for (status of statusFlow; track status) {
    <option
      [value]="status"
      [selected]="status === order.status"
      [disabled]="isDisabled(status, order.status)"
    >
      {{ statusLabels[status] }}
    </option>
  }
</select>
            </div>

            <div class="border-t pt-2">
              <div class="space-y-1">
                @for (item of order.items; track $index) {
                  <div class="flex justify-between text-sm text-gray-700">
                    <span class="truncate">
                      {{ item.quantity }}× {{ item.name }}
                      <span class="text-gray-400">({{ item.category }})</span>
                    </span>
                    <span>{{ item.quantity * item.price | number: '1.2-2' }}</span>
                  </div>
                }
                @empty {
                  <p class="text-sm text-gray-400">No items.</p>
                }
              </div>
              <div class="flex justify-between mt-2 pt-2 border-t font-semibold text-gray-800">
                <span>Total</span>
                <span>{{ orderTotal(order) | number: '1.2-2' }}</span>
              </div>
            </div>
          </div>
        }
        @empty {
          <p class="text-gray-500 text-center py-10">No orders yet.</p>
        }
      </div>
    </div>
  `,
})
export class OrderListComponent {
  statusLabels = ORDER_STATUS_LABELS;
  statusFlow = ORDER_STATUS_FLOW;

  constructor(public orderService: OrderService, public auth: AuthService) { }

  isDisabled(status: OrderStatus, currentStatus: OrderStatus): boolean {
    return this.statusFlow.indexOf(status) <= this.statusFlow.indexOf(currentStatus);
  }

  orderTotal(order: Order): number {
    return order.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  }

  onStatusChange(order: Order, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as OrderStatus;
    this.orderService.setStatus(order, newStatus);
  }
}