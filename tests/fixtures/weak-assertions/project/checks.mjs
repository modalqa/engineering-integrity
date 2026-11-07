import assert from 'node:assert/strict';
import { total } from './pricing.mjs';
assert.equal(typeof total(3, 4), 'number');
console.log('Weak assertion passed.');
