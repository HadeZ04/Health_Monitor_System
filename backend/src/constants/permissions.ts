/**
 * Permission Constants
 * Defines all available permissions in the system
 */

/**
 * Permission codes used in the database
 * Format: RESOURCE.ACTION or RESOURCE.ACTION.SCOPE
 */
export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user.create',
  USER_READ_ALL: 'user.read.all',
  USER_READ_OWN: 'user.read.own',
  USER_UPDATE_ALL: 'user.update.all',
  USER_UPDATE_OWN: 'user.update.own',
  USER_DELETE: 'user.delete',
  USER_MANAGE: 'user.manage', // All user operations

  // Patient Management
  PATIENT_CREATE: 'patient.create',
  PATIENT_READ_ALL: 'patient.read.all',
  PATIENT_READ_OWN: 'patient.read.own',
  PATIENT_UPDATE_ALL: 'patient.update.all',
  PATIENT_UPDATE_OWN: 'patient.update.own',
  PATIENT_DELETE: 'patient.delete',
  PATIENT_MANAGE: 'patient.manage',

  // Doctor Management
  DOCTOR_CREATE: 'doctor.create',
  DOCTOR_READ_ALL: 'doctor.read.all',
  DOCTOR_READ_OWN: 'doctor.read.own',
  DOCTOR_UPDATE_ALL: 'doctor.update.all',
  DOCTOR_UPDATE_OWN: 'doctor.update.own',
  DOCTOR_DELETE: 'doctor.delete',
  DOCTOR_MANAGE: 'doctor.manage',

  // Appointment Management
  APPOINTMENT_CREATE_ALL: 'appointment.create.all',
  APPOINTMENT_CREATE_OWN: 'appointment.create.own',
  APPOINTMENT_READ_ALL: 'appointment.read.all',
  APPOINTMENT_READ_OWN: 'appointment.read.own',
  APPOINTMENT_UPDATE_ALL: 'appointment.update.all',
  APPOINTMENT_UPDATE_OWN: 'appointment.update.own',
  APPOINTMENT_DELETE_ALL: 'appointment.delete.all',
  APPOINTMENT_DELETE_OWN: 'appointment.delete.own',
  APPOINTMENT_MANAGE: 'appointment.manage',

  // Consultation Management
  CONSULTATION_CREATE: 'consultation.create',
  CONSULTATION_READ_ALL: 'consultation.read.all',
  CONSULTATION_READ_OWN: 'consultation.read.own',
  CONSULTATION_UPDATE_ALL: 'consultation.update.all',
  CONSULTATION_UPDATE_OWN: 'consultation.update.own',
  CONSULTATION_DELETE: 'consultation.delete',
  CONSULTATION_MANAGE: 'consultation.manage',

  // Vital Signs
  VITAL_CREATE_ALL: 'vital.create.all',
  VITAL_CREATE_OWN: 'vital.create.own',
  VITAL_READ_ALL: 'vital.read.all',
  VITAL_READ_OWN: 'vital.read.own',
  VITAL_UPDATE_ALL: 'vital.update.all',
  VITAL_UPDATE_OWN: 'vital.update.own',
  VITAL_DELETE: 'vital.delete',
  VITAL_MANAGE: 'vital.manage',

  // Medication Management
  MEDICATION_CREATE: 'medication.create',
  MEDICATION_READ_ALL: 'medication.read.all',
  MEDICATION_READ_OWN: 'medication.read.own',
  MEDICATION_UPDATE_ALL: 'medication.update.all',
  MEDICATION_UPDATE_OWN: 'medication.update.own',
  MEDICATION_DELETE: 'medication.delete',
  MEDICATION_MANAGE: 'medication.manage',

  // Lab Results
  LAB_RESULT_CREATE: 'lab_result.create',
  LAB_RESULT_READ_ALL: 'lab_result.read.all',
  LAB_RESULT_READ_OWN: 'lab_result.read.own',
  LAB_RESULT_UPDATE: 'lab_result.update',
  LAB_RESULT_DELETE: 'lab_result.delete',
  LAB_RESULT_MANAGE: 'lab_result.manage',

  // Report Management
  REPORT_CREATE_ALL: 'report.create.all',
  REPORT_CREATE_OWN: 'report.create.own',
  REPORT_READ_ALL: 'report.read.all',
  REPORT_READ_OWN: 'report.read.own',
  REPORT_UPDATE_ALL: 'report.update.all',
  REPORT_UPDATE_OWN: 'report.update.own',
  REPORT_DELETE: 'report.delete',
  REPORT_MANAGE: 'report.manage',

  // Message Management
  MESSAGE_CREATE: 'message.create',
  MESSAGE_READ_ALL: 'message.read.all',
  MESSAGE_READ_OWN: 'message.read.own',
  MESSAGE_UPDATE_OWN: 'message.update.own',
  MESSAGE_DELETE_ALL: 'message.delete.all',
  MESSAGE_DELETE_OWN: 'message.delete.own',
  MESSAGE_MANAGE: 'message.manage',

  // Notification Management
  NOTIFICATION_CREATE: 'notification.create',
  NOTIFICATION_READ_ALL: 'notification.read.all',
  NOTIFICATION_READ_OWN: 'notification.read.own',
  NOTIFICATION_UPDATE_OWN: 'notification.update.own',
  NOTIFICATION_DELETE_OWN: 'notification.delete.own',
  NOTIFICATION_MANAGE: 'notification.manage',

  // Role & Permission Management
  ROLE_CREATE: 'role.create',
  ROLE_READ: 'role.read',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_MANAGE: 'role.manage',

  PERMISSION_CREATE: 'permission.create',
  PERMISSION_READ: 'permission.read',
  PERMISSION_UPDATE: 'permission.update',
  PERMISSION_DELETE: 'permission.delete',
  PERMISSION_MANAGE: 'permission.manage',

  // System Settings
  SETTINGS_READ: 'settings.read',
  SETTINGS_UPDATE: 'settings.update',
  SETTINGS_MANAGE: 'settings.manage',

  // Analytics & Reports
  ANALYTICS_VIEW_ALL: 'analytics.view.all',
  ANALYTICS_VIEW_OWN: 'analytics.view.own',
  ANALYTICS_EXPORT: 'analytics.export',

  // Super Admin - All permissions
  SUPER_ADMIN: '*',
} as const;

/**
 * Permission groups for role assignment
 */
export const PERMISSION_GROUPS = {
  // Admin permissions
  ADMIN: [
    PERMISSIONS.SUPER_ADMIN, // Admin gets everything
  ],

  // Doctor permissions
  DOCTOR: [
    // Users
    PERMISSIONS.USER_READ_OWN,
    PERMISSIONS.USER_UPDATE_OWN,

    // Patients
    PERMISSIONS.PATIENT_READ_ALL,
    PERMISSIONS.PATIENT_UPDATE_ALL,

    // Appointments
    PERMISSIONS.APPOINTMENT_READ_OWN,
    PERMISSIONS.APPOINTMENT_CREATE_OWN,
    PERMISSIONS.APPOINTMENT_UPDATE_OWN,

    // Consultations
    PERMISSIONS.CONSULTATION_MANAGE,

    // Vitals
    PERMISSIONS.VITAL_READ_ALL,
    PERMISSIONS.VITAL_CREATE_ALL,

    // Medications
    PERMISSIONS.MEDICATION_MANAGE,

    // Lab Results
    PERMISSIONS.LAB_RESULT_READ_ALL,
    PERMISSIONS.LAB_RESULT_CREATE,

    // Reports
    PERMISSIONS.REPORT_CREATE_OWN,
    PERMISSIONS.REPORT_READ_ALL,

    // Messages
    PERMISSIONS.MESSAGE_CREATE,
    PERMISSIONS.MESSAGE_READ_OWN,
    PERMISSIONS.MESSAGE_UPDATE_OWN,
    PERMISSIONS.MESSAGE_DELETE_OWN,

    // Notifications
    PERMISSIONS.NOTIFICATION_READ_OWN,
    PERMISSIONS.NOTIFICATION_UPDATE_OWN,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW_OWN,
  ],

  // Patient permissions
  PATIENT: [
    // Users
    PERMISSIONS.USER_READ_OWN,
    PERMISSIONS.USER_UPDATE_OWN,

    // Patient profile
    PERMISSIONS.PATIENT_READ_OWN,
    PERMISSIONS.PATIENT_UPDATE_OWN,

    // Appointments
    PERMISSIONS.APPOINTMENT_CREATE_OWN,
    PERMISSIONS.APPOINTMENT_READ_OWN,
    PERMISSIONS.APPOINTMENT_UPDATE_OWN,
    PERMISSIONS.APPOINTMENT_DELETE_OWN,

    // Vitals
    PERMISSIONS.VITAL_READ_OWN,
    PERMISSIONS.VITAL_CREATE_OWN,

    // Medications
    PERMISSIONS.MEDICATION_READ_OWN,
    PERMISSIONS.MEDICATION_UPDATE_OWN,

    // Lab Results
    PERMISSIONS.LAB_RESULT_READ_OWN,

    // Reports
    PERMISSIONS.REPORT_READ_OWN,

    // Messages
    PERMISSIONS.MESSAGE_CREATE,
    PERMISSIONS.MESSAGE_READ_OWN,
    PERMISSIONS.MESSAGE_UPDATE_OWN,
    PERMISSIONS.MESSAGE_DELETE_OWN,

    // Notifications
    PERMISSIONS.NOTIFICATION_READ_OWN,
    PERMISSIONS.NOTIFICATION_UPDATE_OWN,
    PERMISSIONS.NOTIFICATION_DELETE_OWN,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW_OWN,
  ],

  // Staff permissions
  STAFF: [
    // Users
    PERMISSIONS.USER_READ_OWN,
    PERMISSIONS.USER_UPDATE_OWN,

    // Patients
    PERMISSIONS.PATIENT_READ_ALL,

    // Appointments
    PERMISSIONS.APPOINTMENT_MANAGE,

    // Reports
    PERMISSIONS.REPORT_READ_ALL,

    // Messages
    PERMISSIONS.MESSAGE_READ_ALL,

    // Notifications
    PERMISSIONS.NOTIFICATION_CREATE,
    PERMISSIONS.NOTIFICATION_READ_ALL,
  ],
} as const;

/**
 * Helper function to check if a permission allows an action
 * @param userPermission - User's permission code
 * @param requiredPermission - Required permission code
 * @returns true if permission is allowed
 */
export const checkPermission = (
  userPermission: string,
  requiredPermission: string
): boolean => {
  // Super admin has all permissions
  if (userPermission === PERMISSIONS.SUPER_ADMIN) {
    return true;
  }

  // Exact match
  if (userPermission === requiredPermission) {
    return true;
  }

  // Check for manage permission
  // e.g., 'user.manage' allows 'user.create', 'user.read', 'user.update', 'user.delete'
  const parts = requiredPermission.split('.');
  if (parts.length >= 2) {
    const resource = parts[0];
    const managePermission = `${resource}.manage`;
    if (userPermission === managePermission) {
      return true;
    }
  }

  return false;
};

/**
 * Helper to extract scope from permission code
 * @param permission - Permission code (e.g., 'user.read.own')
 * @returns 'all' | 'own' | undefined
 */
export const getPermissionScope = (permission: string): 'all' | 'own' | undefined => {
  const parts = permission.split('.');
  const lastPart = parts[parts.length - 1];
  
  if (lastPart === 'all' || lastPart === 'own') {
    return lastPart;
  }
  
  return undefined;
};