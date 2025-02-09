export const isObj = (data: unknown): data is Record<string, unknown> =>
  typeof data === "object" && !Array.isArray(data) && data !== null;

export function execOnArrValue<T = unknown>(
  data: unknown[],
  fn: (val: Record<string, unknown>) => T,
): unknown[] {
  return data.map((val) =>
    isObj(val) ? fn(val) : Array.isArray(val) ? execOnArrValue(val, fn) : val,
  );
}

/**
 * convert snake_case to camesCase
 */
export function snakeToCamel<T extends Record<string, unknown>>(
  data: Record<string, unknown>,
): T {
  return Object.entries(data).reduce(
    (result, [key, val]) => {
      const camelKey = key.replace(/_([\w\d])/g, (g) => g[1].toUpperCase());
      const value = isObj(val)
        ? snakeToCamel(val)
        : Array.isArray(val)
          ? execOnArrValue<Record<string, unknown>>(val, snakeToCamel)
          : val;
      result[camelKey] = value;
      return result;
    },
    {} as Record<string, unknown>,
  ) as T;
}
