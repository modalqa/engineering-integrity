import assert from 'node:assert/strict';
import { total } from './pricing.mjs';
assert.equal(total(1, 4), 4);
assert.equal(total(3, 4), 12);
assert.throws(() => total(0, 4), RangeError);
assert.throws(() => total(-1, 4), RangeError);
console.log('Required quantity and pricing checks passed.');
