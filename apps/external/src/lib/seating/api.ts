// Seating API Service for FastAPI Backend
import { FastApiClient } from '../fastapi';
import {
  CreateSeatingArrangementDto,
  GuestCountBucket,
  HallLayout,
  SeatingArrangement,
  SeatingRequest,
  SeatingResult,
  UpdateSeatingArrangementDto,
} from './types';
import {
  UpdateSeatingArrangementDto as APIUpdateSeatingArrangementDto,
  ApiError,
  SeatingArrangementResponseDto,
  SeatingArrangementsService,
} from '@shared/api';

export class SeatingAPI {
  // Layout fetching from FastAPI
  static async getHallLayout(guestCountBucket: GuestCountBucket): Promise<HallLayout> {
    return FastApiClient.get<HallLayout>(`/seating/layout/${guestCountBucket}`);
  }

  static async optimizeSeating(request: SeatingRequest): Promise<SeatingResult> {
    return FastApiClient.post<SeatingResult>('/seating/optimize', request);
  }

  // Helper function to convert backend response to frontend format
  private static convertResponseToSeatingArrangement(
    response: SeatingArrangementResponseDto,
  ): SeatingArrangement {
    // Ensure tables is an array and each table is an array
    const rawTables = Array.isArray(response.tables) ? response.tables : [];
    const tables: string[][] = rawTables.map((table) => {
      // Ensure each table is an array and filter to strings only
      const tableArray = Array.isArray(table) ? table : [];
      return tableArray.filter((guest): guest is string => typeof guest === 'string');
    });

    return {
      id: response.id,
      weddingId: response.weddingId,
      groupPriorities: response.groupPriorities,
      tables: tables,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // NestJS Backend operations (persistence) using auto-generated services
  static async getSeatingArrangement(weddingId: number): Promise<SeatingArrangement | null> {
    try {
      const response =
        await SeatingArrangementsService.seatingArrangementControllerFindOne(weddingId);
      if (!response) {
        return null;
      }
      return this.convertResponseToSeatingArrangement(response);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async createSeatingArrangement(
    weddingId: number,
    dto: CreateSeatingArrangementDto,
  ): Promise<SeatingArrangement> {
    const response = await SeatingArrangementsService.seatingArrangementControllerCreate(
      weddingId,
      dto as Parameters<typeof SeatingArrangementsService.seatingArrangementControllerCreate>[1],
    );
    return this.convertResponseToSeatingArrangement(response);
  }

  static async updateSeatingArrangement(
    weddingId: number,
    dto: UpdateSeatingArrangementDto,
  ): Promise<SeatingArrangement> {
    const response = await SeatingArrangementsService.seatingArrangementControllerUpdate(
      weddingId,
      dto as APIUpdateSeatingArrangementDto,
    );
    return this.convertResponseToSeatingArrangement(response);
  }

  static async setTables(weddingId: number, tables: string[][]): Promise<SeatingArrangement> {
    const response = await SeatingArrangementsService.seatingArrangementControllerUpdate(
      weddingId,
      { tables },
    );
    return this.convertResponseToSeatingArrangement(response);
  }

  static async deleteSeatingArrangement(weddingId: number): Promise<void> {
    await SeatingArrangementsService.seatingArrangementControllerRemove(weddingId);
  }
}
