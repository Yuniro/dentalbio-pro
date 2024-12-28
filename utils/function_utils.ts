// /utils/function_utils.ts

export function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false; // Arrays are not the same length
  }
  return arr1.every((value, index) => value === arr2[index]);
}