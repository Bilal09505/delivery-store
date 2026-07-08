import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { OrderItem } from '../../core/models/order.model';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div class="max-w-md mx-auto">
        <div class="flex items-center gap-2 mb-4">
          <a routerLink="/orders" class="text-gray-500 hover:text-gray-700">← Back</a>
        </div>
        <h1 class="text-xl font-bold mb-4">New Order</h1>

        <form (submit)="onSubmit($event)" class="space-y-4">
          <div class="space-y-3">
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
          </div>

          <div class="border-t pt-3">
            <div class="flex justify-between items-center mb-2">
              <h2 class="font-semibold text-gray-700">Items</h2>
              <button
                type="button"
                (click)="addItem()"
                class="text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                + Add item
              </button>
            </div>

            <div class="space-y-2">
              @for (item of items(); track $index) {
                <div class="bg-white border rounded-lg p-3 flex flex-col gap-2">
                  <div class="flex flex-col sm:flex-row gap-2">
                    <input
                      [ngModel]="item.category"
                      (ngModelChange)="updateItem($index, 'category', $event)"
                      [name]="'category' + $index"
                      placeholder="Category"
                      class="flex-1 border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                    <input
                      [ngModel]="item.name"
                      (ngModelChange)="updateItem($index, 'name', $event)"
                      [name]="'name' + $index"
                      placeholder="Item name"
                      class="flex-1 border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div class="flex gap-2 items-center">
                    <input
                      [ngModel]="item.quantity"
                      (ngModelChange)="updateItem($index, 'quantity', $event)"
                      [name]="'quantity' + $index"
                      type="number"
                      min="1"
                      placeholder="Qty"
                      class="w-20 border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                    <span class="text-gray-400 text-sm">×</span>
                    <input
                      [ngModel]="item.price"
                      (ngModelChange)="updateItem($index, 'price', $event)"
                      [name]="'price' + $index"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      class="w-24 border rounded-lg px-3 py-2 text-sm"
                      required
                    />
                    <span class="text-sm text-gray-500 ml-auto">
                      = {{ (item.quantity * item.price) | number: '1.2-2' }}
                    </span>
                    <button
                      type="button"
                      (click)="removeItem($index)"
                      class="text-red-500 text-sm px-2 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              }
              @empty {
                <p class="text-sm text-gray-400">No items added yet.</p>
              }
            </div>

            <div class="flex justify-end mt-3 pt-2 border-t">
              <p class="font-semibold text-gray-800">
                Total: {{ total() | number: '1.2-2' }}
              </p>
            </div>
          </div>

          @if (error()) {
            <p class="text-red-600 text-sm">{{ error() }}</p>
          }

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
  items = signal<OrderItem[]>([
    { category: '', name: '', quantity: 1, price: 0 },
  ]);
  saving = signal(false);
  error = signal('');

  total = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity * i.price, 0)
  );

  constructor(private orderService: OrderService, private router: Router) {}

  updateItem(index: number, field: keyof OrderItem, value: string | number) {
    this.items.update((list) => {
      const copy = [...list];
      const parsed =
        field === 'quantity' || field === 'price' ? Number(value) : value;
      copy[index] = { ...copy[index], [field]: parsed };
      return copy;
    });
  }

  addItem() {
    this.items.update((list) => [
      ...list,
      { category: '', name: '', quantity: 1, price: 0 },
    ]);
  }

  removeItem(index: number) {
    this.items.update((list) => list.filter((_, i) => i !== index));
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    this.error.set('');

    const validItems = this.items().filter(
      (i) => i.name.trim() && i.category.trim() && i.quantity > 0 && i.price >= 0
    );
    if (validItems.length === 0) {
      this.error.set('Add at least one item with category, name, quantity, and price.');
      return;
    }

    this.saving.set(true);
    try {
      await this.orderService.createOrder({
        customerName: this.customerName,
        customerPhone: this.customerPhone,
        address: this.address,
        items: validItems,
      });
      this.router.navigate(['/orders']);
    } finally {
      this.saving.set(false);
    }
  }
}