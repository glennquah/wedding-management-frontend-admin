/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatMessageResponseDto } from '../models/ChatMessageResponseDto';
import type { ChecklistItemResponseDto } from '../models/ChecklistItemResponseDto';
import type { ChecklistResponseDto } from '../models/ChecklistResponseDto';
import type { ChecklistStatsResponseDto } from '../models/ChecklistStatsResponseDto';
import type { CreateChecklistDto } from '../models/CreateChecklistDto';
import type { CreateChecklistItemDto } from '../models/CreateChecklistItemDto';
import type { UpdateChecklistDto } from '../models/UpdateChecklistDto';
import type { UpdateChecklistItemDto } from '../models/UpdateChecklistItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChecklistService {
    /**
     * Create a new checklist for a wedding
     * @param requestBody
     * @returns ChecklistResponseDto Checklist created successfully
     * @throws ApiError
     */
    public static checklistControllerCreateChecklist(
        requestBody: CreateChecklistDto,
    ): CancelablePromise<ChecklistResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checklist',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Wedding not found`,
                409: `Checklist already exists for this wedding`,
            },
        });
    }
    /**
     * Get all checklists (admin use)
     * @returns ChecklistResponseDto All checklists retrieved successfully
     * @throws ApiError
     */
    public static checklistControllerFindAll(): CancelablePromise<Array<ChecklistResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Get checklist by ID
     * @param id Checklist ID
     * @returns ChecklistResponseDto Checklist retrieved successfully
     * @throws ApiError
     */
    public static checklistControllerFindOne(
        id: number,
    ): CancelablePromise<ChecklistResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found`,
            },
        });
    }
    /**
     * Update checklist by ID
     * Updates checklist items, current stage, and chat history. Set appendChatHistory=true to add new messages, or false to replace entire chat history.
     * @param id Checklist ID
     * @param requestBody
     * @returns ChecklistResponseDto Checklist updated successfully
     * @throws ApiError
     */
    public static checklistControllerUpdate(
        id: number,
        requestBody: UpdateChecklistDto,
    ): CancelablePromise<ChecklistResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklist/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found`,
            },
        });
    }
    /**
     * Delete checklist
     * @param id Checklist ID
     * @returns void
     * @throws ApiError
     */
    public static checklistControllerRemove(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checklist/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found`,
            },
        });
    }
    /**
     * Get checklist by wedding ID
     * @param weddingId Wedding ID
     * @returns ChecklistResponseDto Checklist retrieved successfully
     * @throws ApiError
     */
    public static checklistControllerFindByWeddingId(
        weddingId: number,
    ): CancelablePromise<ChecklistResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found for this wedding`,
            },
        });
    }
    /**
     * Update checklist by wedding ID - for updating items, stage progression, and chat history
     * Updates checklist items, current stage, and chat history. Set appendChatHistory=true to add new messages, or false to replace entire chat history. Used for saving state on Next Category clicks and chat updates.
     * @param weddingId Wedding ID
     * @param requestBody
     * @returns ChecklistResponseDto Checklist updated successfully
     * @throws ApiError
     */
    public static checklistControllerUpdateByWeddingId(
        weddingId: number,
        requestBody: UpdateChecklistDto,
    ): CancelablePromise<ChecklistResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklist/wedding/{weddingId}',
            path: {
                'weddingId': weddingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found for this wedding`,
            },
        });
    }
    /**
     * Get chat history for checklist by wedding ID
     * @param weddingId Wedding ID
     * @returns ChatMessageResponseDto Chat history retrieved successfully
     * @throws ApiError
     */
    public static checklistControllerGetChatHistoryByWeddingId(
        weddingId: number,
    ): CancelablePromise<Array<ChatMessageResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist/wedding/{weddingId}/chat-history',
            path: {
                'weddingId': weddingId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found for this wedding`,
            },
        });
    }
    /**
     * Add a new item to checklist
     * @param id Checklist ID
     * @param requestBody
     * @returns ChecklistItemResponseDto Checklist item created successfully
     * @throws ApiError
     */
    public static checklistControllerAddItem(
        id: number,
        requestBody: CreateChecklistItemDto,
    ): CancelablePromise<ChecklistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checklist/items/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found`,
            },
        });
    }
    /**
     * Update a checklist item
     * @param itemId Checklist item ID
     * @param requestBody
     * @returns ChecklistItemResponseDto Checklist item updated successfully
     * @throws ApiError
     */
    public static checklistControllerUpdateItem(
        itemId: number,
        requestBody: UpdateChecklistItemDto,
    ): CancelablePromise<ChecklistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklist/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist item not found`,
            },
        });
    }
    /**
     * Delete a checklist item
     * @param itemId Checklist item ID
     * @returns void
     * @throws ApiError
     */
    public static checklistControllerRemoveItem(
        itemId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checklist/items/{itemId}',
            path: {
                'itemId': itemId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist item not found`,
            },
        });
    }
    /**
     * Mark a checklist item as completed
     * @param itemId Checklist item ID
     * @returns ChecklistItemResponseDto Checklist item marked as completed
     * @throws ApiError
     */
    public static checklistControllerMarkItemCompleted(
        itemId: number,
    ): CancelablePromise<ChecklistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklist/items/{itemId}/complete',
            path: {
                'itemId': itemId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist item not found`,
            },
        });
    }
    /**
     * Mark a checklist item as uncompleted
     * @param itemId Checklist item ID
     * @returns ChecklistItemResponseDto Checklist item marked as uncompleted
     * @throws ApiError
     */
    public static checklistControllerMarkItemUncompleted(
        itemId: number,
    ): CancelablePromise<ChecklistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklist/items/{itemId}/uncomplete',
            path: {
                'itemId': itemId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist item not found`,
            },
        });
    }
    /**
     * Toggle completion status of a checklist item
     * @param itemId Checklist item ID
     * @returns ChecklistItemResponseDto Checklist item completion status toggled
     * @throws ApiError
     */
    public static checklistControllerToggleItemCompletion(
        itemId: number,
    ): CancelablePromise<ChecklistItemResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklist/items/{itemId}/toggle',
            path: {
                'itemId': itemId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist item not found`,
            },
        });
    }
    /**
     * Get checklist items by category
     * @param id Checklist ID
     * @param category Category name
     * @returns ChecklistItemResponseDto Checklist items retrieved by category
     * @throws ApiError
     */
    public static checklistControllerGetItemsByCategory(
        id: number,
        category: string,
    ): CancelablePromise<Array<ChecklistItemResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist/{id}/items/category',
            path: {
                'id': id,
            },
            query: {
                'category': category,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found`,
            },
        });
    }
    /**
     * Get completion statistics for a checklist
     * @param id Checklist ID
     * @returns ChecklistStatsResponseDto Completion statistics retrieved successfully
     * @throws ApiError
     */
    public static checklistControllerGetCompletionStats(
        id: number,
    ): CancelablePromise<ChecklistStatsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist/{id}/stats',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Checklist not found`,
            },
        });
    }
}
