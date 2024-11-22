export interface CustomError extends Error {
  status?: number; // Define como opcional
}