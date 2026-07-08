import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { ORDER_STATUS_LABELS } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink],
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
          <div
            class="bg-white border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
          >
            <div class="min-w-0">
              <p class="font-semibold truncate">{{ order.customerName }}</p>
              <p class="text-sm text-gray-500 truncate">{{ order.address }}</p>
              <p class="text-sm text-gray-500">{{ order.customerPhone }}</p>
              <span
                class="inline-block mt-1 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
              >
                {{ statusLabels[order.status] }}
              </span>
            </div>
            @if (order.status !== 'delivered') {
              <button
                (click)="orderService.advanceStatus(order)"
                class="w-full sm:w-auto bg-green-600 text-white text-sm px-4 py-3 sm:py-2 rounded-lg hover:bg-green-700 active:scale-95 transition"
              >
                Advance →
              </button>
            }
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
  constructor(public orderService: OrderService, public auth: AuthService) {}
}
