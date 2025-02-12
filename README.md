# Fast-int-set
> A fast Set implementation for integer numbers, written in JavaScript  
This library has several data structures, focused on working  
with sets of integer values using get/set, and/or/not/xor operations

## ✨ Features
- Better performance, than native Set
- Supports [modern Set methods](https://github.com/tc39/proposal-set-methods)
- Zero dependencies
- Node and browser
- Serialization
- ES Module and UMD support

## 💿 Installation
```
pnpm i fast-int-set
```

## ❓ When to use
- If you need too often read/write (`.add`, `.has`, `.delete`) individual items  
- Not too often use `forEach`, `size`, `values` methods
- You use values smaller, than `60_000` or use a lot of them (more than `10_000`)

## 📝 Recommendations
- If you stored large numbers, don't use iteration-based methods (`forEach`, `size`, `values`)
- Don't use values larger `137_438_953_472` (it's `65535` times less than `Number.MAX_SAFE_INTEGER`)

## 👀 Example
```js
import { UintSet } from 'fast-int-set';
// const { UintSet } = require('fast-int-set'); // For old modules

const uintSet1 = new UintSet([0, 1, 3, 4]);
const uintSet2 = new UintSet([1, 2, 4, 5]);

uintSet1.add(10);
uintSet1.has(10);
uintSet1.delete(10);

uintSet1.union(uintSet2); // => new UintSet([0, 1, 2, 3, 4, 5])
uintSet1.intersection(uintSet2); // => new UintSet([1, 4])
```

## 📈 Benchmarks
![small_range.png](./benchmarks/results/image.png)

> As you can see, if you use large values, but with a lot of them, `fast-int-set` is still faster, than native Set

## ⚙️ How it works
This library uses [bitwise operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND_assignment) to store and process integer values
```js
let bitmask1 = 0b01000000_00000000_00000100_00001011; // [0, 1, 3, 10, 30]
let bitmask2 = 0b00000000_00000000_10000000_11000001; // [0, 6, 7, 15]

// Check for an item
  !!(bitmask1 & (1 << 10)); // has 10 item => true
  !!(bitmask1 & (1 << 9)); // has 9 item => false
  // As you can see, we don't need iterate every 32 item, to find one

// Adding item
  bitmask1 |= 1 << 9; // add 9 item
  !!(bitmask1 & (1 << 9)); // has 9 item => true

// Operating with items sets
  bitmask1 | bitmask2; // Unite all items
  bitmask1 & bitmask2; // Get intersection of sets
  // Here we put up to 1024 (it's 32*32) iterations into one bitwise operation
```

<!--
## 📘  Documentation
-->
