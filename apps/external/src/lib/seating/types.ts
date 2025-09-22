// Seating API Types for FastAPI Backend
// These are manually maintained since they come from a separate FastAPI service

export enum GuestCountBucket {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
}

export interface Table {
  id: number;
  capacity: number;
  x: number;
  y: number;
}

export interface HallLayout {
  guest_count_bucket: GuestCountBucket;
  tables: Table[];
}

export interface GuestRequest {
  name: string;
  group: string;
  plus_ones?: string[];
}

export interface SeatingRequest {
  guests: GuestRequest[];
  guest_count_bucket: GuestCountBucket;
  group_priorities: Record<string, number>;
}

export interface SeatingResult {
  success: boolean;
  message: string;
  seating_arrangement?: Record<number, string[]>;
  violated_constraints?: string[];
}

// Database types from NestJS backend - Simplified
export interface SeatingArrangement {
  id: number;
  weddingId: number;
  groupPriorities?: Record<string, number>;
  tables: string[][]; // Array of arrays: [[guest1, guest2], [guest3, guest4], ...] where index = table number - 1
  customLayout?: HallLayout; // Custom hall layout for this wedding
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeatingArrangementDto {
  groupPriorities?: Record<string, number>;
  tables?: string[][];
  customLayout?: HallLayout;
}

export interface UpdateSeatingArrangementDto {
  groupPriorities?: Record<string, number>;
  tables?: string[][];
  customLayout?: HallLayout;
}