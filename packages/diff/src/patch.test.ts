import { diffJson, JSONValue } from "./diff";
import { patchJson } from "./patch";

describe("patchJson", () => {

  describe("matching values should return exact same instance", () => {
      
      for (const a of [5, "hello", true, { foo: 'bar'}, [1, 4]]) {
        it(`${JSON.stringify(a)}`, () => {
          expect(patchJson(a, diffJson(a, a))).toBe(a);
        });
      }
  
  });

  describe("simple values should be replaces", () => {
    for (const [a, b] of [
      [5, 6],
      ["hello", "goodbye"],
      [true, false],
    ]) {
      it(`${JSON.stringify(a)} -> ${JSON.stringify(b)}`, () => {
        expect(patchJson(a, diffJson(a, b))).toEqual(b);
      });
    }
  });

  describe("arrays should be replaced", () => {
    // TODO, more intelligent patching
    it("should replace arrays", () => {
      const a = [[1], [2], [3]];
      const b = [[1], [2], [4]];
      const result = patchJson(a, diffJson(a, b));
      expect(result).toEqual(b);

      // Each value will have been replaced, even if equal
      expect(result?.[0]).not.toBe(a[0]);
      expect(result?.[1]).not.toBe(a[1]);
      expect(result?.[2]).not.toBe(a[2]);

      // TODO: update algorithm to more intelligently replace array values
    });
  });

  describe("object changes should be reflected", () => {
    it("additions", () => {
      const a = { foo: ["bar"] };
      const b = { foo: ["bar"], baz: "qux" };
      const result = patchJson(a, diffJson(a, b));
      expect(result).toEqual(b);
      // Unchanged values must be exact same instance
      expect(result?.foo).toBe(a.foo);
    });

    it("deletions", () => {
      const a = { foo: ["bar"], baz: "qux" };
      const b = { foo: ["bar"] };
      const result = patchJson(a, diffJson(a, b));
      expect(result).toEqual(b);
      // Unchanged values must be exact same instance
      expect(result?.foo).toBe(a.foo);
    });

    it("changes", () => {
      const a = { foo: ["bar"], baz: "qux" };
      const b = { foo: ["bar"], baz: "quux" };
      const result = patchJson(a, diffJson(a, b));
      expect(result).toEqual(b);
      // Unchanged values must be exact same instance
      expect(result?.foo).toBe(a.foo);
    });

  });

  it("advanced change", () => {

    const a: JSONValue = {
      foo: {
        bar: {
          baz: "qux",
        },
      },
      baz: "qux",
      removed: 2
    };

    const b: JSONValue = {
      foo: {
        bar: {
          baz: "qux",
        },
      },
      baz: "quux",
      added: 3
    };

    const result = patchJson(a, diffJson(a, b));
    expect(result).toEqual(b);
    // Unchanged values must be exact same instance
    expect(result?.foo).toBe(a.foo);
  });

});