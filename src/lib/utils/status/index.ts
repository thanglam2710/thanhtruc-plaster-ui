// Mapping theo Enum StatusEnums của Backend .NET
export function mapStatusToId(status: string | null): number | null {
  if (!status) return null;

  switch (status) {
    case "Đang hoạt động":
      return 1; // Active
    case "Ngừng hoạt động": // Inactive
      return 0;
    case "Bị khóa": // Suspended
      return -1;
    default:
      return null;
  }
}