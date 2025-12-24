/**
 * Patient Dashboard Validation Schemas
 * Zod schemas for request validation
 */

import { z } from 'zod';

/**
 * Patient ID parameter validation
 */
export const patientIdParamSchema = z.object({
  params: z.object({
    patientId: z.string().uuid('Invalid patient ID format'),
  }),
});

/**
 * Vitals history query parameters
 */
export const vitalsQuerySchema = z.object({
  query: z.object({
    type: z
      .enum(['heartrate', 'spo2', 'blood_pressure', 'glucose', 'ecg', 'ppg'])
      .optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),
});

/**
 * Create appointment body validation
 */
export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid('Invalid doctor ID'),
    date: z.string().datetime('Invalid date format'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    reason: z.string().min(5, 'Reason must be at least 5 characters').max(500),
    type: z.enum(['new', 'follow-up', 'emergency']).default('new'),
  }),
});

/**
 * Update appointment body validation
 */
export const updateAppointmentSchema = z.object({
  body: z.object({
    date: z.string().datetime().optional(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    reason: z.string().min(5).max(500).optional(),
    status: z.enum(['confirmed', 'pending', 'cancelled', 'completed']).optional(),
  }),
});
