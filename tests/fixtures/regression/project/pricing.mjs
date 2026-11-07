export function total(quantity, price) {
 if (!Number.isInteger(quantity) || quantity <= 1) throw new RangeError('Quantity must be a positive integer');
 return quantity * price;
}
