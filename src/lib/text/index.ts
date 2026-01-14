export function customTruncate(input: string | null | undefined, limit: number): string {
  if (!input || typeof input !== "string") return "";
  if (input.length <= limit) return input;
  return input.slice(0, limit).trimEnd() + "...";
}
