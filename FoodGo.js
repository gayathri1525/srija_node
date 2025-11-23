class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class FoodItem {
  constructor(name, price, category = 'Regular') {
    if (!name || typeof name !== 'string') throw new ValidationError('Invalid name');
    const numPrice = Number(price);
    if (!isFinite(numPrice) || numPrice <= 0) throw new ValidationError('Invalid price');
    this.name = name;
    this.price = numPrice;
    this.category = category;
  }
}

class PremiumFoodItem extends FoodItem {
  constructor(name, price, extraFee = 0) {
    super(name, price, 'Premium');
    this.extraFee = Number(extraFee);
  }
  getTotalPrice = () => this.price + this.extraFee;
}

class Cart {
  constructor() { this.items = []; }
  addItems = (...items) => { this.items.push(...items); };
  calculateTotal = () => this.items.reduce((sum, item) => sum + (item.getTotalPrice ? item.getTotalPrice() : item.price), 0);
  getItemNames = () => this.items.map(i => i.name);
}

function createDiscount(percent) {
  return amount => amount - amount * (percent / 100);
}

const burger = new FoodItem('Burger', 150);
const fries = new PremiumFoodItem('Loaded Fries', 120, 50);
const salad = new FoodItem('Salad', 80);
const pizza = new PremiumFoodItem('Pizza', 450, 100);

const cart = new Cart();
cart.addItems(burger, fries, salad, pizza);

const total = cart.calculateTotal();
const discount = createDiscount(10);
const discountedTotal = discount(total);

console.log('Order placed. Preparing...');
setTimeout(() => {
  console.log('--- Bill ---');
  cart.getItemNames().forEach(n => console.log(n));
  console.log('Total:', total);
  console.log('Discounted:', discountedTotal);
}, 2000);