import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div class="max-w-md mx-auto">
        <div class="flex items-center gap-2 mb-4">
          <a routerLink="/orders" class="text-gray-500 hover:text-gray-700">← Back</a>
        </div>
        <h1 class="text-xl font-bold mb-4">New Order</h1>
        <form (submit)="onSubmit($event)" class="space-y-3">
          <input
            [(ngModel)]="customerName"
            name="customerName"
            placeholder="Customer name"
            class="w-full border rounded-lg px-3 py-3 text-base"
            required
          />
          <input
            [(ngModel)]="customerPhone"
            name="customerPhone"
            placeholder="Phone"
            type="tel"
            class="w-full border rounded-lg px-3 py-3 text-base"
            required
          />
          <input
            [(ngModel)]="address"
            name="address"
            placeholder="Delivery address"
            class="w-full border rounded-lg px-3 py-3 text-base"
            required
          />
          <button
            type="submit"
            [disabled]="saving()"
            class="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
          >
            {{ saving() ? 'Saving…' : 'Create Order' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class OrderCreateComponent {
  customerName = '';
  customerPhone = '';
  address = '';
  saving = signal(false);

  constructor(private orderService: OrderService, private router: Router) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    this.saving.set(true);
    try {
      await this.orderService.createOrder({
        customerName: this.customerName,
        customerPhone: this.customerPhone,
        address: this.address,
        items: [],
      });
      this.router.navigate(['/orders']);
    } finally {
      this.saving.set(false);
    }
  }
}
