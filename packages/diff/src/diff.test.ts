import { diffJson } from './diff';

describe('diff', () => {
  describe('simple matching values', () => {
    it('numbers should match', () => {
      expect(diffJson(5, 5)).toEqual({ type: 'match' });
    });

    it('strings should match', () => {
      expect(diffJson('hello', 'hello')).toEqual({ type: 'match' });
    });

    it('booleans should match', () => {
      expect(diffJson(true, true)).toEqual({ type: 'match' });
    });

    it('null should match', () => {
      expect(diffJson(null, null)).toEqual({ type: 'match' });
    });
  });

  describe('simple different values should return value diff', () => {
    for (const [a, b] of [
      [5, 6],
      ['5', '6'],
      [true, false],
    ]) {
      it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
        expect(diffJson(a, b)).toEqual({ type: 'value', after: b });
      });
    }
  });

  describe('different types should return a value replacement', () => {
    for (const [a, b] of [
      [5, '5'],
      [5, true],
      [5, null],
      [[], {}],
      [null, []],
      [null, {}],
      [true, {}],
      ['5', true],
      ['5', null],
      [true, null],
    ]) {
      it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
        expect(diffJson(a, b)).toEqual({ type: 'value', after: b });
      });
    }
  });

  describe('arrays', () => {
    it('should match empty arrays', () => {
      expect(diffJson([], [])).toEqual({ type: 'match' });
    });

    it('should match arrays with matching elements', () => {
      expect(diffJson([1, 2, 3], [1, 2, 3])).toEqual({ type: 'match' });
    });

    it('should diff identify single item to replace', () => {
      expect(diffJson([1, 2, 3], [1, 2, 4])).toEqual({
        type: 'modified-a',
        changes: [{ i: 2, diff: { type: 'value', after: 4 } }],
      });
    });

    describe('should identify single missing item', () => {
      it('beginning', () => {
        expect(diffJson([2, 3, 4], [1, 2, 3, 4])).toEqual({
          type: 'splice',
          start: 0,
          count: 0,
          items: [1],
        });
      });
      it('middle', () => {
        expect(diffJson([1, 2, 4], [1, 2, 3, 4])).toEqual({
          type: 'splice',
          start: 2,
          count: 0,
          items: [3],
        });
      });
      it('end', () => {
        expect(diffJson([1, 2, 3], [1, 2, 3, 4])).toEqual({
          type: 'splice',
          start: 3,
          count: 0,
          items: [4],
        });
      });
    });

    describe('should identify single additional item', () => {
      it('beginning', () => {
        expect(diffJson([1, 2, 3, 4], [2, 3, 4])).toEqual({
          type: 'splice',
          start: 0,
          count: 1,
          items: [],
        });
      });

      it('middle', () => {
        expect(diffJson([1, 2, 3, 4], [1, 2, 4])).toEqual({
          type: 'splice',
          start: 2,
          count: 1,
          items: [],
        });
      });

      it('end', () => {
        expect(diffJson([1, 2, 3, 4], [1, 2, 3])).toEqual({
          type: 'splice',
          start: 3,
          count: 1,
          items: [],
        });
      });
    });

    it('should identify multiple items to replace', () => {
      expect(diffJson([1, 2, 3, 6, 6.5, 7], [1, 2, 4, 5, 7])).toEqual({
        type: 'splice',
        start: 2,
        count: 3,
        items: [4, 5],
      });
    });
  });

  describe('objects', () => {
    it('should match empty objects', () => {
      expect(diffJson({}, {})).toEqual({ type: 'match' });
    });

    it('undefined values are considered non-existent', () => {
      expect(diffJson({ a: undefined }, {})).toEqual({ type: 'match' });
      expect(diffJson({}, { a: undefined })).toEqual({ type: 'match' });
    });

    it('should match objects with matching keys and values', () => {
      expect(diffJson({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toEqual({
        type: 'match',
      });
    });

    describe('deletions & additions', () => {
      for (const v of [2, '2', null]) {
        describe(`value: ${JSON.stringify(v)}`, () => {
          it('deletions should be output', () => {
            expect(diffJson({ a: 1, b: v, c: 3 }, { a: 1, c: 3 })).toEqual({
              type: 'modified-o',
              deletions: { b: v },
            });
          });

          it('undefined deletions should be output', () => {
            expect(
              diffJson({ a: 1, b: v, c: 3 }, { a: 1, b: undefined, c: 3 }),
            ).toEqual({
              type: 'modified-o',
              deletions: { b: v },
            });
          });

          it('additions should be output', () => {
            expect(diffJson({ a: 1, c: 3 }, { a: 1, b: v, c: 3 })).toEqual({
              type: 'modified-o',
              additions: { b: v },
            });
          });

          it('undefined additions should be output', () => {
            expect(
              diffJson({ a: 1, b: undefined, c: 3 }, { a: 1, b: v, c: 3 }),
            ).toEqual({
              type: 'modified-o',
              additions: { b: v },
            });
          });
        });
      }
    });

    it('changes should be output', () => {
      expect(diffJson({ a: 1, b: 2, c: 3 }, { a: 1, b: 4, c: 3 })).toEqual({
        type: 'modified-o',
        changes: { b: { type: 'value', after: 4 } },
      });
    });

    it('deletions, additions, and changes should be output', () => {
      expect(diffJson({ a: 1, b: 2, c: 3 }, { a: 1, c: 4, d: null })).toEqual({
        type: 'modified-o',
        additions: { d: null },
        deletions: { b: 2 },
        changes: { c: { type: 'value', after: 4 } },
      });
    });
  });

  describe('complex objects', () => {
    it('should match complex objects', () => {
      expect(
        diffJson(
          { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] },
          { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] },
        ),
      ).toEqual({ type: 'match' });
    });

    it('should diff complex objects', () => {
      expect(
        diffJson(
          { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] },
          { a: 1, b: { c: 2, d: 4 }, e: [4, 5, 7] },
        ),
      ).toEqual({
        type: 'modified-o',
        changes: {
          b: {
            type: 'modified-o',
            changes: { d: { type: 'value', after: 4 } },
          },
          e: {
            type: 'modified-a',
            changes: [{ i: 2, diff: { type: 'value', after: 7 } }],
          },
        },
      });
    });
  });
});
