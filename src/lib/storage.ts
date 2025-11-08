import { User, FoodItem, Order, Notification, EBill } from '@/types';

// Demo food data
const DEMO_FOODS: FoodItem[] = [
  {
    id: '1',
    name: 'Veg Thali',
    category: 'Meals',
    description: 'Complete meal with rice, sabzi, chapati, dal, and salad',
    price: 80,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Paneer Butter Masala',
    category: 'Meals',
    description: 'Creamy paneer curry with butter and spices',
    price: 120,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Samosa (2pcs)',
    category: 'Snacks',
    description: 'Crispy potato-filled samosas',
    price: 25,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Masala Tea',
    category: 'Drinks',
    description: 'Hot masala chai with aromatic spices',
    price: 15,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '5',
    name: 'Cold Coffee',
    category: 'Drinks',
    description: 'Iced coffee with milk and sugar',
    price: 50,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '6',
    name: 'Chole Bhature',
    category: 'Meals',
    description: 'Spicy chickpeas with fried bread',
    price: 90,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '7',
    name: 'Dosa',
    category: 'Meals',
    description: 'Crispy rice crepe with chutney and sambar',
    price: 60,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
  {
    id: '8',
    name: 'Pav Bhaji',
    category: 'Snacks',
    description: 'Spicy vegetable curry with buttered bread',
    price: 70,
    image: '/placeholder.svg',
    createdAt: Date.now(),
  },
];

class Storage {
  private getItem<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Users
  getUsers(): User[] {
    return this.getItem('cn_users', []);
  }

  saveUsers(users: User[]): void {
    this.setItem('cn_users', users);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  // Foods
  getFoods(): FoodItem[] {
    const foods = this.getItem('cn_foods', []);
    if (foods.length === 0) {
      this.saveFoods(DEMO_FOODS);
      return DEMO_FOODS;
    }
    return foods;
  }

  saveFoods(foods: FoodItem[]): void {
    this.setItem('cn_foods', foods);
  }

  addFood(food: FoodItem): void {
    const foods = this.getFoods();
    foods.push(food);
    this.saveFoods(foods);
  }

  deleteFood(id: string): void {
    const foods = this.getFoods().filter(f => f.id !== id);
    this.saveFoods(foods);
  }

  // Orders
  getOrders(): Order[] {
    return this.getItem('cn_orders', []);
  }

  saveOrders(orders: Order[]): void {
    this.setItem('cn_orders', orders);
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.push(order);
    this.saveOrders(orders);
  }

  updateOrder(orderId: string, updates: Partial<Order>): void {
    const orders = this.getOrders().map(o =>
      o.id === orderId ? { ...o, ...updates } : o
    );
    this.saveOrders(orders);
  }

  // Notifications
  getNotifications(userId: string): Notification[] {
    return this.getItem('cn_notifs', []).filter((n: Notification) => n.userId === userId);
  }

  addNotification(notif: Notification): void {
    const notifs = this.getItem('cn_notifs', []);
    notifs.push(notif);
    this.setItem('cn_notifs', notifs);
  }

  clearNotifications(userId: string): void {
    const notifs = this.getItem('cn_notifs', []).filter((n: Notification) => n.userId !== userId);
    this.setItem('cn_notifs', notifs);
  }

  // E-Bills
  getEBills(userId?: string): EBill[] {
    const bills = this.getItem('cn_ebills', []);
    return userId ? bills.filter((b: EBill) => b.userId === userId) : bills;
  }

  addEBill(bill: EBill): void {
    const bills = this.getEBills();
    bills.push(bill);
    this.setItem('cn_ebills', bills);
  }
}

export const storage = new Storage();
