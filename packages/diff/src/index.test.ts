import { diffJson } from "./";

describe("diff", () => {
  describe("simple matching values", () => {
    it("numbers should match", () => {
      expect(diffJson(5, 5)).toEqual({ type: "match" });
    });

    it("strings should match", () => {
      expect(diffJson("hello", "hello")).toEqual({ type: "match" });
    });

    it("booleans should match", () => {
      expect(diffJson(true, true)).toEqual({ type: "match" });
    });

    it("null should match", () => {
      expect(diffJson(null, null)).toEqual({ type: "match" });
    });
  });

  describe("simple different values should return value diff", () => {
    for (const [a, b] of [
      [5, 6],
      ["5", "6"],
      [true, false],
    ]) {
      it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
        expect(diffJson(a, b)).toEqual({ type: "value", before: a, after: b });
      });
    }
  });

  describe("different types should throw Exception", () => {
    for (const [a, b] of [
      [5, "5"],
      [5, true],
      [5, null],
      [[], {}],
      [null, []],
      [null, {}],
      [true, {}],
      ["5", true],
      ["5", null],
      [true, null],
    ]) {
      it(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
        expect(() => diffJson(a, b)).toThrow();
      });
    }
  });

  describe("arrays", () => {
    it("should match empty arrays", () => {
      expect(diffJson([], [])).toEqual({ type: "match" });
    });

    it("should match arrays with matching elements", () => {
      expect(diffJson([1, 2, 3], [1, 2, 3])).toEqual({ type: "match" });
    });

    it("should diff arrays with different elements", () => {
      expect(diffJson([1, 2, 3], [1, 2, 4])).toEqual({
        type: "value",
        before: [1, 2, 3],
        after: [1, 2, 4],
      });
    });

    it("should diff arrays with different lengths", () => {
      expect(diffJson([1, 2, 3], [1, 2, 3, 4])).toEqual({
        type: "value",
        before: [1, 2, 3],
        after: [1, 2, 3, 4],
      });
    });
  });

  describe("objects", () => {
    it("should match empty objects", () => {
      expect(diffJson({}, {})).toEqual({ type: "match" });
    });

    it("undefined values are considered non-existent", () => {
      expect(diffJson({ a: undefined }, {})).toEqual({ type: "match" });
      expect(diffJson({}, { a: undefined })).toEqual({ type: "match" });
    });

    it("should match objects with matching keys and values", () => {
      expect(diffJson({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toEqual({
        type: "match",
      });
    });

    describe("deletions & additions", () => {
      for (const v of [2, "2", null]) {
        describe(`value: ${JSON.stringify(v)}`, () => {
          it("deletions should be output", () => {
            expect(diffJson({ a: 1, b: v, c: 3 }, { a: 1, c: 3 })).toEqual({
              type: "modified",
              deletions: { b: v },
            });
          });

          it("undefined deletions should be output", () => {
            expect(
              diffJson({ a: 1, b: v, c: 3 }, { a: 1, b: undefined, c: 3 }),
            ).toEqual({
              type: "modified",
              deletions: { b: v },
            });
          });

          it("additions should be output", () => {
            expect(diffJson({ a: 1, c: 3 }, { a: 1, b: v, c: 3 })).toEqual({
              type: "modified",
              additions: { b: v },
            });
          });

          it("undefined additions should be output", () => {
            expect(
              diffJson({ a: 1, b: undefined, c: 3 }, { a: 1, b: v, c: 3 }),
            ).toEqual({
              type: "modified",
              additions: { b: v },
            });
          });
        });
      }
    });

    it("changes should be output", () => {
      expect(diffJson({ a: 1, b: 2, c: 3 }, { a: 1, b: 4, c: 3 })).toEqual({
        type: "modified",
        changes: { b: { type: "value", before: 2, after: 4 } },
      });
    });

    it("deletions, additions, and changes should be output", () => {
      expect(diffJson({ a: 1, b: 2, c: 3 }, { a: 1, c: 4, d: null })).toEqual({
        type: "modified",
        additions: { d: null },
        deletions: { b: 2 },
        changes: { c: { type: "value", before: 3, after: 4 } },
      });
    });
  });

  describe("complex objects", () => {
    it("should match complex objects", () => {
      expect(
        diffJson(
          { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] },
          { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] },
        ),
      ).toEqual({ type: "match" });
    });

    it("should diff complex objects", () => {
      expect(
        diffJson(
          { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] },
          { a: 1, b: { c: 2, d: 4 }, e: [4, 5, 7] },
        ),
      ).toEqual({
        type: "modified",
        changes: {
          b: {
            type: "modified",
            changes: { d: { type: "value", before: 3, after: 4 } },
          },
          e: {
            type: "value",
            before: [4, 5, 6],
            after: [4, 5, 7],
          },
        },
      });
    });
  });
});
