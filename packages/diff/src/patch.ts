import { Diff, JSONValue } from "./diff";

export const patchJson = <V extends JSONValue>(
  old: V | undefined,
  diff: Diff<V>,
): V | undefined => {
  if (diff.type === "match") {
    return old;
  }

  if (diff.type === "value") {
    return diff.after as V;
  }

  if (Array.isArray(old)) {
    throw new Error("Advanced array diffs not supported");
  }

  if (diff.type === "modified") {
    if (typeof old !== "object" || old === null) {
      throw new Error("Cannot apply modified diff to non-object value");
    }
    const result = { ...old, ...diff.additions } as V &
      Record<string, JSONValue>;
    for (const key of Object.keys(diff.changes || {})) {
      const changes = diff.changes?.[key];
      if (changes) {
        result[key] = patchJson(old[key], changes) as JSONValue;
      }
    }
    for (const keu of Object.keys(diff.deletions || {})) {
      delete result[keu];
    }
    return result;
  }

  // istanbul ignore next
  const _n: never = diff;
  // istanbul ignore next
  throw new Error(`Unknown diff type: ${_n}`);
};
