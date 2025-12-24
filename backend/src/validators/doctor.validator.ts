/**
 * Doctor Validator
 * Zod schemas for doctor-related API validation
 */

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Query schema for patients list
 */
export const queryPatientsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['active', 'inactive', 'critical']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    sortBy: z.enum(['name', 'lastVisit', 'riskLevel', 'age']).optional().default('name'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
});

/**
 * Schema for consultation creation
 */
export const createConsultationSchema = z.object({
  body: z.object({
    patientId: z.string().uuid('Invalid patient ID'),
    symptoms: z.union([
      z.array(z.string()),
      z.record(z.unknown()),
      z.string(),
    ]).optional(),
    diagnosis: z.string().optional(),
    notes: z.string().optional(),
    nextAppointment: z.string().datetime().optional(),
    prescriptions: z.array(
      z.object({
        medication: z.string().min(1, 'Medication name is required'),
        dosage: z.string().min(1, 'Dosage is required'),
        frequency: z.string().min(1, 'Frequency is required'),
        duration: z.string().min(1, 'Duration is required'),
        instructions: z.string().optional(),
      })
    ).optional(),
    labOrders: z.array(
      z.object({
        testType: z.string().min(1, 'Test type is required'),
        priority: z.enum(['normal', 'urgent']).default('normal'),
        notes: z.string().optional(),
      })
    ).optional(),
  }),
});

/**
 * Schema for consultation update
 */
export const updateConsultationSchema = z.object({
  body: z.object({
    symptoms: z.union([
      z.array(z.string()),
      z.record(z.unknown()),
      z.string(),
    ]).optional(),
    diagnosis: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['scheduled', 'inProgress', 'completed', 'cancelled']).optional(),
    nextAppointment: z.string().datetime().optional(),
  }),
});

/**
 * Schema for schedule update
 */
export const updateScheduleSchema = z.object({
  body: z.object({
    schedules: z.array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        timeSlots: z.array(
          z.object({
            startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
            endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
            available: z.boolean().default(true),
          })
        ),
        fromDate: z.string().datetime(),
        toDate: z.string().datetime().optional(),
        isActive: z.boolean().default(true),
      })
    ),
  }),
});

/**
 * Query schema for schedule
 */
export const queryScheduleSchema = z.object({
  query: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),
});

/**
 * Query schema for lab orders
 */
export const queryLabOrdersSchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'approved', 'inProgress', 'completed', 'cancelled']).optional(),
    priority: z.enum(['normal', 'urgent']).optional(),
    patientId: z.string().uuid().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
  }),
});

/**
 * Query schema for messages
 */
export const queryMessagesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
    unreadOnly: z.coerce.boolean().optional(),
  }),
});

/**
 * Schema for sending message
 */
export const sendMessageSchema = z.object({
  body: z.object({
    patientId: z.string().uuid('Invalid patient ID'),
    content: z.string().min(1, 'Message content is required').max(5000),
  }),
});

/**
 * Query schema for patient vitals history
 */
export const queryPatientVitalsSchema = z.object({
  query: z.object({
    type: z.enum(['bloodPressure', 'heartRate', 'glucose', 'spo2', 'temperature', 'weight']).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    limit: z.coerce.number().int().positive().max(1000).optional().default(100),
  }),
});

/**
 * Query schema for patient history
 */
export const queryPatientHistorySchema = z.object({
  query: z.object({
    type: z.enum(['consultations', 'prescriptions', 'labOrders', 'appointments', 'all']).optional().default('all'),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
  }),
});

/**
 * Validation middleware factory
 * @param schema Zod schema to validate against
 */
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace with parsed data (this ensures type coercion)
      req.body = parsed.body || req.body;
      req.query = parsed.query || req.query;
      req.params = parsed.params || req.params;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};
