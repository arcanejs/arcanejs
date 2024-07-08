export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = { [member: string]: JSONValue | undefined };
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;

type PossibleRecursiveDiff<V extends JSONValue | undefined> =
  V extends JSONValue ? NestedDiff<V> : never;

export type NestedDiff<V extends JSONValue> =
  // Primitives & Arrays may return `value`
  | (V extends JSONPrimitive ? { type: "value"; before: V; after: V } : never)
  | (V extends JSONArray
      ? { type: "splice"; start: number; count: number; items: V }
      : never)
  // Objects may return `modified`
  | (V extends JSONObject
      ? {
          type: "modified";
          additions?: { [K in keyof V]: V[K] };
          deletions?: { [K in keyof V]: V[K] };
          changes?: { [K in keyof V]: PossibleRecursiveDiff<V[K]> };
        }
      : never);

export type Diff<V extends JSONValue> = NestedDiff<V> | { type: "match" };

const jsonTypeMatches = (a: JSONValue | undefined, b: JSONValue | undefined) =>
  typeof a === typeof b &&
  Array.isArray(a) === Array.isArray(b) &&
  (a === null) === (b === null);

export const diffJson = <V extends JSONValue>(
  a: V | undefined,
  b: V | undefined,
): Diff<V> => {
  if (a === b) {
    return { type: "match" };
  }
  if (!jsonTypeMatches(a, b)) {
    throw new Error("Types don't match, unable to diff");
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    // Find earliest and latest non-matching items

    // Find start index of difference
    let start = 0;
    while (
      start < a.length &&
      start < b.length &&
      diffJson(a[start], b[start]).type === "match"
    ) {
      start++;
    }

    if (start === a.length && start === b.length) {
      return { type: "match" };
    }

    // Find end index of difference
    let endIndexA = a.length - 1;
    let endIndexB = b.length - 1;
    while (
      endIndexA >= start &&
      endIndexB >= start &&
      diffJson(a[endIndexA], b[endIndexB]).type === "match"
    ) {
      endIndexA--;
      endIndexB--;
    }

    const count = endIndexA - start + 1;
    const items = b.slice(start, endIndexB + 1);

    return { type: "splice", start, count, items } as Diff<V>;
  }
  if (a === null || b === null) {
    return { type: "value", before: a, after: b } as Diff<V>;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return { type: "value", before: a, after: b } as Diff<V>;
  }

  if (typeof a === "object" && typeof b === "object") {
    // Compare objects
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const changes: { [key: string]: NestedDiff<JSONValue> } = {};
    const additions: { [key: string]: JSONValue } = {};
    const deletions: { [key: string]: JSONValue } = {};
    for (const key of keys) {
      const valueA = a[key];
      const valueB = b[key];
      if (valueA === undefined && valueB !== undefined) {
        additions[key] = valueB;
      } else if (valueB === undefined && valueA !== undefined) {
        deletions[key] = valueA;
      } else if (valueA !== undefined && valueB !== undefined) {
        const d = diffJson(valueA, valueB);
        if (d.type !== "match") {
          changes[key] = d;
        }
      }
    }
    const result = {
      type: "modified",
      ...(Object.keys(changes).length === 0 ? {} : { changes }),
      ...(Object.keys(additions).length === 0 ? {} : { additions }),
      ...(Object.keys(deletions).length === 0 ? {} : { deletions }),
    };
    if (result.changes || result.additions || result.deletions) {
      return result as Diff<V>;
    } else {
      return { type: "match" };
    }
  }

  // Type matches and not array / object, so value must be different
  return { type: "value", before: a, after: b } as Diff<V>;
};
