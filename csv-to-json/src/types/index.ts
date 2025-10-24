export interface CSVRecord {
  name: {
    firstName: string;
    lastName: string;
  };
  age: number;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
  };
  [key: string]: any;
}

export interface User {
  id?: number;
  name: string;
  age: number;
  address: object | null;
  additional_info: object | null;
}

export interface AgeDistribution {
  '<20': number;
  '20-40': number;
  '40-60': number;
  '>60': number;
}

export interface ProcessCSVResponse {
  success: boolean;
  message: string;
  recordsProcessed: number;
  ageDistribution: AgeDistribution;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export interface UserResponse {
  id?: number;
  name: {
    firstName: string;
    lastName: string;
  };
  age: number;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
  };
  [key: string]: any;
}