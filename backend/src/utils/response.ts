/**
 * API Response Utilities
 * Standardized response format for all API endpoints
 */

import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  metadata?: ApiResponse['metadata']
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: unknown
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): Response<ApiResponse<T[]>> => {
  return sendSuccess(
    res,
    data,
    message,
    200,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
};

/**
 * Send created response
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response<ApiResponse<T>> => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send no content response
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};
