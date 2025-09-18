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
import { ApiError, SeatingArrangementResponseDto, SeatingArrangementsService } from '@shared/api';

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
    return {
      id: response.id,
      weddingId: response.weddingId,
      groupPriorities: response.groupPriorities,
      // The tables are already in the correct format (string[][])
      tables: response.tables as unknown as string[][],
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  // Helper function to convert frontend format to backend format
  private static convertSeatingArrangementToRequest(
    data: CreateSeatingArrangementDto | UpdateSeatingArrangementDto,
  ): any {
    return {
      groupPriorities: data.groupPriorities,
      tables: data.tables,
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
    const requestData = this.convertSeatingArrangementToRequest(dto);
    const response = await SeatingArrangementsService.seatingArrangementControllerCreate(
      weddingId,
      requestData,
    );
    return this.convertResponseToSeatingArrangement(response);
  }

  static async updateSeatingArrangement(
    weddingId: number,
    dto: UpdateSeatingArrangementDto,
  ): Promise<SeatingArrangement> {
    const requestData = this.convertSeatingArrangementToRequest(dto);
    const response = await SeatingArrangementsService.seatingArrangementControllerUpdate(
      weddingId,
      requestData,
    );
    return this.convertResponseToSeatingArrangement(response);
  }

  static async setTables(weddingId: number, tables: string[][]): Promise<SeatingArrangement> {
    const response = await SeatingArrangementsService.seatingArrangementControllerUpdate(
      weddingId,
      this.convertSeatingArrangementToRequest({ tables }),
    );
    return this.convertResponseToSeatingArrangement(response);
  }


  static async deleteSeatingArrangement(weddingId: number): Promise<void> {
    await SeatingArrangementsService.seatingArrangementControllerRemove(weddingId);
  }
}
