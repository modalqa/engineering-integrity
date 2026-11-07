import { storage } from './infrastructure/storage.mjs';
export function total(quantity, price) {
 if (!Number.isInteger(quantity) || quantity <= 0) throw new RangeError('Quantity must be a positive integer');
 return quantity * price + storage.zero;
}
