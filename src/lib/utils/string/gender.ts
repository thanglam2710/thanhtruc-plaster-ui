// Import Gender từ file enums chung
import { Gender } from "@/types/enums"; 

const genders = [
  { id: Gender.Male, name: "Nam" },     // 1
  { id: Gender.Female, name: "Nữ" },    // 2
  { id: Gender.Other, name: "Khác" },   // 3
];

export function getGenderNameById(id: number): string {
  const gender = genders.find((g) => g.id === id);
  return gender ? gender.name : "Không xác định";
}