import {
  createArrayOfUint, createArrayWithRandomInt, getNearItems, range, sort,
} from './utils';

import { MAX_BITS } from '../src/consts';
import { IntSet } from '../src';

const FIS = IntSet;

describe('IntSet', () => {
  it('Method: add, has - adds & check for items', () => {
    const fs = new FIS();

    expect(fs.has(2)).toBe(false);
    expect(fs.has(-1)).toBe(false);
    expect(fs.has(-4)).toBe(false);
    fs.add(1);
    fs.add(-1);
    fs.add(2);
    fs.add(-4);
    expect(fs.has(0)).toBe(false);
    expect(fs.has(1)).toBe(true);
    expect(fs.has(-1)).toBe(true);
    expect(fs.has(2)).toBe(true);
    expect(fs.has(-4)).toBe(true);
    expect(fs.has(1)).toBe(true);
    expect(fs.has(4)).toBe(false);
  });

  it('Accept items in constructor', () => {
    const items = [-241, -11, -20, -1, 0, 2, 5, 12, 13, 1514];
    const itemsNear = getNearItems(items);

    const fs = new FIS(items);

    items.forEach((item) => {
      expect(fs.has(item)).toBe(true);
    });
    itemsNear.forEach((item) => {
      expect(fs.has(item)).toBe(false);
    });
  });

  it('Method: delete - removes items', () => {
    const items = [0, -1, -7, 11, ...range(-64, 64), 42, -128, -315, -405, 1424];
    const deleteItems = [-7, 666, 666, ...range(-33, 4), -315, 42, 42, 42];
    const remainingItems = items.filter((i) => !deleteItems.includes(i));

    const fs = new FIS(items);
    deleteItems.forEach((item) => {
      fs.delete(item);
    });

    remainingItems.forEach((item) => {
      expect(fs.has(item)).toBe(true);
    });
    deleteItems.forEach((item) => {
      expect(fs.has(item)).toBe(false);
    });
  });

  it('Iterate every item', () => {
    const items = [-846, -1032, -31, ...range(-64, 64), -64, -2, -1, -0, 0, 1, 2, 15, 16, 30, 5125, 99];
    const itemsSorted = sort(items);
    const fs = new FIS(items);

    const outputItems: number[] = [];
    const cb = jest.fn((item) => {
      outputItems.push(item);
    });
    fs.forEach(cb);

    expect(outputItems).toStrictEqual(itemsSorted);
    expect(cb).toHaveBeenCalledTimes(itemsSorted.length);
  });

  it('Support many different integer values', () => {
    const items = [
      ...createArrayOfUint(MAX_BITS * 10),
      ...createArrayWithRandomInt(10, FIS.MIN_INTEGER, FIS.MAX_INTEGER),
      FIS.MAX_INTEGER,
      FIS.MIN_INTEGER,
    ];
    const fs = new FIS(items);

    items.forEach((item) => {
      expect(fs.has(item)).toBe(true);
    });

    fs.delete(FIS.MAX_INTEGER);
    expect(fs.has(FIS.MAX_INTEGER)).toBe(false);
  });

  it('Counting items', () => {
    const items = [-352, -15, -0, 0, 2, 15, 73, 143, 1452, 31_412];
    const fs = new FIS(items);

    expect(fs.size).toBe(items.length - 1); // Except negative 0

    fs.add(1);
    fs.add(1);
    expect(fs.size).toBe(10);

    fs.delete(1);
    fs.delete(-352);
    fs.delete(2);
    fs.delete(2);

    expect(fs.size).toBe(7);
  });

  it('Method: intersection => new set with items present in both sets at the same time', () => {
    const fs1 = new FIS([0, 30, 25, 31, 99, 64, 8, 1_234, 1_235, 10_555]);
    const fs2 = new FIS([0, 1, 25, 3, 99, 63, 8, 1_234, 10_555, 10_558]);

    const result = fs1.intersection(fs2).values();

    expect(result).toStrictEqual([0, 8, 25, 99, 1_234, 10_555]);
  });

  it('Method: union => new set with all the items present in both sets', () => {
    const fs1 = new FIS([0, 30, 25, 31, 99, 64, 8, 1_234, 1_235, 10_555]);
    const fs2 = new FIS([1, 25, 3, 99, 63, 8, 1_234, 10_555, 10_558]);

    const result = fs1.union(fs2).values();

    expect(result).toStrictEqual([0, 1, 3, 8, 25, 30, 31, 63, 64, 99, 1_234, 1_235, 10_555, 10_558]);
  });

  it('Method: difference => new set without items present in received set', () => {
    const fs1 = new FIS([30, 25, 31, 99, 64, 8, 1_234, 1_235, 10_555, 32_964]);
    const fs2 = new FIS([0, 1, 25, 3, 99, 63, 8, 1_234, 10_555, 10_558, 32_964]);

    const result = fs1.difference(fs2).values();

    expect(result).toStrictEqual([30, 31, 64, 1_235]);
  });

  it('Method: symmetricDifference => new set of items found only in either this or in received set.', () => {
    const fs1 = new FIS([30, 25, 31, 99, 64, 8, 1_234, 1_235, 10_555]);
    const fs2 = new FIS([0, 1, 25, 3, 99, 63, 8, 1_234, 10_555, 10_558]);

    const result = fs1.symmetricDifference(fs2).values();

    expect(result).toStrictEqual([0, 1, 3, 30, 31, 63, 64, 1_235, 10_558]);
  });
});
