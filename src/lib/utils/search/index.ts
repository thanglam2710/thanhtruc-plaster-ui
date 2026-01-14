/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectToQueryParams(
  obj: Record<string, any>
): Record<string, string> {
  return (
    Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
  );
}