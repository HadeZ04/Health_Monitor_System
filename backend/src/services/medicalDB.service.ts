import type { DBCollectionType, DBQueryResult, DBQuerySpec, TimeFrameType } from '../types/chatbot.types.js';
import { prisma } from '../config/database.js';

const MAX_LIMIT = 50;

const clampLimit = (limit?: number): number => {
  if (!limit || !Number.isFinite(limit)) return 10;
  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit)));
};

const startOfDayUtc = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));

const endOfDayUtc = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

const getDateRange = (
  timeFrame: TimeFrameType,
  specificDate?: string
): { gte?: Date; lte?: Date } | undefined => {
  const now = new Date();

  switch (timeFrame) {
    case 'latest':
    case 'last_week': {
      const gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { gte };
    }
    case 'last_month': {
      const gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { gte };
    }
    case 'last_year': {
      const gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      return { gte };
    }
    case 'specific_date': {
      if (!specificDate) return undefined;
      const parsed = new Date(specificDate);
      if (Number.isNaN(parsed.getTime())) return undefined;
      return { gte: startOfDayUtc(parsed), lte: endOfDayUtc(parsed) };
    }
    case 'all':
    default:
      return undefined;
  }
};

const timeRangeLabel = (timeFrame: TimeFrameType): string => {
  const labels: Record<TimeFrameType, string> = {
    latest: '7 days (latest)',
    last_week: 'last week',
    last_month: 'last month',
    last_year: 'last year',
    specific_date: 'specific date',
    all: 'all time',
  };
  return labels[timeFrame] ?? 'unknown';
};

const keywordOrFilters = (fields: string[], keywords: string[]) => {
  const cleaned = keywords
    .map((k) => k.trim())
    .filter((k) => k.length > 0 && k.toLowerCase() !== 'general')
    .slice(0, 10);

  if (cleaned.length === 0) return undefined;

  return cleaned.flatMap((keyword) =>
    fields.map((field) => ({ [field]: { contains: keyword, mode: 'insensitive' as const } }))
  );
};

export class MedicalDBService {
  async query(spec: DBQuerySpec, userId: string): Promise<DBQueryResult> {
    const limit = clampLimit(spec.limit);

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!patientProfile) {
      return this.emptyResult(spec.target_collection, spec.time_frame);
    }

    switch (spec.target_collection) {
      case 'lab_results':
        return this.queryLabResults(patientProfile.id, spec, limit);
      case 'prescriptions':
        return this.queryPrescriptions(patientProfile.id, spec, limit);
      case 'visit_history':
        return this.queryVisitHistory(patientProfile.id, spec, limit);
      case 'allergies':
        return this.queryAllergies(patientProfile.id);
      case 'vital_signs':
        return this.queryVitalSigns(patientProfile.id, spec, limit);
      case 'medical_files':
        return this.queryMedicalFiles(patientProfile.id, spec, limit);
      case 'all':
        return this.queryAll(patientProfile.id, spec, limit);
      default:
        return this.emptyResult(spec.target_collection, spec.time_frame);
    }
  }

  private emptyResult(collection: DBCollectionType | string, timeFrame: TimeFrameType): DBQueryResult {
    return {
      success: true,
      data: [],
      metadata: {
        collection,
        count: 0,
        time_range: timeRangeLabel(timeFrame),
      },
      raw_data: [],
    };
  }

  private async queryLabResults(
    patientId: string,
    spec: DBQuerySpec,
    limit: number
  ): Promise<DBQueryResult> {
    const dateRange = getDateRange(spec.time_frame, spec.specific_date);
    const keywordOr = keywordOrFilters(
      ['type', 'testName', 'resultSummary', 'notes'],
      spec.keywords
    );

    const and: Array<Record<string, unknown>> = [];
    if (dateRange) {
      and.push({ OR: [{ performedAt: { ...dateRange } }, { createdAt: { ...dateRange } }] });
    }
    if (keywordOr) {
      and.push({ OR: keywordOr });
    }

    const results = await prisma.labResult.findMany({
      where: {
        patientId,
        ...(and.length > 0 ? { AND: and } : {}),
      },
      orderBy: [{ performedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    return {
      success: true,
      data: results,
      metadata: {
        collection: 'lab_results',
        count: results.length,
        time_range: timeRangeLabel(spec.time_frame),
      },
      raw_data: results,
    };
  }

  private async queryPrescriptions(
    patientId: string,
    spec: DBQuerySpec,
    limit: number
  ): Promise<DBQueryResult> {
    const dateRange = getDateRange(spec.time_frame, spec.specific_date);
    const or = keywordOrFilters(['medication', 'dosage', 'frequency', 'duration', 'instructions'], spec.keywords);

    const prescriptions = await prisma.prescription.findMany({
      where: {
        consultation: {
          patientId,
          ...(dateRange ? { createdAt: { ...dateRange } } : {}),
        },
        ...(or ? { OR: or } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        consultation: {
          select: {
            id: true,
            createdAt: true,
            diagnosis: true,
            status: true,
          },
        },
      },
    });

    return {
      success: true,
      data: prescriptions,
      metadata: {
        collection: 'prescriptions',
        count: prescriptions.length,
        time_range: timeRangeLabel(spec.time_frame),
      },
      raw_data: prescriptions,
    };
  }

  private async queryVisitHistory(
    patientId: string,
    spec: DBQuerySpec,
    limit: number
  ): Promise<DBQueryResult> {
    const dateRange = getDateRange(spec.time_frame, spec.specific_date);
    const or = keywordOrFilters(['diagnosis', 'notes'], spec.keywords);

    const visits = await prisma.consultation.findMany({
      where: {
        patientId,
        ...(dateRange ? { createdAt: { ...dateRange } } : {}),
        ...(or ? { OR: or } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        status: true,
        diagnosis: true,
        notes: true,
        nextAppointment: true,
      },
    });

    return {
      success: true,
      data: visits,
      metadata: {
        collection: 'visit_history',
        count: visits.length,
        time_range: timeRangeLabel(spec.time_frame),
      },
      raw_data: visits,
    };
  }

  private async queryAllergies(patientId: string): Promise<DBQueryResult> {
    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      select: { medicalHistory: true, conditions: true },
    });

    const items: Array<{ type: string; value: string }> = [];
    const history = patient?.medicalHistory?.trim();
    if (history) items.push({ type: 'medicalHistory', value: history });
    for (const condition of patient?.conditions ?? []) {
      if (typeof condition === 'string' && condition.trim().length > 0) {
        items.push({ type: 'condition', value: condition.trim() });
      }
    }

    return {
      success: true,
      data: items,
      metadata: { collection: 'allergies', count: items.length, time_range: 'all time' },
      raw_data: items,
    };
  }

  private async queryVitalSigns(
    patientId: string,
    spec: DBQuerySpec,
    limit: number
  ): Promise<DBQueryResult> {
    const dateRange = getDateRange(spec.time_frame, spec.specific_date);

    const vitals = await prisma.patientVital.findMany({
      where: {
        patientId,
        ...(dateRange ? { timestamp: { ...dateRange } } : {}),
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        value: true,
        systolic: true,
        diastolic: true,
        heartRate: true,
        glucose: true,
        spo2: true,
        temperature: true,
        weight: true,
        unit: true,
        status: true,
        notes: true,
        timestamp: true,
      },
    });

    return {
      success: true,
      data: vitals,
      metadata: {
        collection: 'vital_signs',
        count: vitals.length,
        time_range: timeRangeLabel(spec.time_frame),
      },
      raw_data: vitals,
    };
  }

  private async queryMedicalFiles(
    patientId: string,
    spec: DBQuerySpec,
    limit: number
  ): Promise<DBQueryResult> {
    const dateRange = getDateRange(spec.time_frame, spec.specific_date);
    const or = keywordOrFilters(['name', 'type'], spec.keywords);

    const files = await prisma.medicalFile.findMany({
      where: {
        patientId,
        ...(dateRange ? { uploadedAt: { ...dateRange } } : {}),
        ...(or ? { OR: or } : {}),
      },
      orderBy: { uploadedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        type: true,
        url: true,
        uploadedAt: true,
      },
    });

    return {
      success: true,
      data: files,
      metadata: {
        collection: 'medical_files',
        count: files.length,
        time_range: timeRangeLabel(spec.time_frame),
      },
      raw_data: files,
    };
  }

  private async queryAll(
    patientId: string,
    spec: DBQuerySpec,
    limit: number
  ): Promise<DBQueryResult> {
    const slice = Math.max(1, Math.floor(limit / 3));

    const [labs, prescriptions, vitals] = await Promise.all([
      this.queryLabResults(patientId, { ...spec, target_collection: 'lab_results', limit: slice }, slice),
      this.queryPrescriptions(
        patientId,
        { ...spec, target_collection: 'prescriptions', limit: slice },
        slice
      ),
      this.queryVitalSigns(patientId, { ...spec, target_collection: 'vital_signs', limit: slice }, slice),
    ]);

    const combined = {
      lab_results: labs.data,
      prescriptions: prescriptions.data,
      vital_signs: vitals.data,
    };

    return {
      success: true,
      data: [combined],
      metadata: {
        collection: 'all',
        count: labs.metadata.count + prescriptions.metadata.count + vitals.metadata.count,
        time_range: timeRangeLabel(spec.time_frame),
      },
      raw_data: combined,
    };
  }
}
