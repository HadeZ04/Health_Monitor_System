/**
 * Patient Validation Schemas
 * Zod schemas for patient-related endpoints
 */

import { z } from 'zod';

/**
 * Create Appointment Schema
 */
export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid('Invalid doctor ID').optional(),
    doctorName: z.string().min(1, 'Doctor name is required').optional(),
    specialty: z.string().min(1, 'Specialty is required').optional(),
    date: z.string().datetime('Invalid date format'),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    type: z.string().optional(),
    reason: z.string().min(5, 'Reason must be at least 5 characters').optional(),
    notes: z.string().optional(),
  }),
});

/**
 * Update Appointment Schema
 */
export const updateAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().uuid('Invalid doctor ID').optional(),
    doctorName: z.string().min(1, 'Doctor name is required').optional(),
    specialty: z.string().optional(),
    date: z.string().datetime('Invalid date format').optional(),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
    status: z.enum(['confirmed', 'pending', 'cancelled']).optional(),
    type: z.string().optional(),
    reason: z.string().min(5, 'Reason must be at least 5 characters').optional(),
    notes: z.string().optional(),
  }),
});

/**
 * Take Medication Schema
 */
export const takeMedicationSchema = z.object({
  body: z.object({
    scheduleId: z.string().uuid('Invalid schedule ID').optional(),
    taken: z.boolean().default(true),
    notes: z.string().optional(),
    timestamp: z.string().datetime('Invalid timestamp format').optional(),
  }),
});

/**
 * Query Vitals Schema
 */
export const queryVitalsSchema = z.object({
  query: z.object({
    type: z.enum(['bloodPressure', 'heartRate', 'glucose', 'spo2', 'temperature', 'weight']).optional(),
    from: z.string().datetime('Invalid from date').optional(),
    to: z.string().datetime('Invalid to date').optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

/**
 * Query Appointments Schema
 */
export const queryAppointmentsSchema = z.object({
  query: z.object({
    status: z.enum(['confirmed', 'pending', 'cancelled']).optional(),
    from: z.string().datetime('Invalid from date').optional(),
    to: z.string().datetime('Invalid to date').optional(),
    upcoming: z.string().transform((val: string) => val === 'true').optional(),
  }),
});

/**
 * Query Lab Results Schema
 */
export const queryLabResultsSchema = z.object({
  query: z.object({
    type: z.string().optional(),
    status: z.enum(['pending', 'completed', 'reviewed']).optional(),
    from: z.string().datetime('Invalid from date').optional(),
    to: z.string().datetime('Invalid to date').optional(),
  }),
});

/**
 * Validation middleware factory
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: any, res: any, next: any) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
